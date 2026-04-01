import { Modal, Box } from "@mui/material";

import FlowsButtonLight from "../global/flows-button-light";
import {
  modal_box_css_scrollable,
  modal_box_wide_css,
} from "../global/flows-style";
import HelperText from "../global/helper-text";
import SectionTitle from "../global/section-title";
import { use, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import FlowsButtonDark from "../global/flows-button-dark";
import RateScheduleGrid from "../data-ingestion/rate_schedule_table";
import { randomId } from "@mui/x-data-grid-generator";
import { GridValidRowModel } from "@mui/x-data-grid";

interface RateScheduleProps {
  open: boolean;
  onClose: () => void;
}

const UploadRateScheduleModal: React.FC<RateScheduleProps> = ({
  open,
  onClose,
}) => {
  const [csvFile, setCsvFile] = useState<any>(null);
  const [rows, setRows] = useState<GridValidRowModel[]>([]);
  useEffect(() => {
    if (!open) {
      setCsvFile(null);
    }
  }, [open]);

  //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //     //   let data: any[] = [];
  //       reader.onload = (e) => {
  //         const csv = e.target?.result as string;
  //         const rows = csv.split('\n').map(row => row.split(','));

  //         const headers = rows[0];
  //         const formattedData = rows.slice(1).map((row: string[]) => {
  //           if(row.length === headers.length) {
  //             const rowData: any = {};
  //             headers.forEach((header, index) => {
  //               rowData[header.trim()] = row[index].trim();
  //             });
  //             return {
  //               id: randomId(),
  //               ...rowData,
  //               isNew: true,
  //             };
  //           }
  //           return null; // Handle rows with incorrect length
  //         }).filter(Boolean); // Filter out null values

  //         // data = formattedData;
  //         setCsvFile(formattedData);
  //       };
  //       reader.readAsText(file);

  //     //   setCsvFile(data);
  //     }
  //   };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const rows = csv.split("\n").map((row) => row.split(","));

        // Assuming the first row of the CSV contains headers
        const headers = rows[0].map((header) => header.trim());
        const formattedData = rows.slice(1).map((row: string[]) => {
          const rowData: any = {};
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
                  rowData.basicChargeLimit = parseFloat(row[index].trim());
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
                  rowData.monthStart = parseFloat(row[index].trim());
                  break;
                case "monthend":
                  rowData.monthEnd = parseFloat(row[index].trim());
                  break;
                case "weekdaystart":
                  rowData.weekdayStart = parseFloat(row[index].trim());
                  break;
                case "weekdayend":
                  rowData.weekdayEnds = parseFloat(row[index].trim());
                  break;
                case "hourstart":
                  rowData.hourStart = parseFloat(row[index].trim());
                case "hourend":
                  rowData.hourEnd = parseInt(row[index].trim());
                  break;
                case "charge":
                  rowData.charge = parseFloat(row[index].trim());
                  break;
                case "unit":
                  rowData.unit = row[index].trim();
                  break;
                default:
                  break; // Ignore other columns
              }
            }
          });
          rowData.id = randomId();
          rowData.isNew = true;
          return rowData;
        });
        setCsvFile(formattedData);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    console.log(rows);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...modal_box_wide_css }}>
          <button
            onClick={onClose} // Add this to close the modal when the button is clicked
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div>
            <SectionTitle title="Upload Rate Schedule" />
            <HelperText text="Upload a .csv file to view it" />
          </div>
          <div>
            <input
              type="file"
              className="flex m-auto text-flows-medium-text"
              onChange={handleFileChange}
            />
            {/* <div className="flex justify-end m-2 p-2">
              <FlowsButtonDark
                className="w-1/5 p-2 font-normal capitalize "
                onClick={() => {}}
              >
                Upload .csv
              </FlowsButtonDark>
            </div> */}
            {csvFile && <RateScheduleGrid initialRows={csvFile} onRowsChange={setRows} />}

            <div className="flex justify-end m-2 p-2">
              <FlowsButtonDark
                className="w-1/5 p-2 font-normal capitalize m-2 "
                onClick={onClose}
              >
                Cancel
              </FlowsButtonDark>
              <FlowsButtonDark
                className="w-1/5 p-2 font-normal capitalize m-2"
                onClick={handleSave}
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

export default UploadRateScheduleModal;
