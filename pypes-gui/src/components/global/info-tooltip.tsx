import { Modal, Box, Button } from "@mui/material";
import SectionTitle from "./section-title";
import DiagramTitle from "./diagram-title";

interface infoTooltipParams {
  tooltipText: string;
  open: boolean;
  onCloseAction: () => void;
}

const InfoTooltip: React.FC<infoTooltipParams> = ({
  tooltipText,
  open,
  onCloseAction,
}) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30vw",
    height: "20vh",
    bgcolor: "background.paper",
    border: "1px solid gray",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Modal
      open={open}
      onClose={onCloseAction}
      className="flex items-center justify-center"
    >
      <Box sx={{ ...style }} className="flex justify-center text-sm">
        <div className="flex flex-col w-full justify-between">
          <DiagramTitle title="INFO"/>
          <div className="text-lg m-auto w-full">{tooltipText}</div>
          <div className="m-auto w-full flex flex-row justify-end">
            <Button
              className="mr-5 font-thin m-auto"
              variant="contained"
              onClick={onCloseAction}
            >
              Close
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default InfoTooltip;
