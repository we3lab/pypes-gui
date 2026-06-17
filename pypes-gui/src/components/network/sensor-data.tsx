import { trpc } from "@/utils/trpc";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useMainStore from "@/store/store";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SectionTitle from "../global/section-title";
import HelperText from "../global/helper-text";
import {
  modal_tab_notselected_css,
  modal_tab_selected_css,
  page_main_section_wrapper_vertical_css,
  page_section_horizontal_css,
  page_section_vertical_css,
  page_simple_section_vertical_css,
  page_table_button_notselected_css,
  page_tablecell_css,
} from "../global/flows-style";
import FlowsSelect from "../global/flows-select";
import FlowsButtonDark from "../global/flows-button-dark";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsPopUpWindow from "../global/flows-pop-up-window";
import TagSection from "../data-ingestion/tag_table";
import FlowsTextField from "../global/flows-text-field";
import { da } from "@faker-js/faker";

interface SensorDataProps {
  networkUpdated: boolean;
  setNetworkUpdated: (state: boolean) => void;
  facilities: string[];
  setFacilities: (state: string[]) => void;
  setHistoricalData: (state: string[]) => void;
  setStreamingData: (state: string[]) => void;
  // setSelectedFacilityId: (state: string) => void;
  // selectedFacilityId: string;
  historicalData: string[];
  streamingData: string[];
}

