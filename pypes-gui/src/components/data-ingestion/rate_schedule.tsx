import { useEffect, useState } from "react";
import RateScheduleEditor from "../network/rate-schedule-editor";
import {
  page_main_section_wrapper_vertical_css,
  page_simple_section_vertical_css,
  page_table_button_notselected_css,
  page_tablecell_css,
} from "../global/flows-style";
import SectionTitle from "../global/section-title";
import FlowsButtonDark from "../global/flows-button-dark";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { trpc } from "@/utils/trpc";
import RateScheduleModal from "../analytics/rate_schedule_modal";
import { GridRow } from "./rate_schedule_table";

interface RateScheduleProps {
  networkId: string;
  site: "ingestion" | "analytics";
  okClicked: boolean;
  // setRateScheduleModalOpen: (value: boolean) => void;
  setOkClicked: (value: boolean) => void;
}

const RateSchedule = ({
  networkId,
  site,
  okClicked,
  setOkClicked,
  // setRateScheduleModalOpen,
}: RateScheduleProps) => {
  // const { data: fileList, refetch: fileListRefetch } =
  //   trpc.filesRouter.list.useQuery({
  //     networkId: networkId,
  //   });
  const [rateScheduleEditorModal, setRateScheduleEditorModal] =
    useState<boolean>(false);
  const [rateScheduleList, setRateScheduleList] = useState<any[] | undefined>(
    []
  );
  const [rateScheduleName, setRateScheduleName] = useState<string>("");
  const [selectedFileData, setSelectedFileData] = useState<string>("");
  const [addRateScheduleModalOpen, setAddRateScheduleModalOpen] = useState<boolean>(false);
  const [deleteFileModal, setDeleteFileModal] = useState<boolean>(false);
  const [rateSchedule, setRateSchedule] = useState<GridRow[]>([]);
  const [editRateScheduleModalOpen, setEditRateScheduleModalOpen] =
    useState<boolean>(false);
  const { mutateAsync: removeFileTrpc } = trpc.filesRouter.remove.useMutation();
  const { data: rateScheduleData, refetch: rateScheduleDataRefetch } =
    trpc.filesRouter.getRateSchedule.useQuery(
      { file_id: selectedFileData  },
      { enabled: false }
    );
  const { data: rateShedules, refetch: rateShedulesRefetch } =
    trpc.filesRouter.getRateSchedules.useQuery({}, { enabled: false });

  // useEffect(() => {
  //   const rate_schedule_files = fileList?.data.filter(
  //     (value) => value.type === "rate_schedule_data"
  //   );
  //   console.log("OLDDDDD", rate_schedule_files);
  //   setRateScheduleList(rate_schedule_files);
  // }, [fileList]);

  useEffect(() => {
    rateShedulesRefetch().then((r) => {
      setRateScheduleList(r.data?.data);
    });
  }, []);

  useEffect(() => {
    rateShedulesRefetch().then((r) => {
      setRateScheduleList(r.data?.data);
    });
  }, [okClicked]);

  const handleEditRateSchedule = (fileId: string) => {
    setSelectedFileData(fileId);
  };

  useEffect(() => {
    rateScheduleDataRefetch().then((r) => {
      if(selectedFileData.length>0){
      const updatedRateSchedule =r.data?.data.map( (entry: any) => ({
        chargeName: entry.name,
        utility: entry.utility,
        type: entry.type,
        basicChargeLimit: Number(entry.basicChargeLimit) || 0,
        assessed: entry.assessed,
        monthStart: Number(entry.month_start),
        monthEnd: Number(entry.month_end),
        weekdayStart: Number(entry.weekday_start),
        weekdayEnds: Number(entry.weekday_end),
        hourStart: Number(entry.hour_start),
        hourEnd: Number(entry.hour_end),
        charge: Number(entry.charge),
        unit: entry.unit || "",
        id: randomId(),
      }) );
      console.log( "UPDATED RATE SCHEDULE", updatedRateSchedule)
      setRateSchedule(updatedRateSchedule);
      setEditRateScheduleModalOpen(true);
    }
    });
  } , [selectedFileData]);

  return (
    <div>
      <RateScheduleModal
        open={editRateScheduleModalOpen}
        onClose={() => {
          setEditRateScheduleModalOpen(false);
          setSelectedFileData("");
        }}
        onOk={() => {
          setOkClicked(!okClicked);
        }}
        initRows={rateSchedule}
        editedRateScheduleName={rateScheduleName}
        id={selectedFileData}
        mode={"edit"}
      />
      <RateScheduleModal
        open={addRateScheduleModalOpen}
        onClose={() => {
          setAddRateScheduleModalOpen(false);
        }}
        onOk={() => {
          setOkClicked(!okClicked);
        }}
        mode={"create"}
        // parent={"add"}
      />
      {/* <RateScheduleEditor
        site={site}
        onClose={() => {
          setRateScheduleEditorModal(false);
          // fileListRefetch();
        }}
        onClick={() => {
          setRateScheduleEditorModal(false);
        }}
        open={rateScheduleEditorModal}
      /> */}
      {/* <div className={page_main_section_wrapper_vertical_css}> */}
      <div className="flex flex-row justify-between">
        <SectionTitle title="RATE SCHEDULE" divWidth="w-3/4" />
        <div>
          <FlowsButtonDark
            className={
              page_table_button_notselected_css +
              "capitalize text-flows-table-button-text font-normal w-full p-2"
            }
            onClick={() => {
              // setRateScheduleEditorModal(true);
              // setEditRateScheduleModalOpen(true);
              setAddRateScheduleModalOpen(true);
            }}
          >
            Add rate schedule
          </FlowsButtonDark>
        </div>
      </div>
      <div className={page_simple_section_vertical_css}>
        <TableContainer className="shadow-none" component={Paper}>
          <Table className="text-sm">
            <TableHead className="bg-flows-light-gray">
              <TableRow>
                <TableCell colSpan={3} className={page_tablecell_css}>
                  File Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rateScheduleList
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((file: any | undefined) => (
                  <TableRow key={file.id}>
                    <TableCell className={page_tablecell_css + " w-full"}>
                      {/* {file.name.split("_")[0]} */}
                      {file.name.substring(0, file.name.lastIndexOf('_'))}
                    </TableCell>
                    <TableCell className={page_tablecell_css + " "}>
                      <Button className="justify-end p-0 cursor-default">
                        <div
                          className="p-2 border cursor-pointer border-flows-light-gray hover:bg-flows-light-gray"
                          onClick={() => {
                            // setRateScheduleEditorModal(true);
                            // setRateScheduleName(file.name.split("_")[0]);
                            setRateScheduleName(file.name.substring(0, file.name.lastIndexOf('_')));
                            handleEditRateSchedule(file.id);
                          }}
                        >
                          <img src="/edit.svg" className="w-4" />
                        </div>
                      </Button>
                    </TableCell>
                    <TableCell className={page_tablecell_css + " "}>
                      <Button className="justify-end p-0 cursor-default">
                        <div
                          className="p-2 border cursor-pointer border-flows-light-gray hover:bg-flows-light-gray"
                          onClick={() => {
                            // setSelectedFileData(file.id);
                            removeFileTrpc({ fileId: file.id }).then((r) => {
                              if (r.data.status) {
                                setOkClicked(!okClicked);
                              }
                            });

                            // setDeleteFileModal(true);
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
      {/* </div> */}
    </div>
  );
};

export default RateSchedule;
