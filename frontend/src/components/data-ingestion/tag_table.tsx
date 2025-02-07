import * as React from "react";
import { Box, Modal, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditStartParams,
  GridCellEditStartReasons,
  GridColDef,
  GridEditSingleSelectCell,
  GridEditSingleSelectCellProps,
  GridEventListener,
  GridRowEditStartReasons,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowsProp,
  GridSaveAltIcon,
  GridToolbarContainer,
  GridToolbarExport,
  MuiEvent,
  ValueOptions,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import SectionTitle from "../global/section-title";
import FlowsButtonDark from "../global/flows-button-dark";
import {
  modal_box_wide_css,
  modal_main_section_wrapper_css,
  modal_section_horizontal_css_big,
  page_big_button_css,
  page_simple_section_vertical_css,
} from "../global/flows-style";
import {
  unitTypes,
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
import { FaCopy, FaDownload, FaTimes } from "react-icons/fa";
import HelperText from "../global/helper-text";
import { trpc } from "@/utils/trpc";
import useMainStore from "@/store/store";
import Image from "next/image";
import { all } from "axios";
import AddIcon from "@mui/icons-material/Add";
import { GridRowModesModel } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { GridSlots } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import UploadTagCSVModal from "./uploadTagCSVModal";
import VirtualTagModal from "./virtual-tag-modal";
import { useGridApiContext } from "@mui/x-data-grid";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  rows: any[];
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  setUpdateTable: (update: boolean) => void;
  setSelectedTableParent: (parent: string) => void;
  setSelectedRowId: (id: GridRowId) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const {
    setRows,
    setRowModesModel,
    setUpdateTable,
    setSelectedTableParent,
    setSelectedRowId,
    rows,
  } = props;
  const [UploadTagCSVModalOpen, setUploadTagCSVModalOpen] =
    useState<boolean>(false);
  const { networkIdDataIngestionPage } = useMainStore();

  const {
    data: SCADATemplateHeadersData,
    refetch: SCADATemplateHeadersDataRefetch,
    isLoading: SCADATemplateHeadersDataLoading,
  } = trpc.filesRouter.getSCADATemplateHeaders.useQuery(
    { network_id: networkIdDataIngestionPage },
    { enabled: false }
  );

  const handleClick = () => {
    const id = randomId();
    setSelectedRowId(id);
    setRows((oldRows) => [
      ...oldRows,
      {
        id: id,
        parent: "Cogenerator",
        units: "add units",
        type: "add flow",
        source_unit_id: "add source unit",
        dest_unit_id: "add dest unit",
        totalized: false,
        contents: "add contents",
        isNew: true,
      },
    ]);
    setSelectedTableParent("Cogenerator");
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const handleUploadClick = () => {
    setUploadTagCSVModalOpen(true);
  };

  const handleDownloadTemplateClick = () => {
    SCADATemplateHeadersDataRefetch().then((r) => {
      if (r.data?.response_code === "200") {
        const headers = [
          "Tag Id",
          "Parent Node/Connection",
          "Source Unit Id",
          "Destination Unit Id",
          "Units",
          "Type",
          "Contents",
          "Totalized",
        ];
        let csvContent = headers.join(",") + "\n";
        r.data?.data.forEach((item: any) => {
          if (item != "DateTime") {
            csvContent += (item || "") + ",,,,,,,\n"; // Populate only the "Tag Id" column
          }
        });

        // Download the CSV file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "SCADA_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Error response during SCADA template download");
      }
    });
  };

  return (
    <div>
      <GridToolbarContainer style={{ height: "40px" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          Add tag
        </Button>
        <GridToolbarExport
          slotProps={{
            button: { variant: "contained", color: "primary", size: "medium" },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleUploadClick}
        >
          Upload CSV
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GridSaveAltIcon />}
          onClick={handleDownloadTemplateClick}
        >
          Download template
        </Button>
      </GridToolbarContainer>
      <UploadTagCSVModal
        open={UploadTagCSVModalOpen}
        onClose={() => {
          setUploadTagCSVModalOpen(false), setUpdateTable(true);
        }}
        existingRows={rows}
        setUpdateTable={setUpdateTable}
      />
    </div>
  );
}

const TagSection = () => {
  const { networkIdDataIngestionPage } = useMainStore();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [selectedTableParent, setSelectedTableParent] = useState("");
  const [selectedRowId, setSelectedRowId] = useState<GridRowId>("");
  const [parentType, setParentType] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [sourceUnits, setSourceUnits] = useState([]);
  const [destNode, setDestNode] = useState("");
  const [destUnits, setDestUnits] = useState([]);
  const [allNodesAndConns, setAllNodesAndConns] = useState<string[]>([]);
  const [contents, setContents] = useState<string[]>([]);

  const { mutateAsync: addTagTrpc } = trpc.tagRouter.add.useMutation();
  const { mutateAsync: deleteTagTrpc } = trpc.tagRouter.remove.useMutation();
  const { mutateAsync: editTagTrpc } = trpc.tagRouter.editTag.useMutation();

  const {
    data: allTagsData,
    refetch: allTagsDataRefetch,
    isLoading: allTagsDataLoading,
  } = trpc.tagRouter.getAllFromNetwork.useQuery(
    { network_id: networkIdDataIngestionPage },
    { enabled: false }
  );

  const { data: allNodesAndConnsData, refetch: allNodesAndConnsDataRefetch } =
    trpc.nodeRouter.getAllNodesAndConnections.useQuery(
      {
        network_id: networkIdDataIngestionPage,
      },
      { enabled: false }
    );

  const { data: tagParentInfo, refetch: TagParentInfoRefetch } =
    trpc.tagRouter.getTagParentInfo.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        resource_id: selectedTableParent,
      },
      { enabled: false }
    );

  const { data: srcTagUnits = [], refetch: srcTagUnitsRefetch } =
    trpc.tagRouter.gettagUits.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        node_id: sourceNode,
      },
      { enabled: false }
    );

  const { data: destTagUnits = [], refetch: destTagUnitsRefetch } =
    trpc.tagRouter.gettagUits.useQuery(
      {
        network_id: networkIdDataIngestionPage,
        node_id: destNode,
      },
      { enabled: false }
    );

  const { data: parentData, refetch: parentDataRefetch } =
    trpc.nodeRouter.nodedata.useQuery(
      { network_id: networkIdDataIngestionPage, node_id: selectedTableParent },
      { enabled: false }
    );

  const getParentTypeAndContents = async () => {
    const content: string[] = [];
    let parent = "";
    await parentDataRefetch().then((r) => {
      const data = r.data?.data;
      const parsedData = data ? JSON.parse(data) : {};
      if (parsedData.type) {
        if (parsedData.type != "Pipe" && parsedData.type != "Wire") {
          parent = "node";
        } else {
          parent = "connection";
        }
      }
      if (parsedData.input_contents && parsedData.output_contents) {
        content.push(...parsedData.input_contents); 
        content.push(...parsedData.output_contents);
      } else if (parsedData.contents) {
        if (Array.isArray(parsedData.contents)) {
          content.push(...parsedData.contents);
        } else {
          content.push(parsedData.contents);
        }
      }
      content.push("Other");
    });
    return { parent: parent, content: content };
  };

  const getContents = async () => {
    const { parent, content } = await getParentTypeAndContents();
    setParentType(parent);
    setContents([...new Set(content)]);
  };

  function CustomTypeEditComponent(props: GridEditSingleSelectCellProps) {
    const apiRef = useGridApiContext();
    // setSelectedTableParent(props.value);
    const handleValueChange = async (event: any, newValue: any) => {
      setSelectedTableParent(newValue);
      const { parent, content } = await getParentTypeAndContents();

      if (parent == "node") {
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "source_unit_id",
          value: "total",
        });
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "dest_unit_id",
          value: "total",
        });
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "type",
          value: tagTypes[0],
        });
      }
      if (parent == "connection") {
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "type",
          value: "Flow",
        });
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "source_unit_id",
          value: sourceUnits[0],
        });
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "dest_unit_id",
          value: destUnits[0],
        });
      }
      if (contents.length > 0) {
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "contents",
          value: content[0],
        });
      }
    };

    return (
      <GridEditSingleSelectCell onValueChange={handleValueChange} {...props} />
    );
  }

  function SrcUnitEditComponent(props: GridEditSingleSelectCellProps) {
    const apiRef = useGridApiContext();
    const handleSrcValueChange = async (event: any, newValue: any) => {
      const { parent, content } = await getParentTypeAndContents();

      if (parent == "node") {
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "dest_unit_id",
          value: newValue,
        });
      }
    };
    return (
      <GridEditSingleSelectCell
        onValueChange={handleSrcValueChange}
        {...props}
      />
    );
  }

  function DestUnitEditComponent(props: GridEditSingleSelectCellProps) {
    const apiRef = useGridApiContext();
    const handleDestValueChange = async (event: any, newValue: any) => {
      const { parent, content } = await getParentTypeAndContents();

      if (parent == "node") {
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "source_unit_id",
          value: newValue,
        });
      }
    };
    return (
      <GridEditSingleSelectCell
        onValueChange={handleDestValueChange}
        {...props}
      />
    );
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "Tag ID", flex: 1, editable: true },
    {
      field: "parent",
      headerName: "Parent Node/Connection",
      flex: 1,
      type: "singleSelect",
      valueOptions:
        allNodesAndConns.length > 0 ? [...allNodesAndConns].sort() : [],
      preProcessEditCellProps: (params) => {
        setSelectedTableParent(params.props.value);
        return {
          ...params,
          value: params.props.value,
        };
      },
      renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
      editable: true,
    },
    {
      field: "source_unit_id",
      headerName: "Source Unit ID",
      flex: 1,
      type: "singleSelect",
      valueOptions: sourceUnits ? [...sourceUnits].sort() : [],
      renderEditCell: (params) => <SrcUnitEditComponent {...params} />,
      editable: true,
    },
    {
      field: "dest_unit_id",
      headerName: "Destination Unit ID",
      flex: 1,
      type: "singleSelect",
      valueOptions: destUnits ? [...destUnits].sort() : [],
      renderEditCell: (params) => <DestUnitEditComponent {...params} />,
      editable: true,
    },
    {
      field: "units",
      headerName: "Units",
      flex: 1,
      type: "singleSelect",
      valueOptions: unitTypes ? [...unitTypes].sort() : [],
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      type: "singleSelect",
      valueOptions: tagTypes ? [...tagTypes].sort() : [],
      editable: true,
    },
    {
      field: "contents",
      headerName: "Contents",
      flex: 1,
      type: "singleSelect",
      valueOptions: contents ? [...contents].sort() : contentTypes.sort(),
      editable: true,
    },
    {
      field: "totalized",
      headerName: "Totalized",
      type: "boolean",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "textPrimary",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<FaCopy />}
            label="Clone"
            onClick={handleCloneClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setSelectedRowId(id);
    const currentRow = rows.find((row) => row.id === id);
    if (currentRow.parent) {
      setSelectedTableParent(currentRow?.parent);
    } else {
      setSelectedTableParent("");
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    // console.log("SAVEID", id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    const deletedRow = rows.find((row) => row.id === id);
    const resPromise = deleteTagTrpc({
      network_id: networkIdDataIngestionPage,
      resource_id: deletedRow.parent,
      tag_id: deletedRow.id,
    });
    resPromise.then((res) => {
      console.log("Response code", res.response_code);
      if (res.response_code === "200") {
        console.log("Successfully deleted Tag");
      } else {
        console.log("Response error", res.response_code);
        alert("Error response during tag deletion: " + res.response_code);
        throw new Error("Error response during tag deletion");
      }
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
    setSelectedTableParent("");
    setSourceNode("");
    setDestNode("");
  };

  const handleCloneClick = (id: GridRowId) => () => {
    const rowIndex = rows.findIndex((row) => row.id === id);
    const clonedRow = rows.find((row) => row.id === id);
    const newId = clonedRow.id + "_clone";

    const newRows = [...rows];
    newRows.splice(rowIndex + 1, 0, {
      ...clonedRow,
      id: newId,
      isNew: true,
    });

    setRows(newRows);
    setSelectedTableParent(clonedRow.parent);
    setRowModesModel({
      ...rowModesModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    });
    // setRows([
    //   ...rows,
    //   {
    //     ...clonedRow,
    //     id: newId,
    //     isNew: true,
    //   },
    // ]);
    // setRowModesModel({
    //   ...rowModesModel,
    //   [newId]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    // });
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    // const oldRow = rows.filter((row) => row.id === newRow.id)[0];
    if (JSON.stringify(oldRow) == JSON.stringify(newRow) && !newRow.isNew) {
      console.log("No changes made");
      return oldRow;
    }

    const updatedRow = { ...newRow, isNew: false };
    const editedRow: GridRowModel = { ...updatedRow };
    delete editedRow.isNew;

    if (newRow.isNew == true) {
      const resAdd = addTagTrpc({
        network_id: networkIdDataIngestionPage,
        resource_id: newRow.parent,
        tag_data: editedRow as any,
      });
      resAdd.then((res) => {
        if (res.response_code === "200") {
          console.log("Successfully added Tag");
          setUpdateTable(true);
        } else {
          console.log("Response error", res);
          alert("Error response during tag addition: " + res.data);
          setUpdateTable(true);
        }
      });
      setUpdateTable(false);
    } else if (oldRow.parent == newRow.parent && oldRow.id == newRow.id) {
      setRows(rows.map((row) => (row.id === oldRow.id ? updatedRow : row))); //changed
      const resPromise = editTagTrpc({
        network_id: networkIdDataIngestionPage,
        resource_id: editedRow.parent,
        data: editedRow,
      });
      resPromise.then((res) => {
        if (res.response_code === "200") {
          console.log("Successfully edited Tag");
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
          setUpdateTable(true);
        } else {
          console.log("Response error", res);
          alert("Error response during tag editing: " + res.data.detail);
          // throw new Error("Error response during tag editing");
          setUpdateTable(true);
        }
      });
    } else {
      //DELETE
      const deletedRow = rows.find((row) => row.id === oldRow.id);
      setRows(rows.filter((row) => row.id !== oldRow.id));
      const resDelete = deleteTagTrpc({
        network_id: networkIdDataIngestionPage,
        resource_id: deletedRow.parent,
        tag_id: deletedRow.id,
      });
      resDelete.then((res) => {
        console.log("Response code", res.response_code);
        if (res.response_code === "200") {
          console.log("Successfully deleted Tag");
          const resAdd = addTagTrpc({
            network_id: networkIdDataIngestionPage,
            resource_id: editedRow.parent,
            tag_data: editedRow as any,
          });
          resAdd.then((res) => {
            if (res.response_code === "200") {
              console.log("Successfully added Tag");
              setUpdateTable(true);
            } else {
              console.log("Response error", res);
              alert("Error response during tag addition: " + res.data);
              // throw new Error("Error response during tag addition");
              setUpdateTable(true);
            }
          });
        } else {
          console.log("Response error", res.response_code);
          alert("Error response during tag deletion: " + res.response_code);
          throw new Error("Error response during tag deletion");
        }
      });
      //ADD
    }

    setUpdateTable(false);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleOnRowEditStart: GridEventListener<"rowEditStart"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStartReasons.cellDoubleClick) {
      event.defaultMuiPrevented = true;
    }
  };

  //const rows = [
  // {
  //   id: "A5DigestorsgasflowtoCogen1",
  //   units: "meter^3 / day",
  //   type: "Flow",
  //   source_unit_id: "total",
  //   dest_unit_id: "total",
  //   totalized: false,
  //   contents: "Biogas",
  // },
  // {
  //   id: "A5DigestorsgasflowtoCogen2",
  //   units: "foot ** 3 / minute",
  //   type: "Flow",
  //   source_unit_id: "total",
  //   dest_unit_id: "total",
  //   totalized: true,
  //   contents: "Biogas",
  // },

  // ];
  // let rows: any[] = [];

  interface DataGridData {
    rows: [];
    columns: [];
  }

  useEffect(() => {
    if (open) {
      setRows([]);
      allTagsDataRefetch().then((r) => {
        const newRows: any[] = [];
        for (const item in r.data?.data) {
          const data = r.data?.data;
          const parsedItem = data[item];
          newRows.push({
            id: parsedItem.name,
            parent: parsedItem.parent,
            units: parsedItem.data.units,
            type: parsedItem.data.type,
            source_unit_id: parsedItem.data.source_unit_id,
            dest_unit_id: parsedItem.data.dest_unit_id,
            totalized: parsedItem.data.totalized,
            contents: parsedItem.data.contents,
            isNew: false,
          });
        }
        setRows(newRows);
      });
    }
    setSelectedTableParent("");
    setUpdateTable(false);
  }, [open, updateTable]);

  useEffect(() => {
    if (selectedTableParent !== "" && selectedTableParent !== undefined) {
      TagParentInfoRefetch().then((r) => {
        // const data = r.data?.data;
        if (r.data?.data.type === "node") {
          setSourceNode(selectedTableParent);
          setDestNode(selectedTableParent);
        } else {
          setSourceNode(r.data?.data.data.source);
          setDestNode(r.data?.data.data.destination);
        }
      });
      getContents();
    }
  }, [selectedTableParent]);

  useEffect(() => {
    if (sourceNode !== "" && sourceNode !== undefined) {
      srcTagUnitsRefetch().then((r) => {
        setSourceUnits(r.data?.data);
      });
    }
  }, [sourceNode]);

  useEffect(() => {
    if (destNode !== "" && destNode !== undefined) {
      destTagUnitsRefetch().then((r) => {
        setDestUnits(r.data?.data);
      });
    }
  }, [destNode]);

  useEffect(() => {
    // setTableData(input.initialRows);
    allNodesAndConnsDataRefetch().then((r) => {
      // console.log("allNodesAndConns", r.data?.data);
      setAllNodesAndConns(r.data?.data);
    });
  }, [rows]);

  const handleModalClose = () => {
    setRowModesModel({
      ...rowModesModel,
      [selectedRowId]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <SectionTitle title="TAG EDITOR" divWidth="w-3/4" />
      </div>
      <div className={modal_main_section_wrapper_css + " justify-center"}>
        <div className={modal_section_horizontal_css_big}>
          <FlowsButtonDark
            className={page_big_button_css + " w-full"}
            onClick={() => {
              setOpen(true);
            }}
          >
            Open Tag Editor
          </FlowsButtonDark>
        </div>
        <VirtualTagModal networkId={networkIdDataIngestionPage} />
      </div>
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={{ ...modal_box_wide_css }}>
          <button
            onClick={handleModalClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div>
            <SectionTitle title="Tag Editor" />
            <HelperText text="Add/ edit tag details" />
          </div>
          <div className={page_simple_section_vertical_css}>
            {allTagsDataLoading ? (
              <div className="z-10 justify-center w-full m-auto bg-white opacity-70">
                <div className="2-[100px] m-auto">
                  <Image
                    src="/loading.gif"
                    alt="loading"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            ) : (
              allTagsData && (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 8,
                      },
                    },
                  }}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  onRowEditStop={handleRowEditStop}
                  onRowEditStart={handleOnRowEditStart}
                  processRowUpdate={processRowUpdate}
                  slots={{
                    toolbar: EditToolbar as GridSlots["toolbar"],
                  }}
                  slotProps={{
                    toolbar: {
                      setRows,
                      setRowModesModel,
                      setUpdateTable,
                      setSelectedTableParent,
                      setSelectedRowId,
                      rows,
                    },
                  }}
                  //pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              )
            )}
          </div>
          <div className="flex justify-end m-2 p-2">
            <FlowsButtonDark
              className={"w-1/5 font-normal capitalize p-2"}
              onClick={handleModalClose}
            >
              Done
            </FlowsButtonDark>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TagSection;
