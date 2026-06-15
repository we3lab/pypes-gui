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
  GridCellParams,
  GridTreeNode,
  GridValidRowModel,
  useGridApiContext,
  useGridApiRef,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { useEffect } from "react";

export interface GridRow {
  id: number;
  chargeName: string;
  utility: "gas" | "electric";
  type: "customer" | "demand" | "energy";
  basicChargeLimit: number;
  assessed: "daily" | "monthly" | "quarterly" | "annual";
  monthStart: number;
  monthEnd: number;
  weekdayStart: number;
  weekdayEnds: number;
  hourStart: number;
  hourEnd: number;
  charge: number;
  unit: string;
}

const defaultRows: GridRowsProp = [
  {
    id: randomId(),
    chargeName: "Charge 1",
    utility: "electric",
    type: "demand",
    basicChargeLimit: 0,
    assessed: "daily",
    monthStart: 1,
    monthEnd: 12,
    weekdayStart: 0,
    weekdayEnds: 6,
    hourStart: 0,
    hourEnd: 23,
    charge: 1,
    unit: "",
    isNew: false,
  },
  {
    id: randomId(),
    chargeName: "Charge 2",
    utility: "electric",
    type: "demand",
    basicChargeLimit: 0,
    assessed: "daily",
    monthStart: 1,
    monthEnd: 12,
    weekdayStart: 0,
    weekdayEnds: 6,
    hourStart: 0,
    hourEnd: 23,
    charge: 1,
    unit: "",
    isNew: false,
  },
  {
    id: randomId(),
    chargeName: "Charge 3",
    utility: "electric",
    type: "demand",
    basicChargeLimit: 0,
    assessed: "daily",
    monthStart: 1,
    monthEnd: 12,
    weekdayStart: 0,
    weekdayEnds: 6,
    hourStart: 0,
    hourEnd: 23,
    charge: 1,
    unit: "",
    isNew: false,
  },
  {
    id: randomId(),
    chargeName: "Charge 4",
    utility: "electric",
    type: "demand",
    basicChargeLimit: 0,
    assessed: "daily",
    monthStart: 1,
    monthEnd: 12,
    weekdayStart: 0,
    weekdayEnds: 6,
    hourStart: 0,
    hourEnd: 23,
    charge: 1,
    unit: "",
    isNew: false,
  },
  {
    id: randomId(),
    chargeName: "Charge 5",
    utility: "electric",
    type: "demand",
    basicChargeLimit: 0,
    assessed: "daily",
    monthStart: 1,
    monthEnd: 12,
    weekdayStart: 0,
    weekdayEnds: 6,
    hourStart: 0,
    hourEnd: 23,
    charge: 1,
    unit: "",
    isNew: false,
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = React.useState<GridRow[] | []>([]);

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        chargeName: "",
        utility: "electric",
        type: "demand",
        basicChargeLimit: 0,
        assessed: "daily",
        monthStart: 1,
        monthEnd: 12,
        weekdayStart: 0,
        weekdayEnds: 6,
        hourStart: 0,
        hourEnd: 23,
        charge: 1,
        unit: "",
        isNew: false,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const rows = csv.split("\n").map((row) => row.split(",")).filter(row => row.length > 1);
        
        // Assuming the first row of the CSV contains headers
        const headers = rows[0].map((header) => header.trim());
        const formattedData: GridValidRowModel[] = rows
          .slice(1)
          .map((row: string[]) => {
            const rowData: any = {
              chargeName: "",
              utility: "electric",
              type: "demand",
              basicChargeLimit: 0,
              assessed: "daily",
              monthStart: 1,
              monthEnd: 12,
              weekdayStart: 0,
              weekdayEnds: 6,
              hourStart: 0,
              hourEnd: 23,
              charge: 1,
              unit: "",
            };
            
            headers.forEach((header, index) => {
              //also remove _ from header
              const trimmedHeader = header
                .trim()
                .toLowerCase()
                .replace("_", "")
                .replace(" ", "");
              // const trimmedHeader = header.trim().toLowerCase();

              if (row && row[index]) {
                switch (trimmedHeader) {
                  case "name":
                    rowData.chargeName = row[index].trim();
                    break;
                  case "utility":
                    rowData.utility =
                      row[index].trim() === "gas" ? "gas" : "electric";
                    break;
                  case "type":
                    rowData.type = ["customer", "demand", "energy"].includes(
                      row[index].trim().toLowerCase()
                    )
                      ? row[index].trim().toLowerCase()
                      : "customer";
                    break;
                  case "basicchargelimit":
                    rowData.basicChargeLimit = row[index]
                      ? parseFloat(row[index].trim())
                      : 1;
                    break;
                  case "assessed":
                    rowData.assessed = [
                      "daily",
                      "monthly",
                      "quarterly",
                      "annual",
                    ].includes(row[index].trim().toLowerCase())
                      ? row[index].trim().toLowerCase()
                      : "daily";
                    break;
                  case "monthstart":
                    rowData.monthStart = parseFloat(row[index].trim()) || 1;
                    break;
                  case "monthend":
                    rowData.monthEnd = parseFloat(row[index].trim()) || 12;
                    break;
                  case "weekdaystart":
                    rowData.weekdayStart = parseFloat(row[index].trim()) || 0;
                    break;
                  case "weekdayend":
                    rowData.weekdayEnds = parseFloat(row[index].trim()) || 6;
                    break;
                  case "hourstart":
                    rowData.hourStart = parseFloat(row[index].trim()) || 0;
                    break;
                  case "hourend":
                    rowData.hourEnd = parseFloat(row[index].trim()) || 23;
                    break;
                  case "charge":
                    rowData.charge = row[index]
                      ? parseFloat(row[index].trim())
                      : 1;
                    break;
                  case "unit":
                    rowData.unit = row[index] ? row[index].trim() : "";
                    break;
                  default:
                    break; // Ignore other columns
                }
              }
            });
            rowData.id = randomId();
            rowData.isNew = false;
            return rowData;
          
          });
        const cleanedData = formattedData.filter((item) => {
          return Object.keys(item).length > 2;
        });
        if(cleanedData.length === 0){
          alert("No data found in the CSV file");
        } else {
        setRows((oldRows) => cleanedData);
        }
      };
      reader.readAsText(file);
    }
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
      <GridToolbarExport />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleUploadClick}
      >
        Upload CSV
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </GridToolbarContainer>
  );
}

