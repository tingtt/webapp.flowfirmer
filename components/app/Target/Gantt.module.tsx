import { createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() =>
  createStyles({
    gantt_warp: {
      boxShadow: "0px 0px 4px #888",
    },
    // ガントチャート描画の枠
    gantt_container: {
      fontSize: 12,
      overflow: "auto",
      width: "100%",
      height: 219,
    },
    // ガントチャート
    gantt: {
      width: "100%",
    },
    // ガントチャートの横一列
    grid_row: {
      position: "relative",
      fill: "#f9f9f9",
      // stroke: "#cccccc"
    },
    // 今日の日付
    today_highlight: {
      fill: "#f60",
      opacity: 0.5,
    },
    //日付表示
    grid_header: {
      fill: "#ffffff",
      stroke: "#e0e0e0",
      strokeWidth: 1.4,
    },
    tick_thick: {
      strokeWidth: 0.4,
    },
    // 縦線の色
    tick: {
      stroke: "#000",
      position: "relative",
      strokeWidth: 0.2,
    },
    lower_text: {
      fill: "#333",
      fontSize: 12,
      textAnchor: "middle",
    },
    bar: {
      fill: "#FFF",
      stroke: "#000",
      strokeWidth: 0.3,
      userSelect: "none",
      zIndex: 1,
      position: "absolute",
      resize: "horizontal",
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
  })
);


