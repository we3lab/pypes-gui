import { Icon, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from "react";

interface InfoMapProps {
  [key: string]: string;
}

export const infoMap: InfoMapProps = {
  tooltip1: "This is a tooltip",
  tooltip2: "This is another tooltip",
  tooltip3: "This is a third tooltip",
  tooltip4: "This is a fourth tooltip",
  tooltip5: "This is a fifth tooltip",
  massBalances:
    "MASS_BALANCES are physical mass balances that can be used for cleaning and imputation. If a user has specified a network file that corresponds to their data, mass balances are generated automatically from the virtual tag/tag relationships, otherwise, the user can add them manually.",
  cleanParent: " If true, parent variables observations with missing child variables observations will be declared missing",
  cleanChildren: "If true, child variable observations with missing parent variable observations will be declared missing",
  imputeBalance: " If true, will use mass balance to impute missing values (when only one of parent + children is missing)",
  enforceBalance: " If true, will force parent to be sum of children",
  allocateBalance:  "If varible names are specified in this list, it will use mass balance to impute missing values but will allocate \"balance\" to all missing children (even if more than one child is missing)",
  nonnegativeBalance: "If true, will force parent and children to be nonnegative when imputing (NOTE: this may mean mass balance doesn't always hold)",
  cleaningModels: "CLEANING_MODELS are additional models that can be used to clean data"

};

interface ToolTipInfoProps {
  tooltipName: string;
}

const ToolTipInfo: React.FC<ToolTipInfoProps> = ({ tooltipName }) => {
  return (
    <Tooltip
      title={<span style={{ fontSize: "14px" }}>{infoMap[tooltipName]}</span>}
      placement="top"
    >
        <InfoOutlinedIcon fontSize="small" />
    </Tooltip>
  );
};

export default ToolTipInfo;