interface RateScheduleGridProps {
  initialRows: GridRow[] | [];
  onRowsChange?: (newRows: GridValidRowModel[]) => void;
}

export default function RateScheduleGrid(input: RateScheduleGridProps) {
  const [rows, setRows] = React.useState(
    input.initialRows.length == 0 ? defaultRows : input.initialRows
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [selectedRow, setSelectedRow] =
    React.useState<GridValidRowModel | null>(rows[0]);
  const [selectedRowId, setSelectedRowId] = React.useState<GridRowId>(
    rows[0].id
  );

  const [selectedType, setSelectedType] = React.useState<{
    [id: string]: boolean;
  }>(() => {
    const initialSelectedType: { [id: string]: boolean } = {};
    rows.forEach((row) => {
      initialSelectedType[row.id] = row.type === "customer";
    });
    return initialSelectedType;
  });

  const [selectedEnergy, setSelectedEnergy] = React.useState<{
    [id: string]: boolean;
  }>(() => {
    const initialSelectedType: { [id: string]: boolean } = {};
    rows.forEach((row) => {
      initialSelectedType[row.id] = row.type === "energy";
    });
    return initialSelectedType;
  });

  const apiRef = useGridApiRef();

  // useEffect(() => {
  //   // console.log(selectedType);
  //   // setEmptyRow();
  //   setRowModesModel({ ...rowModesModel, [selectedRowId]: { mode: GridRowModes.View } });
  // }, [selectedType]);

  useEffect(() => {
    if (input.onRowsChange) {
      input.onRowsChange([...rows]);
    }
  }, [rows]);

  const setEmptyRow = () => {
    const currentRow = rows.find((row) => row.id === selectedRowId);

    const emptyRow = {
      ...currentRow,
      basicChargeLimit: 0,
      assessed: "",
      monthStart: 1,
      monthEnd: 12,
      weekdayStart: 0,
      weekdayEnds: 6,
      hourStart: 0,
      hourEnd: 23,
    };

    // console.log("EMPTYROW", emptyRow);
    if (selectedType[selectedRowId]) {
      setRows(rows.map((row) => (row.id === selectedRowId ? emptyRow : row)));
    } else if (selectedEnergy[selectedRowId]) {
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRowId) {
            return {
              ...row,
              assessed: "",
            };
          }
          return row;
        })
      );
    }
    // console.log(
    //   "CURENTROW",
    //   rows.find((row) => row.id === selectedRowId)
    // );
  };

  const handleMonthStartChange = (id: GridRowId, value: number) => {
    if (!apiRef.current) return;
    const row = apiRef.current.getRow(id);
    if (value > row.monthEnd) {
      alert("monthStart cannot be bigger than monthEnd");
    } else {
      apiRef.current.updateRows([{ id, monthStart: value }]);
    }
  };

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
    const selectedRow = rows.find((row) => row.id === id);
    setSelectedRowId(id);
    setSelectedRow(selectedRow || null);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    // console.log("SELECTEDROW", id);
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

    const editedRow = rows.find((row) => row.id === id) as GridValidRowModel; 
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // const validateCell = (params: GridCellParams) => {
  //   if (params.field === "basicChargeLimit" && params.row.type === "customer") {
  //     params.row.basicChargeLimit.editable === false;
  //   }else {
  //     params.row.basicChargeLimit.editable === true;
  //   }
  //   return true;
  // };

  const isCellEditable = (params: GridCellParams) => {
    if (params.field === "basicChargeLimit" && selectedType[params.id]) {
      return false;
    } else if (params.field === "monthStart" && selectedType[params.id]) {
      return false;
    } else if (params.field === "monthEnd" && selectedType[params.id]) {
      return false;
    } else if (params.field === "weekdayStart" && selectedType[params.id]) {
      return false;
    } else if (params.field === "weekdayEnds" && selectedType[params.id]) {
      return false;
    } else if (params.field === "hourStart" && selectedType[params.id]) {
      return false;
    } else if (params.field === "hourEnd" && selectedType[params.id]) {
      return false;
    } else if (params.field === "assessed" && selectedType[params.id]) {
      return false;
    } else if (params.field === "assessed" && selectedEnergy[params.id]) {
      return false;
    } else {
      return true;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "chargeName",
      headerName: "Charge Name",
      width: 120,
      editable: true,
    },
    {
      field: "utility",
      headerName: "Utility",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["gas", "electric"],
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["customer", "demand", "energy"],
      preProcessEditCellProps: (params) => {
        setSelectedType((prev: any) => ({
          ...prev,
          [params.id]: params.props.value === "customer",
        }));
        setSelectedEnergy((prev: any) => ({
          ...prev,
          [params.id]: params.props.value === "energy",
        }));
        return {
          ...params,
          value: params.props.value,
        };
      },
    },
    {
      field: "basicChargeLimit",
      headerName: "Basic Charge Limit",
      width: 120,
      editable: true,
    },
    {
      field: "assessed",
      headerName: "Assessed",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["daily", "monthly", "quarterly", "annual"],
    },
    {
      field: "monthStart",
      headerName: "Month Start",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         monthStart: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value > params.row.monthEnd;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "monthEnd",
      headerName: "Month End",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         monthEnd: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value < params.row.monthStart;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "weekdayStart",
      headerName: "Weekday Start",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [0, 1, 2, 3, 4, 5, 6],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         weekdayStart: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value > params.row.weekdayEnds;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "weekdayEnds",
      headerName: "Weekday End",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [0, 1, 2, 3, 4, 5, 6],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         weekdayEnds: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value < params.row.weekdayStart;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "hourStart",
      headerName: "Hour Start",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         hourStart: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value > params.row.hourEnd;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "hourEnd",
      headerName: "Hour End",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => {
        //     if (row.id === params.id) {
        //       return {
        //         ...row,
        //         hourEnd: params.props.value,
        //       };
        //     }
        //     return row;
        //   })
        // );
        const hasError = params.props.value < params.row.hourStart;
        return { ...params.props, error: hasError };
      },
    },
    { field: "charge", headerName: "Charge", width: 120, editable: true },
    { field: "unit", headerName: "Unit", width: 120, editable: true },
    { field: "effectiveStartDate", headerName: "Effective Start Date", width: 120, type : "date", editable: true},
    { field: "effectiveEndDate", headerName: "Effective End Date", width: 120, type : "date", editable: true},
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
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        apiRef={apiRef}
        isCellEditable={isCellEditable}
        slots={{
          toolbar: EditToolbar as unknown as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel } as any,
        }}
      />
    </Box>
  );
}
