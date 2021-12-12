import React from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";

export default function MyTooltip({ styleParams, title, placement, content }) {
  const TooltipStyle = styledMui(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: `rgb(255, 255, 255, ${styleParams.opacity})`,
      color: "#3a4a58",
      fontSize: styleParams.fontSize,
      fontWeight: "bold",
    },
  }));

  return (
    <TooltipStyle title={title} placement={placement}>
      {content}
    </TooltipStyle>
  );
}
