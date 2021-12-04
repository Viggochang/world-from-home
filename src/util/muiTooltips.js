import React from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";

export default function MyTooltip({ style, title, placement, content }) {
  const TooltipStyle = styledMui(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: `rgb(255, 255, 255, ${style.opacity})`,
      color: "#3a4a58",
      fontSize: style.fontSize,
      fontWeight: "bold",
    },
  }));

  return (
    <TooltipStyle title={title} placement={placement}>
      {content}
    </TooltipStyle>
  );
}
