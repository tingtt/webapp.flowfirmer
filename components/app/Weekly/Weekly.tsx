import React from "react";
import AppDataManager from "../../../lib/app/appDataManager";
import ToDoBox from "./Todobox";
import { useStyles } from "./Weekly.module";

export default function Weekly() {
  let today = new Date(); //今日の日付
  let year = today.getFullYear(); //今年
  let month = today.getMonth() + 1; //今月

  //Termの取得するための関数
  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance();
    } catch (e) {
      return AppDataManager.getInstance();
    }
  })();

  let startday: any; //Termの開始日
  let endday: any; //Termの終了日
  let TermDay: number; //Termの期間
  let Termlength: number; //Termの数

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

  const getweek = getWeekOfMonth(year, month, week); //１週間の取得
  let changeDate = new Date(getweek.start); //数字を出すための処理
  const classes = useStyles(); //css呼び出し

  //ボタンを押した時の処理
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

  //Termのドラッグ＆ドロップ処理
  // const drag = (e: React.MouseEvent<SVGRectElement>) => {
  //   let bar = (document.getElementById(e.currentTarget.id) as any)
  //   let bbox = bar.getBBox();

  //   let shiftX = e.clientX - bbox.x;
  //   e.clientX = 100

  //   console.log("x:" + shiftX,"clientX:"+e.clientX,"Bbox x:"+bbox.x);

  // };

  let Termfilter = appDataManager.terms?.filter(
    (value) =>
      value.startDatetimeScheduled <= getweek.end &&
      value.endDatetimeScheduled >= getweek.start
  );

  //Termの数
  if (Termfilter != undefined) {
    Termlength = Termfilter.length;

    //Termlengthが0の時に4で固定する

    if (Termlength < 4) {
      Termlength += 4 - Termlength;
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
      <text className={classes.year_text}>
        {changeDate.getFullYear()}
      </text>
      {/* １週間のガントチャートの記述 */}
      <div className={classes.gantt_warp}>
        <div id="container" className={classes.gantt_container}>
          <svg className={classes.gantt} height={Termlength!! * 40 + 60}>
            <g id="Grid_row">
              {/* ガントチャートの表を作成 */}
              {React.Children.toArray(
                Termfilter &&
                  Termfilter.map((_, index) => {
                    return (
                      <rect
                        x="0"
                        y={index * 40 + 60}
                        width="100%"
                        height="40"
                        className={classes.grid_row}
                      />
                    );
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

            {/* ガントチャートの枠組み */}
            <path d="M 0 60 v 190" className={classes.tick_thick} />

            {/*今日の日付をオレンジ色にする  */}
            <g id="today">
              {changeDate.getMonth() == today.getMonth() &&
                changeDate.getFullYear() == today.getFullYear() && (
                  <rect
                    x={(today.getDate() - changeDate.getDate()) * 14.3 + "%"}
                    y="60"
                    width="14.3%"
                    height={Termlength!! * 40}
                    className={classes.today_highlight}
                  />
                )}
            </g>

            {/* ガントチャートの縦線を作る */}
            <g id="Grid_line">
              {React.Children.toArray(
                [...Array(6)].map((_: undefined, idx: number) => (
                  <line
                    x1={(idx + 1) * 14.3 + "%"}
                    y1="60"
                    x2={(idx + 1) * 14.3 + "%"}
                    y2={Termlength!! * 40 + 60}
                    className={classes.tick}
                  />
                ))
              )}
            </g>

            {/* 日付の表示 */}
            <g id="Date">
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
                          {changeDate.getMonth() +
                            1 +
                            "/" +
                            changeDate.getDate()}
                        </text>
                      );
                    } else if (
                      changeDate.getDate() ==
                      new Date(
                        changeDate.getFullYear(),
                        changeDate.getMonth() + 1,
                        0
                      ).getDate()
                    ) {
                      // １週間の表示中に月が変わった場合
                      changeDate.setDate(changeDate.getDate() + 1);
                      return (
                        <text
                          key={idx}
                          x={idx * 14.3 + 7.15 + "%"}
                          y="50"
                          className={classes.lower_text}
                        >
                          {changeDate.getMonth() +
                            1 +
                            "/" +
                            changeDate.getDate()}
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
            </g>

            {/* Termの内容を表示 */}
            <g id="Term">
              {React.Children.toArray(
                //サンプルに変更中
                Termfilter &&
                  Termfilter.map((value, index) => {
                    startday = value.startDatetimeScheduled; //Termの開始日
                    endday = value.endDatetimeScheduled; //Termの終了日
                    TermDay = (endday - startday) / 86400000 + 1;

                    return (
                      <g className={classes.bar_wrapper}>
                        <g className="bar_group">
                          {/* Termの全体表示 */}
                          <rect
                            key={value.id}
                            x={
                              ((startday.getTime() - getweek.start.getTime()) /
                                86400000) *
                                14.3 +
                              "%"
                            }
                            y={28 + (index + 1) * 40}
                            width={TermDay * 14.285 + "%"}
                            height="25"
                            rx="3"
                            ry="3"
                            id={value.id}
                            className={classes.bar}
                            // onMouseDown={drag}
                          />
                          {/* Termの名前表示 */}
                          {startday >= getweek.start ? (
                            <text
                              key={value.name}
                              x={
                                ((startday.getTime() -
                                  getweek.start.getTime()) /
                                  86400000) *
                                  14.3 +
                                "%"
                              }
                              y={41 + (index + 1) * 40}
                              className={classes.bar_label}
                            >
                              {value.name}
                            </text>
                          ) : (
                            <text
                              key={value.name}
                              x={0}
                              y={41 + (index + 1) * 40}
                              className={classes.bar_label}
                            >
                              {value.name}
                            </text>
                          )}
                        </g>

                        {/* Termの範囲移動させる */}
                        {/* <g className="handle-group">
                            <rect
                              x={
                                ((startday - getweek.start) / 86400000) * 14.3 + "%"
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
                              x={((endday - getweek.start) / 86400000) * 14.2 + "%"}
                              y={28 + +value.id * 40}
                              width="10"
                              height="25"
                              rx="3"
                              ry="3"
                              id={value.id}
                              className={classes.handle_right}
                            />
                          </g> */}
                      </g>
                    );
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
                          getweek.start.getFullYear(),
                          getweek.start.getMonth(),
                          getweek.start.getDate() + idx
                        ) &&
                      value.startDatetimeScheduled <
                        new Date(
                          getweek.start.getFullYear(),
                          getweek.start.getMonth(),
                          getweek.start.getDate() + idx + 1
                        ) &&
                      value.startDatetimeScheduled >
                        new Date(
                          getweek.start.getFullYear(),
                          getweek.start.getMonth(),
                          getweek.start.getDate() + idx - 1
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