const SensorData = ({
  networkUpdated,
  setNetworkUpdated,
  facilities,
  setFacilities,
  historicalData,
  setHistoricalData,
  streamingData,
  setStreamingData,
  // setSelectedFacilityId,
  // selectedFacilityId,
}: SensorDataProps) => {
  const { networkIdDataIngestionPage, parentId } = useMainStore();
  const [deleteFileModal, setDeleteFileModal] = useState<boolean>(false);
  const [deleteRateModal, setDeleteRateModal] = useState<boolean>(false);
  const [selectedRateData, setSelectedRateData] = useState<string>("");
  const [selectedFileData, setSelectedFileData] = useState<string>("");
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [previewRowsPerPage, setPreviewRowsPerPage] = useState<number>(5);
  const [previewTotalPages, setPreviewTotalPages] = useState<number>(5);
  const [previewTotalRows, setPreviewTotalRows] = useState<number>(5);
  const [previewFileId, setPreviewFileId] = useState<string>("");
  const [previewDataColumns, setPreviewDataColumns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { data: fileList, refetch } = trpc.filesRouter.list.useQuery({
    networkId: networkIdDataIngestionPage,
  });

  const [csvList, setCsvList] = useState<any[] | undefined>([]);
  
  const { mutateAsync: removeFileTrpc } = trpc.filesRouter.remove.useMutation();
  const [showPreviewTable, setShowPreviewTable] = useState<boolean>(false);
  const [uploadDataType, setUploadDataType] = useState<string>("other_data");
  const [parentNodes, setParentNodes] = useState<any[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [dataStreamTypes, setDataStreamTypes] = useState<string[]>(["Gmail"]);
  const [selectedDataStreamType, setSelectedDataStreamType] =
    useState<string>("Gmail");
  const [dataStreamInputs, setDataStreamInputs] = useState<any>({
    client_id: "",
    client_secret: "",
    refresh_token: "",
    email: "",
    name: "",
  });
  const [isDataStreamConnected, setIsDataStreamConnected] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedDataStreams, setSavedDataStreams] = useState<any[]>([]);

  const session = useSession();
  const userToken = session.data?.user.token;

  const { data: previewData, isLoading: previewDataLoading } =
    trpc.filesRouter.preview.useQuery({
      fileId: previewFileId,
      page_cout: previewPage,
    });

  const {
    data: network,
    refetch: networkRefetch,
    isLoading: networkLoading,
    isFetched,
  } = trpc.networkRouter.get.useQuery(
    {
      network_id: networkIdDataIngestionPage,
    },
    { enabled: false }
  );

  const { mutateAsync: saveDataStreamTRPC } =
    trpc.filesRouter.saveDataStream.useMutation();

  const { data: streamingDataList, refetch: streamingDataRefetch } =
    trpc.filesRouter.getAllStreams.useQuery({});

  const {mutateAsync: removeDataStreamTRPC} = trpc.filesRouter.removeDataStream.useMutation();

  useEffect(() => {
    if (previewData?.data[0] != null) {
      setPreviewDataColumns(Object.keys(previewData?.data[0]));
      setShowPreviewTable(true);
      setPreviewRowsPerPage(previewData.rows_per_page);
      setPreviewTotalPages(previewData.total_pages);
      setPreviewTotalRows(previewData.total_rows);
    } else {
      //setShowPreviewTable(false);
    }
  }, [previewData]);

  useEffect(() => {
    const nodeIds = parentNodes
      .filter((node) => node.type === "Facility" || node.type === "Network")
      .map((node) => node.id);
    setFacilities(nodeIds);
  }, [parentNodes]);

  useEffect(() => {
    networkRefetch().then((r) => {
      if (networkIdDataIngestionPage == "") {
        setParentNodes([]);
      }
      if (r.data && networkIdDataIngestionPage != "" && networkUpdated) {
        const nnetwork = JSON.parse(r.data.data);
        const networknodes = nnetwork.nodes;
        const Nodes: any[] = [];
        networknodes?.forEach((node: any) => {
          const newnode = {
            id: node,
            type: nnetwork[node].type,
          };
          Nodes.push(newnode);
        });
        setParentNodes(Nodes);
        setNetworkUpdated(false);
      }
    });
  }, [networkIdDataIngestionPage, parentId, networkUpdated]);

  useEffect(() => {
    networkRefetch().then((r) => {
      if (r.data && networkIdDataIngestionPage != "") {
        const nnetwork = JSON.parse(r.data.data);
        const networknodes = nnetwork.nodes;
        const Nodes: any[] = [];
        networknodes?.forEach((node: any) => {
          const newnode = {
            id: node,
            type: nnetwork[node].type,
          };
          Nodes.push(newnode);
        });
        setParentNodes(Nodes);
      }
    });
  }, []);

  useEffect(() => {
    const csv_files = fileList?.data.filter(
      (value) => value.type != "rate_schedule_data" && value.type != ""
    );

    setCsvList(csv_files);
    if (csv_files && csv_files.length > 0) {
      const historicalData = csv_files
        .filter((file: any | undefined) => file.name.split("_")[0] != "network")
        .map((file) => file.name);

      // console.log("ASDSAD", historicalData);
      setHistoricalData(historicalData);
    }
  }, [fileList]);

  useEffect(() => {
    if (streamingDataList) {
      setStreamingData(
        // stramingDataList.data.map((data: any) => data.metadata.data_stream_name)
        streamingDataList.data
      );
    }
  }, [streamingDataList]);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setFile(e.target.files[0]);
  //   }
  // };

  const handleUpload = async (file: File) => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("csv_file", file);
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/upload/file?network_id=${networkIdDataIngestionPage}&facility_id=${selectedFacilityId}&data_type=${uploadDataType}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        });

        if (res.ok) {
          setFile(null);
          setUploading(false);
          setUploadSuccess(true);
          refetch();
        } else {
          const errorResponse = await res.json();
          console.error("Error uploading file:", errorResponse);
          setUploadError(
            `Error uploading file. Please try again.: ${errorResponse.detail}`
          );
          setUploading(false);
        }
      } catch (error) {
        console.error("Error decoding binary data:", error);
        setUploadError(`Error uploading file. Please try again.: ${error}`);
        setUploading(false);
      }
    }
  };

  function capitalizeWords(inputString: string): string {
    const words = inputString.split("_");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const resultString = capitalizedWords.join(" ");

    return resultString;
  }

  const handleFileRemove = (fileId: string) => {
    removeFileTrpc({ fileId }).then(() => {
      refetch();
    });
  };

  const handlePreviewBack = () => {
    setPreviewPage(previewPage - 1);
    refetch();
  };

  const handlePreviewNext = () => {
    setPreviewPage(previewPage + 1);
    refetch();
  };

  const handleDataTypeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadDataType(e.target.value);
  };

  const handleUploadButtonClick = () => {
    // Programmatically trigger the file selection dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: any) => {
    // Handle file selection and initiate upload process
    setUploadError("");
    setUploadSuccess(false);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // You can perform additional validation or processing here if needed
      handleUpload(selectedFile);
    }
  };

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const handleConnectDataStreamButtonClick = () => {
    const metadata = {
      client_id: dataStreamInputs.client_id,
      client_secret: dataStreamInputs.client_secret,
      refresh_token: dataStreamInputs.refresh_token,
      allowed_senders: [dataStreamInputs.email],
      data_stream_name: dataStreamInputs.name,
    };
    saveDataStreamTRPC({
      data_type: selectedDataStreamType.toUpperCase(),
      metadata: metadata,
    }).then((r) => {
      if (r.response_code == "200") {
        streamingDataRefetch();
      }
    });
    setIsDataStreamConnected(true);
    
  };

  const deleteDataStream = (streamId: string) => {
    removeDataStreamTRPC({stream_id: streamId}).then((r) => {
      if (r.response_code == "200") {
        console.log("Stream deleted successfully");
        streamingDataRefetch();
      }
    });
  }

  return (
    <div className={page_section_vertical_css}>
      <FlowsPopUpWindow
        title="Delete"
        question="Are you sure you want to delete this item?"
        onClose={() => {
          setDeleteFileModal(false);
        }}
        onClick={() => {
          setDeleteFileModal(false);
          handleFileRemove(selectedFileData);
        }}
        open={deleteFileModal}
      />
      <FlowsPopUpWindow
        title="Delete"
        question="Are you sure you want to delete this item?"
        onClose={() => {
          setDeleteRateModal(false);
        }}
        onClick={() => {
          setDeleteRateModal(false);
          handleFileRemove(selectedRateData);
        }}
        open={deleteRateModal}
      />
      <div className={page_section_horizontal_css}>
        <div className={page_main_section_wrapper_vertical_css + " w-1/2"}>
          <SectionTitle title="SCADA DATA" />
          {/* <HelperText text="You can upload your sensor data here." /> */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mt-5"
            centered
          >
            {["Data Upoad", "Data stream"].map((dataType: any, index: any) => (
              <Tab
                key={index}
                label={dataType}
                className={`${
                  selectedTab === index
                    ? modal_tab_selected_css
                    : modal_tab_notselected_css
                } `}
              />
            ))}
          </Tabs>
          <div className={page_simple_section_vertical_css}>
            {selectedTab == 0 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <RadioGroup
                  className="w-1/2 p-5"
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={uploadDataType ? uploadDataType : ""}
                  onChange={handleDataTypeSelect}
                >
                  <FormControlLabel
                    value="scada_data"
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: "#2d4778",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography className="text-flows-normal-text">
                        SCADA data
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="other_data"
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: "#2d4778",
                          },
                        }}
                        color="primary"
                      />
                    }
                    label={
                      <Typography className="text-flows-normal-text">
                        Other data
                      </Typography>
                    }
                  />
                </RadioGroup>
              </div>
            )}
            {selectedTab == 1 && (
              <div className="flex flex-col">
                <FlowsTextField
                  className="m-2 p-2 mt-5"
                  placeholder="Data stream name"
                  label="Data stream name"
                  type="text"
                  value={dataStreamInputs.name}
                  onChange={(e: any) => {
                    setDataStreamInputs({
                      ...dataStreamInputs,
                      name: e.target.value,
                    });
                  }}
                />
                <FlowsSelect
                  label="Data stream type"
                  placeholder="Please select type"
                  value={selectedDataStreamType}
                  onChange={(e: any) => {
                    setSelectedDataStreamType(e.target.value);
                  }}
                >
                  {dataStreamTypes?.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </FlowsSelect>
                {selectedDataStreamType === "Gmail" && (
                  <div className="flex flex-col">
                    <FlowsTextField
                      className="m-2 p-2 mt-5"
                      placeholder="E-mail address"
                      label="E-mail address"
                      type="text"
                      value={dataStreamInputs.email}
                      onChange={(e: any) => {
                        setDataStreamInputs({
                          ...dataStreamInputs,
                          email: e.target.value,
                        });
                      }}
                    />
                    <FlowsTextField
                      className="m-2 p-2"
                      placeholder="Client ID"
                      label="Client ID"
                      type="text"
                      value={dataStreamInputs.client_id}
                      onChange={(e: any) => {
                        setDataStreamInputs({
                          ...dataStreamInputs,
                          client_id: e.target.value,
                        });
                      }}
                    />
                    <FlowsTextField
                      className="m-2 p-2"
                      placeholder="Client Secret"
                      label="Client Secret"
                      type="text"
                      value={dataStreamInputs.client_secret}
                      onChange={(e: any) => {
                        setDataStreamInputs({
                          ...dataStreamInputs,
                          client_secret: e.target.value,
                        });
                      }}
                    />
                    <FlowsTextField
                      className="m-2 p-2"
                      placeholder="Refresh token"
                      label="Refresh token"
                      type="text"
                      value={dataStreamInputs.refresh_token}
                      onChange={(e: any) => {
                        setDataStreamInputs({
                          ...dataStreamInputs,
                          refresh_token: e.target.value,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {/* <div className={page_section_horizontal_css + " items-center"}>
              <FlowsSelect
                label="Selected facility"
                placeholder="Please select"
                value={selectedFacilityId}
                onChange={(e: any) => {
                  setSelectedFacilityId(e.target.value);
                }}
              >
                {parentNodes
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  .filter(
                    (node) =>
                      node.type === "Facility" || node.type === "Network"
                  )
                  .map((node, index) => (
                    <MenuItem key={index} value={node.id}>
                      {node.id}
                    </MenuItem>
                  ))}
              </FlowsSelect>
            </div> */}
            {selectedTab == 0 && (
              <FlowsButtonDark
                className="h-10 font-normal capitalize m-5"
                onClick={handleUploadButtonClick}
                disabled={uploading} // Disable button during upload
              >
                {uploading ? "Uploading..." : "Upload File"}
              </FlowsButtonDark>
            )}
            {selectedTab == 1 && (
              <FlowsButtonDark
                className="h-10 font-normal capitalize m-5"
                onClick={handleConnectDataStreamButtonClick}
                disabled={
                  dataStreamInputs.email === "" ||
                  dataStreamInputs.name === "" ||
                  dataStreamInputs.client_id === "" ||
                  dataStreamInputs.client_secret === "" ||
                  dataStreamInputs.refresh_token === ""
                }
              >
                Connect to Data Stream
              </FlowsButtonDark>
            )}
            {/* {selectedTab == 1 && isDataStreamConnected && (
              <FlowsButtonLight
                className="h-10 font-normal capitalize bg-red-600 m-5"
                onClick={() => {
                  setIsDataStreamConnected(false);
                }}
              >
                Disconnect Data Stream
              </FlowsButtonLight>
            )} */}
            {uploadError && <div className="text-red-500">{uploadError}</div>}
            {uploadSuccess && (
              <div className="text-green-500">File uploaded successfully!</div>
            )}
          </div>

          <div className={page_simple_section_vertical_css}>
            <TableContainer className="shadow-none" component={Paper}>
              <Table>
                <TableHead className="bg-flows-light-gray">
                  <TableRow>
                    <TableCell colSpan={3} className={page_tablecell_css}>
                      File Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvList?.map(
                    (file: any | undefined) =>
                      file.name.split("_")[0] != "network" && (
                        <TableRow key={file.id}>
                          <TableCell className={page_tablecell_css + " w-9/12"}>
                            {file.name}
                          </TableCell>
                          <TableCell className={page_tablecell_css + " w-1/12"}>
                            <Button className="justify-end p-0 cursor-default">
                              <div
                                className="p-2 border cursor-pointer border-flows-light-gray hover:bg-flows-light-gray"
                                onClick={() => {
                                  setSelectedFileData(file.id);
                                  setDeleteFileModal(true);
                                }}
                              >
                                <img src="/trash-delete.svg" className="w-4" />
                              </div>
                            </Button>
                          </TableCell>
                          <TableCell className={page_tablecell_css + " w-3/24"}>
                            {file.id === previewFileId ? (
                              <FlowsButtonDark
                                className="w-full p-2 font-normal capitalize text-flows-table-button-text"
                                onClick={() => {
                                  setPreviewFileId(file.id);
                                  setPreviewPage(1);
                                }}
                              >
                                Viewing now
                              </FlowsButtonDark>
                            ) : (
                              <FlowsButtonLight
                                className="w-full p-2 font-normal capitalize text-flows-table-button-text"
                                onClick={() => {
                                  setPreviewFileId(file.id);
                                  setPreviewPage(1);
                                }}
                              >
                                View
                              </FlowsButtonLight>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className={page_simple_section_vertical_css}>
            <TableContainer className="shadow-none" component={Paper}>
              <Table>
                <TableHead className="bg-flows-light-gray">
                  <TableRow>
                    <TableCell colSpan={3} className={page_tablecell_css}>
                      Saved Data Streams
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {streamingData && streamingData?.map((file:any) => (
                    
                    <TableRow key={file.id}>
                      <TableCell className={page_tablecell_css + " w-9/12"}>
                        {file.metadata.data_stream_name}
                      </TableCell>
                      <TableCell className={page_tablecell_css + " w-1/12"}>
                        <Button className="justify-end p-0 cursor-default">
                          <div
                            className="p-2 border cursor-pointer border-flows-light-gray hover:bg-flows-light-gray"
                            onClick={() => {
                              // setSelectedFileData(file);
                              // setDeleteFileModal(true);
                              deleteDataStream(file.id)
                            }}
                          >
                            <img src="/trash-delete.svg" className="w-4" />
                          </div>
                        </Button>
                      </TableCell>
                      {/* <TableCell className={page_tablecell_css + " w-3/24"}>
                            {file === previewFileId ? (
                              <FlowsButtonDark
                                className="w-full p-2 font-normal capitalize text-flows-table-button-text"
                                onClick={() => {
                                  // setPreviewFileId(file);
                                  // setPreviewPage(1);
                                }}
                              >
                                Viewing now
                              </FlowsButtonDark>
                            ) : (
                              <FlowsButtonLight
                                className="w-full p-2 font-normal capitalize text-flows-table-button-text"
                                onClick={() => {
                                  // setPreviewFileId(file);
                                  // setPreviewPage(1);
                                }}
                              >
                                View
                              </FlowsButtonLight>
                            )}
                          </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className={page_main_section_wrapper_vertical_css + " w-2/3"}>
          <TagSection />
        </div>
      </div>

      {showPreviewTable && (
        <div className={page_main_section_wrapper_vertical_css}>
          <div className="flex flex-row justify-between">
            <SectionTitle title="DATA PREVIEW" divWidth="w-5/6" />
          </div>
          <div className={page_simple_section_vertical_css}>
            {previewDataLoading ? (
              <div className="z-10 justify-center w-1/2 m-auto bg-white opacity-70 h-96">
                <div className="w-[100px] m-auto">
                  <Image
                    src="/loading.gif"
                    alt="loading"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            ) : (
              <TableContainer
                component={Paper}
                className="shadow-none max-h-128 h-fit"
              >
                <Table className="overflow-x-auto table-auto">
                  <TableHead className="bg-flows-light-gray">
                    <TableRow>
                      {previewDataColumns?.map((title) => (
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
                    {previewData?.data.map((data_row, index) => (
                      <TableRow
                        className="even:bg-flows-white hover:bg-flows-white hover:text-white"
                        key={index}
                      >
                        {previewDataColumns?.map((cell: any) => (
                          <TableCell
                            className={
                              page_tablecell_css + " w-fit whitespace-nowrap"
                            }
                            key={cell}
                          >
                            {data_row[cell] ? data_row[cell] : "N/A"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <div className={page_section_horizontal_css + " justify-end"}>
              <div className="flex justify-end w-1/2 pb-5 pl-5 pr-5 mt-5">
                <FlowsButtonLight
                  className="p-2 font-normal capitalize text-flows-table-button-text"
                  onClick={handlePreviewBack}
                  disabled={previewPage <= 1}
                >
                  Back
                </FlowsButtonLight>
                <div className="justify-between p-2">
                  {previewPage} of {previewTotalPages}
                </div>
                <FlowsButtonDark
                  className="p-2 font-normal capitalize text-flows-table-button-text"
                  onClick={handlePreviewNext}
                  disabled={previewPage >= previewTotalPages}
                >
                  Next
                </FlowsButtonDark>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorData;
