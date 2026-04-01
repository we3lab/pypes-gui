import { Modal, Box } from "@mui/material";
// import RateScheduleTable, {
//   GridRow,
// } from "../data-ingestion/rate_schedule_table";

import FlowsButtonLight from "../global/flows-button-light";
import {
  modal_box_css_scrollable,
  modal_box_wide_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import SectionTitle from "../global/section-title";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "../global/flows-button-dark";
import RateScheduleGrid, {
  GridRow,
} from "../data-ingestion/rate_schedule_table";
import { GridValidRowModel } from "@mui/x-data-grid";
import { billingDataParams } from "@/interfaces";
import FlowsTextField from "../global/flows-text-field";
import { trpc } from "@/utils/trpc";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import InfoTooltip from "../global/info-tooltip";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface RateScheduleProps {
  open: boolean;
  onClose: () => void;
  onOk?: () => void;
  initRows?: GridRow[];
  editedRateScheduleName?: string;
  mode: "edit" | "create";
  id?: string;
  // parent?: string;
}

const RateScheduleModal: React.FC<RateScheduleProps> = ({
  open,
  onClose,
  onOk,
  initRows,
  editedRateScheduleName,
  mode,
  id,
}) => {
  const [rows, setRows] = useState<GridValidRowModel[]>([]);
  // const [ initialRows, setInitialRows ] = useState<GridRow[]>(initRows ?? []);
  const [rateScheduleName, setRateScheduleName] = useState<string>("");
  const [rateSchedulesList, setRateSchedulesList] = useState<string[]>([]);
  const [randomNetwork, setRandomNetwork] = useState<string>("");
  const [validationPopup, setValidationPopup] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [effectiveStartDate, setEffectiveStartDate] = useState<Dayjs | null>(
    dayjs()
  );
  const [effectiveEndDate, setEffectiveEndDate] = useState<Dayjs | null>(
    dayjs()
  );
  const { mutateAsync: removeFileTrpc } = trpc.filesRouter.remove.useMutation();
  const { mutateAsync: uploadRateSchedule } =
    trpc.filesRouter.uploadRateSchedule.useMutation();
  const { data: rateShedules, refetch: rateShedulesRefetch } =
    trpc.filesRouter.getRateSchedules.useQuery({}, { enabled: false });
  const { data: networkData, refetch: networkDataRefetch } =
    trpc.networkRouter.list.useQuery({});

  useEffect(() => {
    networkDataRefetch().then((r) => {

      if (r.data?.availableNetworks && r.data?.availableNetworks.length > 0) {
        if(r.data?.availableNetworks.length > 1 && r.data?.availableNetworks[0].id !="" ){
        setRandomNetwork(
          r.data?.availableNetworks
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((obj) => obj.status === "finalized")[0].id
        );
      }}
    });
  }, []);

  useEffect(() => {
    if (open) {
      // console.log("initRows", initialRows);
      setRateScheduleName(editedRateScheduleName ?? "");
      rateShedulesRefetch().then((r) => {
        r.data?.data.forEach((rateSchedule: any) => {
          setRateSchedulesList((prev) => [
            ...prev,
            rateSchedule.name.split("_")[0],
          ]);
        });
      });
    }
  }, [open]);

  const handleClose = () => {
    // setInitialRows([]); // reset initialRows
    if (onClose) {
      onClose();
    }
  };

  const handleSaveClick = () => {
    if (checkValidity()) {
      const rate_schedule_data: billingDataParams = {
        billing_data_name: rateScheduleName,
        items: rows.map((row: GridValidRowModel) => {
          return {
            utility: row.utility,
            type: row.type,
            name: row.chargeName,
            assessed: row.assessed,
            basic_charge_limit: row.basicChargeLimit,
            month_start: row.monthStart,
            month_end: row.monthEnd,
            hour_start: row.hourStart,
            hour_end: row.hourEnd,
            weekday_start: row.weekdayStart,
            weekday_end: row.weekdayEnds,
            charge: row.charge,
            units: row.unit,
          };
        }),
      };
      if (mode == "create") {
        uploadRateSchedule({
          networkId: randomNetwork,
          data: rate_schedule_data,
        }).then((r) => {
          onOk && onOk();
          handleClose(); //x
        });
      } else if (mode == "edit") {
        if (id) {
          removeFileTrpc({ fileId: id }).then((r) => {
            if (r.data.status == "deleted") {
              uploadRateSchedule({
                networkId: randomNetwork,
                data: rate_schedule_data,
              }).then((r) => {
                onOk && onOk();
                handleClose(); //x
              });
            }
          });
        }
      }
    }
  };

  const checkValidity = (): boolean => {
    let isValid = true;
    let i = 0;

    if (rateSchedulesList.includes(rateScheduleName) && mode == "create") {
      // alert("Rate Schedule name already exists");
      setValidationMsg("Rate Schedule name already exists");
      setValidationPopup(true);
      isValid = false;
    }
    rows.forEach((row: GridValidRowModel) => {
      i++;
      console.log(i);
      if (row.type !== "customer") {
        if (row.monthEnd < row.monthStart) {
          // alert("month end should be greater than month start in row: " + i);
          setValidationMsg(
            "month end should be greater than month start in row: " + i
          );
          setValidationPopup(true);
          isValid = false;
        } else if (row.weekdayEnds < row.weekdayStart) {
          // alert(
          //   "weekday end should be greater than weekday start in row: " + i
          // );
          setValidationMsg(
            "weekday end should be greater than weekday start in row: " + i
          );
          setValidationPopup(true);
          isValid = false;
        } else if (row.hourEnd < row.hourStart) {
          // alert("hour end should be greater than hour start in row: " + i);
          setValidationMsg(
            "hour end should be greater than hour start in row: " + i
          );
          setValidationPopup(true);
          isValid = false;
        } else if (row.assessed === "") {
          // alert("assessed should be filled in row: " + i);
          setValidationMsg("assessed should be filled in row: " + i);
          setValidationPopup(true);
          isValid = false;
        }
      }
    });

    return isValid;
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...modal_box_wide_css }}>
          {/* <FlowsPopUpWindow
          title="Validation"
          question={validationMsg}
          onClose={() => {
            setValidationPopup(false);
          }}
          onClick={() => {
            setValidationPopup(false);
          }}
          open={validationPopup}
        /> */}
          <InfoTooltip
            open={validationPopup}
            onCloseAction={() => {
              setValidationPopup(false);
            }}
            tooltipText={validationMsg}
          />
          <button
            onClick={handleClose} // Add this to close the modal when the button is clicked
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div>
            <SectionTitle title="Rate Schedule" />
            <HelperText text="Add a new rate schedule" />
          </div>
          <div>
            <FlowsTextField
              className="m-2 p-2"
              placeholder="Rate Schedule Name"
              label="Rate Schedule Name"
              type="text"
              value={rateScheduleName}
              onChange={(e: any) => {
                setRateScheduleName(e.target.value);
              }}
            />

{/*            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  "input[type=text]:focus": { boxShadow: 0 },
                  "input[type=number]:focus": {
                    boxShadow: 0,
                  },

                  "& .MuiFormLabel-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    background: "transparent",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "black",
                    background: "transparent",
                  },
                  ".MuiButtonBase-root": {
                    paddingRight: 3,
                    paddingLeft: 0,
                    background: 0,
                  },
                  ".MuiButtonBase-root:hover": {
                    paddingRight: 3,
                    paddingLeft: 0,
                    background: 0,
                  },
                  ".MuiInputBase-input": {
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 1,
                    paddingRight: 0,
                  },
                }}
                className="mr-5 m-2 p-2"
                label="Effective Start Date"
                value={effectiveStartDate}
                onChange={(newValue: any) => setEffectiveStartDate(newValue)}
              />
            </LocalizationProvider>*/}
           {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  "input[type=text]:focus": { boxShadow: 0 },
                  "input[type=number]:focus": {
                    boxShadow: 0,
                  },

                  "& .MuiFormLabel-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    background: "transparent",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "black",
                    background: "transparent",
                  },
                  ".MuiButtonBase-root": {
                    paddingRight: 3,
                    paddingLeft: 0,
                  },
                  ".MuiButtonBase-root:hover": {
                    paddingRight: 3,
                    paddingLeft: 0,
                    background: 0,
                  },
                  ".MuiInputBase-input": {
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 1,
                    paddingRight: 0,
                  },
                }}
                label="Effective End Date"
                className="mr-5 m-2 p-2"
                value={effectiveEndDate}
                onChange={(newValue: any) => setEffectiveEndDate(newValue)}
              />
            </LocalizationProvider>*/}

            <RateScheduleGrid
              initialRows={initRows ?? []}
              onRowsChange={setRows}
            />
            <div className="flex justify-end m-2 p-2">
              <FlowsButtonDark
                className={`w-1/5 p-2 font-normal capitalize ${
                  rows.length === 0 || rateScheduleName === ""
                    ? "bg-gray-400"
                    : "bg-flows-blue"
                }`}
                onClick={handleSaveClick}
                disabled={rows.length === 0 || rateScheduleName === ""}
              >
                Save
              </FlowsButtonDark>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default RateScheduleModal;
