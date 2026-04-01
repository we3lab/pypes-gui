import { Button, Tooltip } from "@mui/material";
import React from "react";
import { infoMap } from "./tool-tip-info";

interface ToolTipProps {
  tooltipName: string;
  children: React.ReactElement;
}

const ComponentToolTip: React.FC<ToolTipProps> = ({
  tooltipName,
  children,
}) => {
  return (
    <Tooltip
      title={<span style={{ fontSize: "14px" }}>{infoMap[tooltipName]}</span>}
      placement="top"
    >
      {children}
    </Tooltip>
  );
};

export default ComponentToolTip;
