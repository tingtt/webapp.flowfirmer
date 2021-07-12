import { createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() =>
  createStyles({
    button_left:{
      height: "60px",
      width: "40px",
      float: "left",
      fontSize: 35,
    },
    button_right:{
      height: "60px",
      width: "40px",
      float: "right",
      fontSize: 35,
    },
    gantt_warp: {
      float: "none",
      boxShadow: "0px 0px 4px #888",
      margin: "auto",
      width: "88.4%",
    },
    gantt_container: {
      fontSize: 12,
      overflow: "auto",
      width: "100%",
    },
    gantt: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    grid_background: {
      background: "#888",
    },
    grid_row: {
      fill: "#ffffff",
      "&:nth-child(even)": {
        fill: "#f5f5f5",
      },
    },
    row_line: {
      stroke: "#ebeff2",
    },
    today_highlight: {
      fill: "#f60",
      opacity: 0.5,
    },
    grid_header: {
      fill: "#ffffff",
      stroke: "#e0e0e0",
      strokeWidth: 1.4,
    },
    tick_thick: {
      strokeWidth: 0.4,
    },
    tick: {
      stroke: "#000",
      strokeWidth: 0.2,
    },
    lower_text: {
      fill: "#333",
      fontSize: 12,
      textAnchor: "middle",
    },
    bar: {
      fill: "#b8c2cc",
      stroke: "#8D99A6",
      strokeWidth: 0,
      msTransition: "strokeWidth .3e ease",
      userSelect: "none",
    },
    bar_wrapper: {
      cursor: "pointer",
      outline: "none",
    },
    bar_label: {
      fill: "#000",
      dominantBaseline: "central",
      textAnchor: "middle",
      fontSize: 12,
      fontWeight: "lighter",
    },
    handle_right: {
      fill: "#ddd",
      cursor: "ew-resize",
      opacity: 0,
      visibility: "hidden",
      transition: "opacity .3s ease",
    },
    handle_left: {
      fill: "#ddd",
      cursor: "ew-resize",
      opacity: 0,
      visibility: "hidden",
      transition: "opacity .3s ease",
    },
    todo: {
      position: "relative",
      left: 53,
    },
  })
);
