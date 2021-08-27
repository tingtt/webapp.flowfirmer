import React from "react";
import { useStyles } from "./Gantt.module";
import { Gantt } from "../../../lib/interface/gantt";
// import { Term } from '../../../lib/interface';
import AppDataManager from "../../../lib/app/appDataManager";

export default function GanttChart() {
  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance(0);
    } catch (e) {
      return AppDataManager.getInstance();
    }
  })();

  let today = new Date(); //今日の日付
  let year = today.getFullYear(); //今年
  let month = today.getMonth(); //今月

  let startday: number; //termの始める日
  let endday: number; //termの終わる日
  let termDay: number; //termの期間
  let startmonth: number; //termの開始月
  let endmonth: number; //termの終了月

  const [endall, setendall] = React.useState(0); //表示する付きの総数

  const [Datelen, setDatelen] = React.useState({
    index: [0],
  }); //月の日付の数

  const [LastWeek, setLastWeek] = React.useState({
    start: new Date(),
    end: new Date(),
  });

  let countmonth = -1;
  const [SelectNum, setSelectNum] = React.useState(1); //svg描画距離の一時保存
  const [SelectView, setSelectview] = React.useState([0]);
  const [Days, setDays] = React.useState(0);
  const strmonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const viewcalendar = (
    timeUnit: string,
    setNumber: number,
    ChangeNum: number
  ) => {
    let arrayday: number[] = []; //月の日付数の仮置き
    let total: number = 0; //総日付数の仮置き
    let view: number[] = []; //表示の数
    let container = document.getElementById("container"); //svgを表示させる大枠

    if (timeUnit == "month") {
      [...Array(ChangeNum + 2)].map(
        (_: undefined, idx: number) => (
          arrayday.push(new Date(year, setNumber + idx, 0).getDate()),
          (total += new Date(year, setNumber + idx, 0).getDate()), //表示する付きの総数
          view.push(new Date(year, setNumber + idx, 0).getMonth())
        )
      );
      setDatelen({ index: arrayday });
      if (ChangeNum == 1) {
        setendall(
          container!!.clientWidth * 3 //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth;
      } else {
        setendall(
          (container!!.clientWidth / ChangeNum) * (ChangeNum + 2) //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth / ChangeNum;
      }
      setSelectNum(ChangeNum);
      setSelectview(view);
      setDays(total);
    } else if (timeUnit == "week") {
      let weekNumber = Math.floor((today.getDate() - today.getDay() + 12) / 7); //今週が何番目
      let startDay = new Date(year, month, (weekNumber - 2) * 7 + 1); //今週の始め
      let day = startDay.getDay();
      startDay.setDate(startDay.getDate() + (day ? 0 - day : 0));
      let endDay = new Date(startDay); //今週の終わり
      endDay.setDate(endDay.getDate() + 7 * (ChangeNum + 1) + 6);
      setDatelen({ index: [7 * (ChangeNum + 2)] }); //日にちの長さ
      setSelectNum(ChangeNum); //何週間表示するか
      setLastWeek({ start: startDay, end: endDay }); //先週初め先
      if (ChangeNum == 1) {
        setendall(
          (container!!.clientWidth / (7 * ChangeNum)) * (ChangeNum + 2) * 7 //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft =
          (container!!.clientWidth / (7 * ChangeNum)) * 7;
      } else {
        setendall(
          (container!!.clientWidth / ChangeNum) * (ChangeNum + 2) //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth / ChangeNum;
      }
      console.log(container!!.clientWidth / ChangeNum);
    }else if(timeUnit == "year"){
      
    }
  };

  //ガントチャート描画距離の指定
  const [calendarState, setCalendar] = React.useState<Gantt>({
    name: "month",
    numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  });

  React.useEffect(() => {
    viewcalendar(calendarState.name, month, SelectNum);
  }, []);

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let select = e.target.value;

    if (select == "weekly") {
      setCalendar({ name: "week", numSelecter: [1, 2, 3, 4, 5, 6] });
    } else if (select == "Monthly") {
      setCalendar({
        name: "month",
        numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
    } else if (select == "Yearly") {
      setCalendar({
        name: "year",
        numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    }
  };

  React.useEffect(() => {
    //calendarstateが変更したときに動かす
    //再描画処理を行う
    setdrawig(calendarState.name);
    let target = document.getElementById(
      calendarState.name
    ) as HTMLSelectElement;
    viewcalendar(calendarState.name, month, parseInt(target.value));
  }, [calendarState]);

  //数字が動いたときに再描画させたい
  const chengeCalendar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    viewcalendar(calendarState.name, month, parseInt(e.target.value));
  };

  const classes = useStyles();

  //termの数
  const termlength = appDataManager.terms?.filter(
    (value) =>
      (value.startDatetimeScheduled.getTime() -
        value.endDatetimeScheduled.getTime()) /
        86400000 !=
      0
  ).length;

  function setdrawig(state: string) {
    //月の表示
    if (state == "month") {
      let i: number = 0;
      return (
        <svg id="gantt" height={termlength!! * 40 + 60} width={endall}>
          <g id="chart">
            {/* {console.log(endall)} */}
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(
              appDataManager.terms?.map((value) => (
                <rect
                  x="0"
                  y={value.id * 40 + 59}
                  width={endall}
                  height="40"
                  className={classes.grid_row}
                />
              ))
            )}
          </g>
          <g id="today">
            {/*今日の日付をオレンジ色にする  */}
            {React.Children.toArray(
              SelectView.map((value) => {
                if (value == today.getMonth()) {
                  return (
                    <rect
                      x={
                        (Datelen.index[0] + today.getDate() - 1) *
                        (endall / Days)
                      }
                      y="0"
                      width={endall / Days}
                      height={(termlength!! + 1) * 40 + 19}
                      className={classes.today_highlight}
                    />
                  );
                }
              })
            )}
          </g>

          {/* 日付を表示する土台 */}
          <rect
            x="0"
            y="0"
            width={endall}
            height="60"
            className={classes.grid_header}
          />

          {/* ガントチャートの枠組み */}
          <path d="M 0 59 v 190" className={classes.tick_thick} />

          {/* 日付の表示 */}
          <g className="drawing">
            {SelectNum == 1
              ? React.Children.toArray(
                  [...Array(Days)].map((_: undefined, idx: number) => (
                    <path
                      d={
                        "M " +
                        (endall / Days) * idx +
                        " 59 v" +
                        termlength!! * 40
                      }
                      className={classes.tick}
                    />
                  ))
                )
              : [...Array(SelectNum + 1)].map((_: undefined, idx: number) => (
                  <path
                    d={
                      "M " +
                      (endall / (SelectNum + 2)) * (idx + 1) +
                      " 59 v" +
                      termlength!! * 40
                    }
                    className={classes.tick}
                  />
                ))}
          </g>
          {SelectNum == 1
            ? React.Children.toArray(
                Datelen.index.map((value) => (
                  <g className={"date" + SelectView[++countmonth]}>
                    {React.Children.toArray(
                      [...Array(value)].map((_: undefined, idx: number) =>
                        (() => {
                          if (idx == 0) {
                            return [
                              // 日付を書く場所
                              <text
                                key={idx}
                                x={
                                  ((endall / Days) * 1) / 2 +
                                  (endall / Days) * i
                                }
                                y="50"
                                className={classes.monthly_text}
                              >
                                {++idx}
                              </text>,
                              //月の名前を表示
                              <text
                                key={SelectView[countmonth]}
                                x={(endall / Days) * (15 + i)}
                                y="25"
                              >
                                {strmonth[SelectView[countmonth]]}
                              </text>,
                            ];
                          } else {
                            // 日付を書く場所
                            return (
                              <text
                                key={idx}
                                x={
                                  ((endall / Days) * 1) / 2 +
                                  (endall / Days) * (idx + i)
                                }
                                y="50"
                                className={classes.monthly_text}
                              >
                                {++idx}
                              </text>
                            );
                          }
                        })()
                      )
                    )}
                    {(i += value)}
                  </g>
                ))
              )
            : [...Array(SelectNum + 2)].map((_: undefined, idx: number) => {
                return idx == 0 ? (
                  //月の名前を表示
                  <text
                    key={idx}
                    x={endall / (SelectNum + 2) / 2 - 15}
                    y="25"
                  >
                    {strmonth[SelectView[idx]]}
                  </text>
                ) : (
                  //月の名前を表示
                  <text
                    key={idx}
                    x={
                      (endall / (SelectNum + 2)) * idx +
                      endall / (SelectNum + 2) / 2 -
                      15
                    }
                    y="25"
                  >
                    {strmonth[SelectView[idx]]}
                  </text>
                );
              })}
          {/* termの内容を表示 */}
          <g>
            {React.Children.toArray(
              appDataManager.terms?.map(
                (value) => (
                  (startday = value.startDatetimeScheduled.getDate()),
                  (endday = value.endDatetimeScheduled.getDate()),
                  (termDay = (endday - startday) / 86400000),
                  (startmonth = value.startDatetimeScheduled.getMonth()), //termの開始月
                  (endmonth = value.endDatetimeScheduled.getMonth()), //termの終了月
                  (
                    <g className={classes.bar_wrapper}>
                      <g className="bar_group">
                        {/* termの全体表示 */}
                        <rect
                          x={(startday - 1) * 40}
                          y={28 + (value.id + 1) * 40}
                          width={(endday - startday + 1) * 40}
                          height="25"
                          rx="3"
                          ry="3"
                          className={classes.bar}
                        />
                        {/* termの名前表示 */}
                        <text
                          x={(startday - 1) * 40 + (endday - startday + 1) * 20}
                          y={41 + (value.id + 1) * 40}
                          className={classes.bar_label}
                        >
                          {value.name}
                        </text>
                      </g>
                    </g>
                  )
                )
              )
            )}
          </g>
        </svg>
      );
    } else if (state == "week") {
      let i: number = 7 * (SelectNum + 2);
      let changeDate = LastWeek.start;
      //週の表示
      return (
        <svg id="gantt" height={termlength!! * 40 + 60} width={endall}>
          <g id="chart">
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(
              appDataManager.terms?.map((value) => (
                <rect
                  x="0"
                  y={value.id * 40 + 59}
                  width={endall}
                  height="40"
                  className={classes.grid_row}
                />
              ))
            )}
          </g>
          <g id="today">
            {/*今日の日付をオレンジ色にする  */}
            <rect
              x={((7 + today.getDay()) * endall) / i}
              y="0"
              width={endall / i}
              height={(termlength!! + 1) * 40 + 19}
              className={classes.today_highlight}
            />
          </g>

          {/* 日付を表示する土台 */}
          <rect
            x="0"
            y="0"
            width={endall}
            height="60"
            className={classes.grid_header}
          />

          {/* ガントチャートの枠組み */}
          <path d="M 0 59 v 190" className={classes.tick_thick} />

          {/* 日付の区切りを線で表示 */}
          <g className="drawing">
            {SelectNum == 1
              ? React.Children.toArray(
                  [...Array(i)].map((_: undefined, idx: number) => (
                    <path
                      d={
                        "M " + (endall / i) * idx + " 59 v" + termlength!! * 40
                      }
                      className={classes.tick}
                    />
                  ))
                )
              : [...Array(SelectNum + 1)].map((_: undefined, idx: number) => (
                  <path
                    d={
                      "M " +
                      (endall / (SelectNum + 2)) * (idx + 1) +
                      " 59 v" +
                      termlength!! * 40
                    }
                    className={classes.tick}
                  />
                ))}

            {React.Children.toArray(
              Datelen.index.map((value) => (
                <g className={"date" + SelectView[++countmonth]}>
                  {React.Children.toArray(
                    [...Array(value)].map((_: undefined, idx: number) =>
                      (() => {
                        if (idx == 0) {
                          return [
                            // 日付を書く場所
                            <text
                              key={idx}
                              x={
                                ((endall / (7 * (SelectNum + 2))) * (idx + 1)) /
                                2
                              }
                              y="50"
                              className={classes.weekly_text}
                            >
                              {changeDate.getMonth() +
                                1 +
                                "/" +
                                changeDate.getDate()}
                            </text>,
                            changeDate.setDate(changeDate.getDate() + 1),
                          ];
                        } else if (changeDate.getDate() == 1) {
                          // 表示中に月が変わった場合
                          return [
                            <text
                              key={idx}
                              x={
                                ((endall / (7 * (SelectNum + 2))) * 1) / 2 +
                                (endall / (7 * (SelectNum + 2))) * idx
                              }
                              y="50"
                              className={classes.weekly_text}
                            >
                              {changeDate.getMonth() +
                                1 +
                                "/" +
                                changeDate.getDate()}
                            </text>,
                            changeDate.setDate(changeDate.getDate() + 1),
                          ];
                        } else {
                          // 日付を書く場所
                          return [
                            <text
                              key={idx}
                              x={
                                ((endall / (7 * (SelectNum + 2))) * 1) / 2 +
                                (endall / (7 * (SelectNum + 2))) * idx
                              }
                              y="50"
                              className={classes.weekly_text}
                            >
                              {changeDate.getDate()}
                            </text>,
                            changeDate.setDate(changeDate.getDate() + 1),
                          ];
                        }
                      })()
                    )
                  )}
                </g>
              ))
            )}
          </g>

          {/* termの内容を表示 */}
          <g>
            {React.Children.toArray(
              appDataManager.terms?.map(
                (value) => (
                  (startday = value.startDatetimeScheduled.getDate()),
                  (endday = value.endDatetimeScheduled.getDate()),
                  (termDay = (endday - startday) / 86400000),
                  (startmonth = value.startDatetimeScheduled.getMonth()), //termの開始月
                  (endmonth = value.endDatetimeScheduled.getMonth()), //termの終了月
                  (
                    <g className={classes.bar_wrapper}>
                      <g className="bar_group">
                        {/* termの全体表示 */}
                        <rect
                          x={((startday - 1) * endall) / i}
                          y={28 + (value.id + 1) * 40}
                          width={
                            (endday - startday + 1) *
                            (endall / (7 * (SelectNum + 2)))
                          }
                          height="25"
                          rx="3"
                          ry="3"
                          className={classes.bar}
                        />
                        {/* termの名前表示 */}
                        <text
                          x={
                            ((startday - 1) * endall) / i +
                            ((endday - startday + 1) * endall) / i / 2
                          }
                          y={41 + (value.id + 1) * 40}
                          className={classes.bar_label}
                        >
                          {value.name}
                        </text>
                      </g>
                    </g>
                  )
                )
              )
            )}
          </g>
        </svg>
      );
    } else if (state == "year") {
    }
  }

  return (
    <main>
      <select id={calendarState.name} name="number" onChange={chengeCalendar}>
        {React.Children.toArray(
          calendarState.numSelecter.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))
        )}
      </select>
      <select id="calendar" defaultValue={"Monthly"} onChange={selectChange}>
        <option value="weekly">週</option>
        <option value="Monthly">月</option>
        <option value="Yearly">年</option>
      </select>

      <div className={classes.gantt_warp}>
        <div id="container" className={classes.gantt_container}>
          {setdrawig(calendarState.name)}
        </div>
      </div>
    </main>
  );
}
