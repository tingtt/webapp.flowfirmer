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

  let [endall, setendall] = React.useState(0); //表示する付きの総数

  let endate = 0; //日付カウントアップ専用

  const [Datelen, setDatelen] = React.useState({
    index: [0],
  }); //月の日付の数

  let countmonth = -1;
  let [SelectView, setSelectview] = React.useState([0]);
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
    changeNum: number
  ) => {
    let arrayday: number[] = []; //月の日付数の仮置き
    let total: number = 0; //総日付数の仮置き
    let view: number[] = []; //表示の数

    if (timeUnit == "month") {
      [...Array(changeNum + 2)].map(
        (_: undefined, idx: number) => (
          arrayday.push(new Date(year, setNumber + idx, 0).getDate()),
          (total += new Date(year, setNumber + idx, 0).getDate()), //表示する付きの総数
          view.push(new Date(year, setNumber + idx, 0).getMonth())
        )
      );
      setDatelen({ index: arrayday });
      setendall(total);
      setSelectview(view);
    } else if (timeUnit == "week") {
      let weekNumber = Math.floor((today.getDate() - today.getDay() + 12) / 7);
      let start = new Date(year, month, (weekNumber - 1) * 7 + 1);
      let day = start.getDay();
      start.setDate(start.getDate() + (day ? 0 - day : 0));
      setDatelen({index: [7*(changeNum+2)]})
      console.log(Datelen,start.getDate());
    }
  };

  //ガントチャート描画距離の指定
  const [calendarState, setCalendar] = React.useState<Gantt>({
    name: "month",
    numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  });

  React.useEffect(() => {
    viewcalendar(calendarState.name, month, 1);

    let container = document.getElementById("container");
    container!!.scrollLeft = 500;
    return () => console.log(container?.scrollLeft)
     //  = scroll!!.left + 100;
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
    let target = document.getElementById(calendarState.name) as HTMLSelectElement;
    viewcalendar(calendarState.name, month, parseInt(target.value))
    // let container = document.getElementById("container");
    // container!!.scrollLeft = 500;
  }, [calendarState]);

  //数字が動いたときに再描画させたい
  const chengeCalendar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    viewcalendar(calendarState.name, month, parseInt(e.target.value));
    // let container = document.getElementById("container");
    // container!!.scrollLeft = 500;
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
      return (
        <g className="drawing">
          {React.Children.toArray(
            [...Array(endall)].map((_: undefined, idx: number) => (
              <path
                d={"M " + (idx + 1) * 40 + " 59 v" + termlength!! * 40}
                className={classes.tick}
              />
            ))
          )}
          {React.Children.toArray(
            Datelen.index.map((value) => (
              <g className={"date" + SelectView[++countmonth]}>
                {React.Children.toArray(
                  [...Array(value)].map((_: undefined, idx: number) =>
                    (() => {
                      if (idx == 15 || (idx % 45 == 0 && idx != 0)) {
                        return [
                          // 日付を書く場所
                          <text
                            key={idx}
                            x={19+ (endate++) * 40}
                            y="50"
                            className={classes.lower_text}
                          >
                            {++idx}
                          </text>,
                          //月の名前を表示
                          <text
                            key={SelectView[countmonth]}
                            x={endate * 40}
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
                            x={19 +(endate++) * 40}
                            y="50"
                            className={classes.lower_text}
                          >
                            {++idx}
                          </text>
                        );
                      }
                    })()
                  )
                )}
              </g>
            ))
          )}
        </g>
      );
    } else if (state == "week") {
      //週の表示
      return (
        <g className="drawing">
          {React.Children.toArray(
            [...Array(endall)].map((_: undefined, idx: number) => (
              <path
                d={"M " + (idx + 1) * 40 + " 59 v" + termlength!! * 40}
                className={classes.tick}
              />
            ))
          )}

          {React.Children.toArray(
            Datelen.index.map((value) => (
              <g className={"date" + SelectView[++countmonth]}>
                {React.Children.toArray(
                  [...Array(value)].map((_: undefined, idx: number) =>
                    (() => {
                      if (idx == 15 || (idx % 45 == 0 && idx != 0)) {
                        return [
                          // 日付を書く場所
                          <text
                            key={idx}
                            x={19 + ++endate * 40}
                            y="50"
                            className={classes.lower_text}
                          >
                            {++idx}
                          </text>,
                          //月の名前を表示
                          <text
                            key={SelectView[countmonth]}
                            x={endate * 40}
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
                            x={19 + ++endate * 40}
                            y="50"
                            className={classes.lower_text}
                          >
                            {++idx}
                          </text>
                        );
                      }
                    })()
                  )
                )}
              </g>
            ))
          )}
        </g>
      );
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
          <svg id="gantt" height={termlength!! * 40 + 60} width={endall * 40}>
            <g id="chart">
              {/* {console.log(endall)} */}
              {/* ガントチャートの表を作成 */}
              {React.Children.toArray(
                appDataManager.terms?.map((value) => (
                  <rect
                    x="0"
                    y={value.id * 40 + 59}
                    width={endall * 40}
                    height="40"
                    className={classes.grid_row}
                  />
                ))
              )}
            </g>
            <g id="today">
              {/*今日の日付をオレンジ色にする  */}
              <rect
                x={(today.getDate() - 1) * 40}
                y="0"
                width="40"
                height={(termlength!! + 1) * 40 + 19}
                className={classes.today_highlight}
              />
            </g>

            {/* 日付を表示する土台 */}
            <rect
              x="0"
              y="0"
              width={endall * 40}
              height="60"
              className={classes.grid_header}
            />

            {/* ガントチャートの枠組み */}
            <path d="M 0 59 v 190" className={classes.tick_thick} />

            {/* 日付の表示 */}
            {setdrawig(calendarState.name)}

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
                            x={
                              (startday - 1) * 40 + (endday - startday + 1) * 20
                            }
                            y={41 + (value.id + 1) * 40}
                            className={classes.bar_label}
                          >
                            {value.name}
                          </text>
                        </g>
                        {/* <g className="handle-group">
                          <rect
                            x={
                              (startday - 1) * 40 +
                              (endday - startday + 1) * 40 -
                              9
                            }
                            y={28 + (value.id + 1) * 40}
                            width="8"
                            height="25"
                            rx="3"
                            ry="3"
                            className={classes.handle_right}
                          />
                          <rect
                            x={(startday - 1) * 40 + 1}
                            y={28 + (value.id + 1) * 40}
                            width="8"
                            height="25"
                            rx="3"
                            ry="3"
                            className={classes.handle_left}
                          />
                        </g> */}
                      </g>
                    )
                  )
                )
              )}
            </g>
          </svg>
        </div>
      </div>
    </main>
  );
}
