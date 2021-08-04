import { createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() =>
  createStyles({
    selectweek: {
      margin: "0px 20px",
    },
    //  左ボタン
    button_left: {
      marginTop: "25px",
      height: "60px",
      width: "40px",
      float: "left",
      fontSize: 35,
    },
    // 右ボタン
    button_right: {
      marginTop: "25px",
      height: "60px",
      width: "40px",
      float: "right",
      fontSize: 35,
    },
    // ガントチャートの大枠
    gantt_warp: {
      float: "none",
      boxShadow: "0px 0px 4px #888",
      margin: "5px 60px",
    },
    // ガントチャート描画の枠
    gantt_container: {
      fontSize: 12,
      overflowY: "auto",
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
    // 横線の色
    row_line: {
      stroke: "#ebeff2",
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
      fill: "#FFF",
      stroke: "#000",
      strokeWidth: 0.3,
      userSelect: "none",
    },
    bar_wrapper: {
      cursor: "pointer",
      outline: "none",
      "&:hover": {
        "& $handle_right": {
          visibility: "visible",
          opacity: 1,
        },
        "& $handle_left": {
          visibility: "visible",
          opacity: 1,
        },
      },
    },
    bar_label: {
      fill: "#000",
      dominantBaseline: "central",
      textAnchor: "middle",
      fontSize: 12,
      fontWeight: "lighter",
    },
    handle_right: {
      fill: "#000",
      cursor: "ew-resize",
      opacity: 0,
      visibility: "hidden",
    },
    handle_left: {
      fill: "#000",
      cursor: "ew-resize",
      opacity: 0,
      visibility: "hidden",
    },
    todo: {
      position: "relative",
      margin: "0px 55px",
      display: "flex",
    },
    todobox: {
      width: "calc(100% / 7)",
      flexGrow: 1,
    },
  })
);
