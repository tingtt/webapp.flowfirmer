import { createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() =>
  createStyles({
    //  左ボタン
    button_left:{ 
      height: "60px",
      width: "40px",
      float: "left",
      fontSize: 35,
    },
    // 右ボタン
    button_right:{
      height: "60px",
      width: "40px",
      float: "right",
      fontSize: 35,
    },
    // ガントチャートの大枠
    gantt_warp: {
      float: "none",
      boxShadow: "0px 0px 4px #888",
      margin: "0px 60px",
    },
    // ガントチャート描画の枠
    gantt_container: {
      fontSize: 12,
      overflow: "auto",
      width: "100%",
    },
    // ガントチャート
    gantt:{
      width: "100%",
      height: "219px"
    },
    // ガントチャートの後ろの色
    grid_background: {
      background: "#888",
    },
    // ガントチャートの横一列
    grid_row: {
      fill: "#ffffff",
      "&:nth-child(even)": {
        fill: "#f5f5f5",
      },
    },
    // 横線の色
    row_line: {
      stroke: "#ebeff2",
    },
    // 今日の日付
    today_highlight: {
      fill: "#f60",
      opacity: 0.5,
    },
    // 
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
      left: "calc((100% - 408px) / 7)",
      width: 1,
      height: 200,
      strokeWidth: 0.2,
    },
    lower_text: {
      fill: "#333",
      fontSize: 16,
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
