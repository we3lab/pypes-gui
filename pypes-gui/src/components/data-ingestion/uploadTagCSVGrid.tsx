import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  GridToolbarExport,
  GridToolbarExportContainer,
  GridCellEditStopParams,
  MuiEvent,
  GridCellEditStopReasons,
  GridCellEditStartParams,
  GridRowParams,
  GridValidRowModel,
  GridRowSelectionCheckboxParams,
  useGridApiRef,
  useGridApiEventHandler,
  GridRowSelectionModel,
  GridCellModesModel,
  GridRowEditStartReasons,
  GridEditSingleSelectCell,
  useGridApiContext,
  GridEditSingleSelectCellProps,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import {
  unitTypes,
  contentTypes,
  tagTypes,
} from "../tag-creation-modal/tag-creation-modal";
import { trpc } from "@/utils/trpc";
import useMainStore from "@/store/store";
import { useEffect, useState } from "react";
import { GridCallbackDetails } from "@mui/x-data-grid";

export interface GridRow {
  id: number;
  units: string;
  type: string;
  source_unit_id: string | number;
  dest_unit_id: string | number;
  totalized: boolean;
  contents: string;
  isNew: boolean;
  parent: string;
}

const defaultRows: GridRowsProp = [];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
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
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer style={{ height: "40px" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add record
      </Button>
      <GridToolbarExport
        slotProps={{
          button: { variant: "contained", color: "primary", size: "medium" },
        }}
      />
    </GridToolbarContainer>
  );
}

interface UploadTagCSVGridProps {
  initialRows: GridValidRowModel[] | [];
  setRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
  rows: GridValidRowModel[];
}

export default function UploadTagCSVGrid({
  initialRows,
  setRows,
  rows,
}: UploadTagCSVGridProps) {
  // const [rows, setRows] = useState(defaultRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { networkIdDataIngestionPage } = useMainStore();
  const [selectedTableParent, setSelectedTableParent] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [sourceUnits, setSourceUnits] = useState([]);
  const [destNode, setDestNode] = useState("");
  const [destUnits, setDestUnits] = useState([]);
  const [allNodesAndConns, setAllNodesAndConns] = useState<string[]>([]);
  const [contents, setContents] = useState<string[]>([]);
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [parentType, setParentType] = useState("");
  // const [tableData, setTableData] = useState({});
  const apiRef = useGridApiRef();

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

    const getParentTypeAndContents = async() => {
      const content: string[] = [];
      let parent ="";
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
      return {parent:parent, content:content};
    }
  
  
    const getContents = async() => {
      const {parent, content} = await getParentTypeAndContents();
      setParentType(parent);
      setContents([...new Set(content)]);
    };

  // const getContents = () => {
  //   const content: string[] = [];
  //   parentDataRefetch().then((r) => {
  //     const data = r.data?.data;
  //     const parsedData = data ? JSON.parse(data) : [];
  //     if (parsedData.input_contents && parsedData.output_contents) {
  //       content.push(...parsedData.input_contents);
  //       content.push(...parsedData.output_contents);
  //     } else if (parsedData.contents) {
  //       if (Array.isArray(parsedData.contents)) {
  //         content.push(...parsedData.contents);
  //       } else {
  //         content.push(parsedData.contents);
  //       }
  //     }
  //     setContents([...new Set(content)]);
  //   });
  // };

  useEffect(() => {
    if (initialRows.length !== 0) {
      setRows(initialRows);
    }
  }, [initialRows]);

  useEffect(() => {
    if (selectedTableParent !== "" && selectedTableParent !== undefined) {
      if (allNodesAndConns.includes(selectedTableParent)) {
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
      }
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
  }, [initialRows]);

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
    const currentRow = rows.find((row) => row.id === id);
    if (currentRow?.parent != "" && currentRow?.parent != undefined) {
      setSelectedTableParent(currentRow?.parent);
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }

    setSelectedTableParent("");
    setSourceNode("");
    setDestNode("");
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === oldRow.id ? updatedRow : row)));
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    // console.log("ROWS", rows);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
    // console.log("ROWMODEL CHANGE", newRowModesModel);
  };

  const handleOnRowEditStart: GridEventListener<"rowEditStart"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStartReasons.cellDoubleClick) {
      event.defaultMuiPrevented = true;
    }
  };

  function CustomTypeEditComponent(props: GridEditSingleSelectCellProps) {
    const apiRef = useGridApiContext();
    // setSelectedTableParent(props.value);
    const handleValueChange = async (event:any,newValue:any) => {
      setSelectedTableParent(newValue);
      const {parent,content}=await getParentTypeAndContents();
      
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
      if(contents.length > 0){
        await apiRef.current.setEditCellValue({
          id: props.id,
          field: "contents",
          value: content[0],
        });
      }
    };

    return (
      <GridEditSingleSelectCell  onValueChange={handleValueChange} {...props} />
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "Tag ID", flex: 1, editable: true },
    {
      field: "parent",
      headerName: "Parent Node/Connection",
      flex: 1,
      type: "singleSelect",
      valueOptions: allNodesAndConns.length >0 ? [...allNodesAndConns].sort() : [],
      preProcessEditCellProps: (params)  => {
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
      sortable: true,
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
      //add a default value
      editable: true,
    },
    {
      field: "totalized",
      headerName: "Totalized",
      type: "boolean",
      flex: 1,
      editable: true,
      // valueFormatter: (params) => (params.value ? 'true' : 'false'),
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
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
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
        processRowUpdate={processRowUpdate}
        onRowEditStart={handleOnRowEditStart}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
