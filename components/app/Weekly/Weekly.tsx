import React from "react";
import AppDataManager from "../../../lib/app/appDataManager";
import ToDoBox from "./Todobox";
import { useStyles } from "./Weekly.module";

export default function Weekly() {
  let today = new Date(); //今日の日付
  let year = today.getFullYear(); //今年
  let month = today.getMonth() + 1; //今月

  //termの取得するための関数
  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance();
    } catch (e) {
      return AppDataManager.getInstance();
    }
  })();

  let startday: any; //termの開始日
  let endday: any; //termの終了日
  let termDay: number; //termの期間
  let startmonth: number; //termの開始月
  let endmonth: number; //termの終了月

  const [startnumber, setstartnumber] = React.useState(0);

  //指定した週目の始まりと最後を出す
  const getWeekOfMonth = (year: number, month: number, weekNumber: number) => {
    let start = new Date(year, month - 1, (weekNumber - 1) * 7 + 1);
    let day = start.getDay();
    start.setDate(start.getDate() + startnumber - day);
    let end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start: start, end: end };
  };

  //今日が第何週かを出す
  const [week, setweek] = React.useState(
    Math.floor((today.getDate() - today.getDay() + 12) / 7)
  );

  const getweek = getWeekOfMonth(year, month, week);
  const weekstart: any = getweek.start;
  const weekend = getweek.end;
  let changeDate = new Date(weekstart);
  changeDate.setDate(weekstart.getDate());
  let i: number = 0;

  const classes = useStyles(); //css呼び出し

  const weekchenge = (e: React.MouseEvent<HTMLButtonElement>) => {
    let num = Number(e.currentTarget.getAttribute("value"));
    setweek((current) => current + num); //今週から１週前か後に移動
    changeDate = getweek.start;
  };

  //日曜はじめ又は、月曜はじめを決める
  const selectweek = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setstartnumber(Number(e.target.value));
    console.log(startnumber);
  };

  //termのドラッグ＆ドロップ処理
  // const drag = (e: React.MouseEvent<SVGRectElement>) => {
  //   let bar = (document.getElementById(e.currentTarget.id) as any)
  //   let bbox = bar.getBBox();

  //   let shiftX = e.clientX - bbox.x;
  //   e.clientX = 100

  //   console.log("x:" + shiftX,"clientX:"+e.clientX,"Bbox x:"+bbox.x);

  // };

  //termの数
  let termlength = appDataManager.terms?.filter(
    (value) =>
      (value.startDatetimeScheduled.getTime() -
        value.endDatetimeScheduled.getTime()) /
        86400000 !=
      0
  ).length;

  if (termlength != undefined) {
    if (termlength < 4) {
      termlength += 4 - termlength;
    }
  }

  return (
    <div>
      {/* 何曜日始めかを選ぶ */}
      <select
        className={classes.selectweek}
        defaultValue={"0"}
        onChange={selectweek}
      >
        <option value="0">日曜はじめ</option>
        <option value="1">月曜はじめ</option>
      </select>
      {/* 移動ボタン */}
      <button className={classes.button_left} onClick={weekchenge} value="-1">
        {"<"}
      </button>
      <button className={classes.button_right} onClick={weekchenge} value="1">
        {">"}
      </button>
      {/* １週間のガントチャートの記述 */}
      <div className={classes.gantt_warp}>
        <div id="container" className={classes.gantt_container}>
          <svg className={classes.gantt} height={termlength!! * 40 + 60}>
            <g>
              {/* ガントチャートの表を作成 */}
              {React.Children.toArray(
                appDataManager.terms?.map((value) => {
                  startday = value.startDatetimeScheduled; //termの開始日
                  endday = value.endDatetimeScheduled; //termの終了日
                  termDay = (endday - startday) / 86400000;
                  startmonth = value.startDatetimeScheduled.getMonth(); //termの開始月
                  endmonth = value.endDatetimeScheduled.getMonth(); //termの終了月
                  () => {
                    if (
                      (startmonth == weekstart.getMonth() ||
                        endmonth == weekend.getMonth()) &&
                      termDay != 0
                    ) {
                      return (
                        <rect
                          x="0"
                          y={i++ * 40 + 60}
                          width="100%"
                          height="40"
                          className={classes.grid_row}
                        />
                      );
                    }
                  };
                })
              )}
            </g>

            {/* 日付を表示する土台 */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="60"
              className={classes.grid_header}
            />

            {/*今日の日付をオレンジ色にする  */}
            <g id="today">
              {changeDate.getMonth() == today.getMonth() && (
                <rect
                  x={(today.getDate() - changeDate.getDate()) * 14.3 + "%"}
                  y="60"
                  width="14.3%"
                  height={termlength!! * 40}
                  className={classes.today_highlight}
                />
              )}
            </g>

            {/* ガントチャートの枠組み */}
            <path d="M 0 60 v 190" className={classes.tick_thick} />

            {/* ガントチャートの縦線を作る */}
            {React.Children.toArray(
              [...Array(6)].map((_: undefined, idx: number) => (
                <line
                  x1={(idx + 1) * 14.3 + "%"}
                  y1="60"
                  x2={(idx + 1) * 14.3 + "%"}
                  y2="300"
                  className={classes.tick}
                />
              ))
            )}

            {/* 日付の表示 */}
            {React.Children.toArray(
              [...Array(7)].map((_: undefined, idx: number) =>
                (() => {
                  if (idx == 0) {
                    //今月の表示
                    return (
                      <text
                        key={idx}
                        x={((idx + 1) * 14.3) / 2 + "%"}
                        y="50"
                        className={classes.lower_text}
                      >
                        {changeDate.getMonth() + 1 + "/" + changeDate.getDate()}
                      </text>
                    );
                  } else if (changeDate.getDate() == 1) {
                    // １週間の表示中に月が変わった場合
                    changeDate.setDate(changeDate.getDate() + 1);
                    return (
                      <text
                        key={idx}
                        x={idx * 14.3 + 7.15 + "%"}
                        y="50"
                        className={classes.lower_text}
                      >
                        {changeDate.getMonth() + 1 + "/" + changeDate.getDate()}
                      </text>
                    );
                  } else {
                    //それ以外
                    changeDate.setDate(changeDate.getDate() + 1);
                    return (
                      <text
                        key={idx}
                        x={idx * 14.3 + 7.15 + "%"}
                        y="50"
                        className={classes.lower_text}
                      >
                        {changeDate.getDate()}
                      </text>
                    );
                  }
                })()
              )
            )}

            {/* termの内容を表示 */}
            <g>
              {React.Children.toArray(
                appDataManager.terms?.map((value) => {
                  startday = value.startDatetimeScheduled; //termの開始日
                  endday = value.endDatetimeScheduled; //termの終了日
                  termDay = (endday - startday) / 86400000;
                  startmonth = value.startDatetimeScheduled.getMonth(); //termの開始月
                  endmonth = value.endDatetimeScheduled.getMonth(); //termの終了月
                  () => {
                    if (
                      (startmonth == weekstart.getMonth() ||
                        endmonth == weekend.getMonth()) &&
                      termDay != 0
                    ) {
                      return (
                        <g className={classes.bar_wrapper}>
                          <g className="bar_group">
                            {/* termの全体表示 */}
                            <rect
                              x={
                                ((startday - weekstart) / 86400000) * 14.3 + "%"
                              }
                              y={28 + +value.id * 40}
                              width={termDay * 14.285 + "%"}
                              height="25"
                              rx="3"
                              ry="3"
                              id={value.id}
                              className={classes.bar}
                              // onMouseDown={drag}
                            />
                            {/* termの名前表示 */}
                            <text
                              x={
                                ((startday - weekstart) / 86400000) * 14.3 +
                                (termDay * 14.3) / 2 +
                                "%"
                              }
                              y={41 + +value.id * 40}
                              className={classes.bar_label}
                            >
                              {value.name}
                            </text>
                          </g>

                          {/* termの範囲移動させる */}
                          <g className="handle-group">
                            <rect
                              x={
                                ((startday - weekstart) / 86400000) * 14.3 + "%"
                              }
                              y={28 + +value.id * 40}
                              width="10"
                              height="25"
                              rx="3"
                              ry="3"
                              id={value.id}
                              className={classes.handle_left}
                            />
                            <rect
                              x={((endday - weekstart) / 86400000) * 14.2 + "%"}
                              y={28 + +value.id * 40}
                              width="10"
                              height="25"
                              rx="3"
                              ry="3"
                              id={value.id}
                              className={classes.handle_right}
                            />
                          </g>
                        </g>
                      );
                    }
                  };
                })
              )}
            </g>
          </svg>
        </div>
      </div>
      <div className={classes.todo}>
        {/* １週間分のtodoを回す */}
        {React.Children.toArray(
          [...Array(7)].map((_: undefined, idx: number) => (
            <div className={classes.todobox}>
              {appDataManager.todos &&
                appDataManager.todos
                  .filter(
                    (value) =>
                      value.startDatetimeScheduled &&
                      value.startDatetimeScheduled >=
                        new Date(
                          weekstart.getFullYear(),
                          weekstart.getMonth(),
                          weekstart.getDate() + idx
                        ) && value.startDatetimeScheduled <
                        new Date(
                          weekstart.getFullYear(),
                          weekstart.getMonth(),
                          weekstart.getDate() + idx +1
                        )
                  )
                  .map((value) => <ToDoBox todo={value} key={value.id} />)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
