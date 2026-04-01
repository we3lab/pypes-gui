import {
  Box,
  Button,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  modal_bottom_subsection_wrapper_css,
  modal_box_wide_css,
  modal_main_section_wrapper_css,
  modal_section_horizontal_css,
  modal_section_vertical_css,
  modal_textfield_charge_css,
  modal_textfield_first_charge_css,
  page_tablecell_css,
} from "../global/flows-style";
import SectionTitle from "../global/section-title";
import DiagramTitle from "../global/diagram-title";
import { useState } from "react";
import { billingDataParams, billingItem } from "@/interfaces";
import { trpc } from "@/utils/trpc";
import useMainStore from "@/store/store";
import FlowsTextField from "../global/flows-text-field";
import FlowsSelect from "../global/flows-select";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";

interface RateScheduleEditorProps {
  onClick?: any;
  onClose: any;
  open: any;
  site: "ingestion" | "analytics";
}

const RateScheduleEditor: React.FC<RateScheduleEditorProps> = ({
  onClick,
  onClose,
  open,
  site,
}) => {
  const RATE_UTILITIES = ["gas", "electric"];
  const RATE_TYPES = ["customer", "demand", "energy"];
  const ASESSED_TYPES = ["daily", "monthly", "quarterly", "annual"];
  const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const DAYS = [0, 1, 2, 3, 4, 5, 6];
  const HOURS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24,
  ];
  const CHARGE_DATA = [
    "Name",
    "Utility",
    "Type",
    "Basic charge limit",
    "Assessed",
    "Month start",
    "Month end",
    "Weekday start",
    "Weekday end",
    "Hour start",
    "Hour end",
    "Charge",
    "Unit",
    "",
  ];

  const [deleteChargeModal, setDeleteChargeModal] = useState<boolean>(false);
  const [chargeCheckAlertModal, setChargeCheckAlertModal] =
    useState<boolean>(false);
  const [chargeCheckAlertText, setChargeCheckAlertText] = useState<string>("");
  const [selectedChargeData, setSelectedChargeData] = useState<string>("");
  const [billingData, setBillingData] = useState<billingDataParams>({
    billing_data_name: "",
    items: [],
  });
  const [billingItem, setBillingItem] = useState<billingItem>({
    utility: "electric",
    type: "demand",
    name: "",
    assessed: "daily",
    basic_charge_limit: 0,
    month_start: 1,
    month_end: 12,
    hour_start: 0,
    hour_end: 24,
    weekday_start: 0,
    weekday_end: 6,
    charge: 1,
    units: "",
  });

  const billingItemCheck = () => {
    if (billingItem.type != "customer") {
      if (billingItem?.month_end! < billingItem?.month_start!) {
        return "Month end must be greater than or equal to month start";
      } else if (billingItem?.weekday_end! < billingItem?.weekday_start!) {
        return "Weekday end must be greater than or equal to weekday start";
      } else if (billingItem?.hour_end! < billingItem?.hour_start!) {
        return "Hour end must be greater than or equal to hour start";
      } else if (billingItem.assessed == "") {
        return "Assessed must be selected";
      } else {
        return "passed";
      }
    } else {
      return "passed";
    }
  };

  const handleAddNewBillingItem = () => {
    console.log("billingItem", billingItem);
    if (billingItemCheck() != "passed") {
      //alert(billingItemCheck());
      setChargeCheckAlertText(billingItemCheck());
      setChargeCheckAlertModal(true);
      return;
    }
    const updatedBillingData = { ...billingData };
    updatedBillingData.items.push(billingItem);
    setBillingData(updatedBillingData);
  };

  function capitalizeWords(inputString: string): string {
    const words = inputString.split("_");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const resultString = capitalizedWords.join(" ");

    return resultString;
  }

  const { mutateAsync: uploadRateSchedule } =
    trpc.filesRouter.uploadRateSchedule.useMutation();
  const { networkIdDataIngestionPage, networkIdAnalyticsPortal } = useMainStore();
  let localNetworkId=""
  if(site == "ingestion"){
    localNetworkId = networkIdDataIngestionPage
  }else if(site == "analytics"){
    localNetworkId = networkIdAnalyticsPortal
  }

  const { data: fileList, refetch } = trpc.filesRouter.list.useQuery({
    networkId: localNetworkId,
  });


  const handleCreateNewRateSchadle = () => {
    uploadRateSchedule({
      networkId: localNetworkId,
      data: billingData,
    }).then(() => {
      refetch();
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_wide_css }}>
        <FlowsPopUpWindow
          title="Invalid charge data"
          onClose={() => {
            setChargeCheckAlertModal(false);
          }}
          open={chargeCheckAlertModal}
          error_msg={true}
        >
          <div>
            <p>{chargeCheckAlertText}!</p>
          </div>
        </FlowsPopUpWindow>
        <FlowsPopUpWindow
          title="Delete"
          question="Are you sure you want to delete this charge?"
          onClose={() => {
            setDeleteChargeModal(false);
          }}
          onClick={() => {
            setDeleteChargeModal(false);
            //handleChargeRemove(selectedChargeData);
          }}
          open={deleteChargeModal}
        />
        <div className={modal_main_section_wrapper_css}>
          <SectionTitle title="RATE SCHEDULE EDITOR" />
          <div className={modal_section_vertical_css}>
            <FlowsTextField
              className="w-1/10 mt-10 ml-0"
              label="Rate schedule name"
              value={billingData.billing_data_name}
              placeholder="Start typing..."
              onChange={(e: any) =>
                setBillingData((prevState) => ({
                  ...prevState,
                  billing_data_name: e.target.value,
                }))
              }
            />
            <div className={modal_bottom_subsection_wrapper_css}>
              <DiagramTitle title="Charge editor" />
              <div className={modal_section_vertical_css}>
                <div
                  className={
                    modal_section_horizontal_css + " pt-9 items-center"
                  }
                >
                  <FlowsTextField
                    className={modal_textfield_first_charge_css}
                    label="Charge name"
                    placeholder="Start typing..."
                    value={billingItem.name}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Utility"
                    placeholder="Please select"
                    value={billingItem.utility}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        utility: e.target.value,
                      }));
                    }}
                  >
                    {RATE_UTILITIES.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Type"
                    placeholder="Please select"
                    value={billingItem.type}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        type: e.target.value,
                      }));
                      if (e.target.value == "customer") {
                        setBillingItem((prevBillingItem) => ({
                          ...prevBillingItem,
                          basic_charge_limit: null,
                          assessed: null,
                          month_start: null,
                          month_end: null,
                          weekday_start: null,
                          weekday_end: null,
                          hour_start: null,
                          hour_end: null,
                        }));
                      } else if (e.target.value == "energy") {
                        setBillingItem((prevBillingItem) => ({
                          ...prevBillingItem,
                          assessed: null,
                        }));
                      }
                    }}
                  >
                    {RATE_TYPES.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_charge_css}
                    label="Basic charge limit"
                    type="number"
                    placeholder="0"
                    value={billingItem.basic_charge_limit}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        basic_charge_limit: parseFloat(e.target.value),
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Assessed"
                    placeholder="Start typing..."
                    value={billingItem.assessed}
                    disabled={
                      billingItem.type === "customer" ||
                      billingItem.type === "energy"
                    }
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        assessed: e.target.value,
                      }));
                    }}
                  >
                    {ASESSED_TYPES.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>

                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Month start"
                    type="number"
                    value={billingItem.month_start}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        month_start: parseFloat(e.target.value),
                      }));
                    }}
                  >
                    {MONTHS.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Month end"
                    type="number"
                    value={billingItem.month_end}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        month_end: parseFloat(e.target.value),
                      }));
                    }}
                  >
                    {MONTHS.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Weekday start"
                    type="number"
                    value={billingItem.weekday_start}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        weekday_start: parseFloat(e.target.value),
                      }));
                    }}
                  >
                    {DAYS.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>
                  <FlowsSelect
                    className={modal_textfield_charge_css}
                    label="Weekday ends"
                    type="number"
                    value={billingItem.weekday_end}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        weekday_end: parseFloat(e.target.value),
                      }));
                    }}
                  >
                    {DAYS.map((rate_type, index) => (
                      <MenuItem key={index} value={rate_type}>
                        {rate_type}
                      </MenuItem>
                    ))}
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_charge_css}
                    label="Hour start"
                    type="number"
                    value={billingItem.hour_start}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        hour_start: parseFloat(e.target.value),
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_charge_css}
                    label="Hour ends"
                    type="number"
                    value={billingItem.hour_end}
                    disabled={billingItem.type === "customer"}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        hour_end: parseFloat(e.target.value),
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_charge_css}
                    label="Charge"
                    type="number"
                    value={billingItem.charge}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        charge: parseFloat(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_charge_css}
                    label="Units"
                    type="text"
                    placeholder="Start typing..."
                    value={billingItem.units}
                    onChange={(e: any) => {
                      setBillingItem((prevState) => ({
                        ...prevState,
                        units: e.target.value,
                      }));
                    }}
                  />
                  <div className="h-full ml-5 items-center">
                    {/* <FlowsButtonDark
                    disabled={billingItem.name === ""}
                      className="font-normal capitalize p-2 min-w-1/10 text-flows-table-text"
                      onClick={handleAddNewBillingItem}
                    >
                      Add
                    </FlowsButtonDark> */}
                    <Button className="p-0 justify-end cursor-default">
                      <div
                        className="p-2 cursor-pointer hover:bg-flows-light-gray"
                        onClick={handleAddNewBillingItem}
                      >
                        <img src="/green-plus-light.svg" className="w-7" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className={modal_bottom_subsection_wrapper_css}>
              <DiagramTitle title="Added charges" />

              <TableContainer
                component={Paper}
                className="shadow-none max-h-80 h-fit mt-5"
              >
                <Table className="overflow-x-auto table-auto">
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      {CHARGE_DATA?.map((title) => (
                        <TableCell
                          key={title}
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {capitalizeWords(title)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billingData.items.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-200">
                        {/* <TableCell className={page_tablecell_css + " whitespace-nowrap"}>{index}</TableCell> */}
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.utility}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.type}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.basic_charge_limit}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.assessed}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.month_start}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.month_end}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.weekday_start}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.weekday_end}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.hour_start}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.hour_end}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.charge}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          {item.units}
                        </TableCell>
                        <TableCell
                          className={page_tablecell_css + " whitespace-nowrap"}
                        >
                          <Button className="p-0 w-full justify-end cursor-default">
                            <div
                              className="p-2 border border-flows-light-gray cursor-pointer hover:bg-flows-light-gray"
                              onClick={() => {
                                setSelectedChargeData("to_delete");
                                setDeleteChargeModal(true);
                              }}
                            >
                              <img src="/trash-delete.svg" className="w-4" />
                            </div>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/10 font-normal capitalize p-2"
            onClick={() => {
              onClose();
              setBillingData({
                billing_data_name: "",
                items: [],
              });
              setBillingItem({
                utility: "electric",
                type: "demand",
                name: "",
                assessed: "daily",
                basic_charge_limit: 0,
                month_start: 1,
                month_end: 12,
                hour_start: 0,
                hour_end: 24,
                weekday_start: 0,
                weekday_end: 6,
                charge: 1,
                units: "",
              });
            }}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/10 font-normal capitalize ml-5 p-2"
            disabled={billingData.billing_data_name === ""}
            onClick={() => {
              onClick();
              handleCreateNewRateSchadle();
              console.log("nID", localNetworkId);
              setBillingData({
                billing_data_name: "",
                items: [],
              });
              setBillingItem({
                utility: "electric",
                type: "demand",
                name: "",
                assessed: "daily",
                basic_charge_limit: 0,
                month_start: 1,
                month_end: 12,
                hour_start: 0,
                hour_end: 24,
                weekday_start: 0,
                weekday_end: 6,
                charge: 1,
                units: "",
              });
            }}
          >
            Create
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default RateScheduleEditor;
