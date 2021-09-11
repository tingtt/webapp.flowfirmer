import React from "react";
import { useStyles } from "./Gantt.module";
import { Gantt } from "../../../lib/interface/gantt";
// import { Term } from '../../../lib/interface';
import AppDataManager from "../../../lib/app/appDataManager";

type Props = {
  targetId: string;
};

export default function GanttChart(props: Props) {
  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance(
        document.cookie
          .split("; ")
          .find((row: string) => row.startsWith("token"))!
          .split("=")[1]
      );
    } catch (e) {
      return AppDataManager.getInstance();
    }
  })();

  let Today = new Date(); //今日の日付
  let Year = Today.getFullYear(); //今年
  let Month = Today.getMonth(); //今月

  let StartDate: number; //termの始める日
  let Time: number; //termの期間
  let StartMonth: number; //termの開始月
  let StartYear: number; //termの開始年

  const [endall, setendall] = React.useState(0); //表示する付きの総数

  const [Datelen, setDatelen] = React.useState({
    index: [0],
    year: [0],
  }); //月の日付の数

  const [LastWeek, setLastWeek] = React.useState({
    start: new Date(),
    end: new Date(),
  });

  let countMonth = -1;
  const [SelectNum, setSelectNum] = React.useState(1); //svg描画距離の一時保存
  const [SelectView, setSelectview] = React.useState([0]);
  const [Days, setDays] = React.useState(0);
  const strMonth = [
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
    let yearlen: number[] = [];
    let container = document.getElementById("container"); //svgを表示させる大枠

    if (timeUnit == "month") {
      [...Array(ChangeNum + 2)].map((_: undefined, idx: number) => {
        arrayday.push(new Date(Year, setNumber + idx, 0).getDate());
        yearlen.push(new Date(Year, setNumber + idx, 0).getFullYear());
        total += 31;
        view.push(new Date(Year, setNumber + idx, 0).getMonth());
      });
      setDatelen({ index: arrayday, year: yearlen });
      setSelectview(view);
      setDays(total);

      if (ChangeNum == 1) {
        setendall(
          container!!.clientWidth * 3 //画面最大の表示を表示したい日にちで割り前後１ヶ月を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth;
      } else {
        setendall(
          (container!!.clientWidth / ChangeNum) * (ChangeNum + 2) //画面最大の表示を表示したい日にちで割り前後１ヶ月を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth / ChangeNum;
      }
    } else if (timeUnit == "week") {
      let weekNumber = Math.floor((Today.getDate() - Today.getDay() + 12) / 7); //今週が何番目
      let StartDate = new Date(Year, Month, (weekNumber - 2) * 7 + 1); //今週の始め
      let day = StartDate.getDay();
      StartDate.setDate(StartDate.getDate() + (day ? 0 - day : 0));
      let EndDate = new Date(StartDate); //今週の終わり
      EndDate.setDate(EndDate.getDate() + 7 * (ChangeNum + 1) + 6);

      setDatelen({ index: [7 * (ChangeNum + 2)], year: [] }); //日にちの長さ
      setLastWeek({ start: StartDate, end: EndDate }); //先週初め先

      if (ChangeNum == 1) {
        setendall(
          (container!!.clientWidth / 7) * 21 //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft =
          (container!!.clientWidth / (7 * ChangeNum)) * 7;
      } else {
        setendall(
          (container!!.clientWidth / ChangeNum) * (ChangeNum + 2) //画面最大の表示を表示したい日にちで割り前後１週間を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth / ChangeNum;
      }
    } else if (timeUnit == "year") {
      let LastYear = Year - 1;

      [...Array(ChangeNum + 2)].map(
        (_: undefined, idx: number) =>
          arrayday.push(new Date(LastYear + idx, setNumber, 0).getFullYear()) //表示する付きの総数
      );

      setDatelen({ index: arrayday, year: [] });

      if (ChangeNum == 1) {
        setendall(
          container!!.clientWidth * 3 //表示を表示したい年数を３年で固定
        );
        container!!.scrollLeft = container!!.clientWidth;
      } else {
        setendall(
          (container!!.clientWidth / ChangeNum) * (ChangeNum + 2) //画面最大の表示を表示したい年数で割り前後１年を含んで元に戻す
        );
        container!!.scrollLeft = container!!.clientWidth / ChangeNum;
      }
    }

    setSelectNum(ChangeNum); //画面表示する数を入れる
  };

  //ガントチャート描画距離の指定
  const [calendarState, setCalendar] = React.useState<Gantt>({
    name: "month",
    numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  });

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let select = e.target.value;

    if (select == "Weekly") {
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
    let target = document.getElementById(
      calendarState.name
    ) as HTMLSelectElement;
    viewcalendar(calendarState.name, Month, +target.value);
  }, [calendarState]);

  //数字が動いたときに再描画させたい
  const chengeCalendar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    viewcalendar(calendarState.name, Month, +e.target.value);
  };

  const classes = useStyles();

  //tergetidと一致する物だけ
  const targetlist = appDataManager.terms?.filter(
    (v) => v.targetList?.filter((a) => a.id == props.targetId).length != 0
  );

  function setdrawig(state: string) {
    //月の表示
    if (state == "month") {
      //日付カウントアップ
      let count: number = 0;
      //日付が表示内に存在する場合のみ
      const termlength = targetlist?.filter(
        (value) =>
          //今年の時
          (value.startDatetimeScheduled.getFullYear() == Year &&
            value.endDatetimeScheduled >= new Date(Year, Month - 1, 1) &&
            value.startDatetimeScheduled <=
              new Date(
                Year + Math.floor((Month + SelectNum) / 12),
                ((Month + SelectNum) % 12) + 1,
                0
              )) || //来年の場合
          (value.startDatetimeScheduled.getFullYear() > Year &&
            value.startDatetimeScheduled.getFullYear() ==
              Datelen.year[Datelen.year.length - 1] &&
            value.startDatetimeScheduled.getMonth() <=
              (Month + SelectNum) % 12) || //去年の時(12月しか表示されない)
          (Year - value.startDatetimeScheduled.getFullYear() == 1 &&
            value.startDatetimeScheduled.getMonth() == 11)
      );

      return (
        <svg id="gantt" height={termlength!!.length * 40 + 60} width={endall}>
          <g id="chart">
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(
              termlength?.map((value, index) => (
                <rect
                  key={value.name + "row"}
                  x="0"
                  y={index * 40 + 59}
                  width={endall}
                  height="40"
                  className={classes.grid_row}
                />
              ))
            )}
          </g>
          <g id="Today">
            {/*今日の日付をオレンジ色にする  */}
            {React.Children.toArray(
              SelectView.map((value) => {
                if (value == Today.getMonth()) {
                  return (
                    <rect
                      x={
                        (Datelen.index[0] + Today.getDate() - 1) *
                        (endall / Days)
                      }
                      y="0"
                      width={endall / Days}
                      height={(termlength!!.length + 1) * 40 + 19}
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
                      key={idx + "path"}
                      d={
                        "M " +
                        (endall / Days) * idx +
                        " 59 v" +
                        termlength!!.length * 40
                      }
                      className={classes.tick}
                    />
                  ))
                )
              : [...Array(SelectNum + 1)].map((_: undefined, idx: number) => (
                  <path
                    key={idx + "path"}
                    d={
                      "M " +
                      (endall / (SelectNum + 2)) * (idx + 1) +
                      " 59 v" +
                      termlength!!.length * 40
                    }
                    className={classes.tick}
                  />
                ))}

            {SelectNum == 1
              ? [
                  React.Children.toArray(
                    Datelen.index.map((value) => (
                      <g className={"date" + SelectView[++countMonth]}>
                        {React.Children.toArray(
                          [...Array(value)].map((_: undefined, idx: number) =>
                            (() => {
                              if (idx == 0) {
                                return [
                                  // 日付を書く場所
                                  <text
                                    key={idx}
                                    x={
                                      endall / Days / 2 +
                                      (endall / Days) * count
                                    }
                                    y="50"
                                    className={classes.monthly_text}
                                  >
                                    {++idx}
                                  </text>,
                                  //月の名前を表示
                                  <text
                                    key={SelectView[countMonth]}
                                    x={(endall / Days) * (15 + count)}
                                    y="25"
                                  >
                                    {strMonth[SelectView[countMonth]]}
                                  </text>,
                                ];
                              } else {
                                // 日付を書く場所
                                return (
                                  <text
                                    key={idx}
                                    x={
                                      endall / Days / 2 +
                                      (endall / Days) * (idx + count)
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
                        {(count += value)}
                      </g>
                    ))
                  ),
                  Days > count && (
                    <text
                      key={count}
                      x={endall / Days / 2 + (endall / Days) * count}
                      y="50"
                      className={classes.monthly_text}
                    >
                      {Days - count++}
                    </text>
                  ),
                ]
              : [...Array(SelectNum + 2)].map((_: undefined, idx: number) => {
                  return idx == 0 ? (
                    //月の名前を表示
                    <text
                      key={idx}
                      x={endall / (SelectNum + 2) / 2 - 15}
                      y="25"
                    >
                      {strMonth[SelectView[idx]]}
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
                      {strMonth[SelectView[idx]]}
                    </text>
                  );
                })}
          </g>
          {/* termの内容を表示 */}
          <g>
            {React.Children.toArray(
              termlength?.map((value, index) => {
                StartDate = value.startDatetimeScheduled.getDate();
                Time =
                  (value.endDatetimeScheduled.getTime() -
                    value.startDatetimeScheduled.getTime()) /
                  86400000;
                StartMonth = value.startDatetimeScheduled.getMonth(); //termの開始月
                StartYear = value.startDatetimeScheduled.getFullYear();
                return SelectNum == 1 ? (
                  <g className={classes.bar_wrapper}>
                    <g className="bar_group">
                      {/* termの全体表示 */}
                      <rect
                        key={value.id}
                        x={
                          ((StartMonth % 12) +
                            (StartYear - Year) * 12 -
                            (Month - 1)) *
                            (endall / 3) +
                          (StartDate - 1) * (endall / Days)|0
                        }
                        y={28 + (index + 1) * 40}
                        width={(Time + 1) * (endall / Days)|0}
                        height="25"
                        rx="3"
                        ry="3"
                        className={classes.bar}
                      />
                      {/* termの名前表示 */}
                      {StartMonth >= Month - 1 ? (
                        <text
                          x={
                            ((StartMonth % 12) +
                              (StartYear - Year) * 12 -
                              (Month - 1)) *
                              (endall / 3) +
                            (StartDate - 1) * (endall / Days)
                          }
                          y={41 + (index + 1) * 40}
                          className={classes.bar_label}
                        >
                          {value.name}
                        </text>
                      ) : (
                        <text
                          x={0}
                          y={41 + (index + 1) * 40}
                          className={classes.bar_label}
                        >
                          {value.name}
                        </text>
                      )}
                    </g>
                  </g>
                ) : (
                  <g className={classes.bar_wrapper}>
                    <g className="bar_group">
                      {/* termの全体表示 */}
                      <rect
                        key={value.id}
                        x={
                          ((StartMonth % 12) +
                            (StartYear - Year) * 12 -
                            (Month - 1)) *
                            (endall / (SelectNum + 2))|0 +
                          (StartDate - 1) * (endall / Days)|0
                        }
                        y={28 + (index + 1) * 40}
                        width={(Time + 1) * (endall / Days)|0}
                        height="25"
                        rx="3"
                        ry="3"
                        className={classes.bar}
                      />
                      {/* termの名前表示 */}
                      {StartMonth >= Month - 1 ? (
                        <text
                          key={value.name}
                          x={
                            ((StartMonth % 12) +
                              (StartYear - Year) * 12 -
                              (Month - 1)) *
                              (endall / (SelectNum + 2)) +
                            (StartDate - 1) * (endall / Days)
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
                  </g>
                );
              })
            )}
          </g>
        </svg>
      );
    } else if (state == "week") {
      let week: number = 7 * (SelectNum + 2);
      let changeDate = new Date(LastWeek.start);
      //日付が表示内に存在する場合のみ
      const termlength = targetlist?.filter(
        (value) =>
          value.startDatetimeScheduled.getMonth() >=
            LastWeek.start.getMonth() &&
          LastWeek.end >= value.startDatetimeScheduled &&
          LastWeek.start <= value.endDatetimeScheduled
      );

      //週の表示
      return (
        <svg id="gantt" height={termlength!!.length * 40 + 60} width={endall}>
          <g id="chart">
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(
              termlength?.map((value) => (
                <rect
                  key={value.name + "row"}
                  x="0"
                  y={+value.id * 40 + 59}
                  width={endall}
                  height="40"
                  className={classes.grid_row}
                />
              ))
            )}
          </g>
          <g id="Today">
            {/*今日の日付をオレンジ色にする  */}
            <rect
              x={((7 + Today.getDay()) * endall) / week}
              y="0"
              width={endall / week}
              height={(termlength!!.length + 1) * 40 + 19}
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
                  [...Array(week)].map((_: undefined, idx: number) => (
                    <path
                      key={idx + "path"}
                      d={
                        "M " +
                        (endall / week) * idx +
                        " 59 v" +
                        termlength!!.length * 40
                      }
                      className={classes.tick}
                    />
                  ))
                )
              : [...Array(SelectNum + 1)].map((_: undefined, idx: number) => (
                  <path
                    key={idx + "path"}
                    d={
                      "M " +
                      (endall / (SelectNum + 2)) * (idx + 1) +
                      " 59 v" +
                      termlength!!.length * 40
                    }
                    className={classes.tick}
                  />
                ))}

            {React.Children.toArray(
              Datelen.index.map((value) => (
                <g className={"date" + SelectView[++countMonth]}>
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
              termlength?.map((value, index) => {
                StartDate = value.startDatetimeScheduled.getDate();
                StartMonth = value.startDatetimeScheduled.getMonth(); //termの開始月
                Time =
                  (value.endDatetimeScheduled.getTime() -
                    value.startDatetimeScheduled.getTime()) /
                  86400000;
                return (
                  <g className={classes.bar_wrapper}>
                    <g className="bar_group">
                      {/* termの全体表示 */}
                      <rect
                        key={value.id}
                        x={
                          (((Month - LastWeek.start.getMonth()) *
                            (new Date(Year, Month, 0).getDate() -
                              LastWeek.start.getDate()) +
                            (StartMonth - Month) *
                              new Date(Year, StartMonth, 0).getDate() +
                            StartDate) *
                            endall) /
                          week
                        }
                        y={28 + (index + 1) * 40}
                        width={((Time + 1) * endall) / week}
                        height="25"
                        rx="3"
                        ry="3"
                        className={classes.bar}
                      />
                      {/* termの名前表示 */}
                      {value.startDatetimeScheduled >= LastWeek.start ? (
                        <text
                          key={value.name}
                          x={
                            (((Month - LastWeek.start.getMonth()) *
                              (new Date(Year, Month, 0).getDate() -
                                LastWeek.start.getDate()) +
                              (StartMonth - Month) *
                                new Date(Year, StartMonth, 0).getDate() +
                              StartDate) *
                              endall) /
                            week
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
                  </g>
                );
              })
            )}
          </g>
        </svg>
      );
    } else if (state == "year") {
      let TotalYear = 4 * (SelectNum + 2); //表示したい数
      let Firstcount = 0; //一年表示時のカウントアップ
      let Yearcount = 0; //年数カウントアップ

      //日付が表示内に存在する場合のみ
      const termlength = targetlist?.filter(
        (value) =>
          value.endDatetimeScheduled.getFullYear() >= Year - 1 &&
          Year + SelectNum >= value.startDatetimeScheduled.getFullYear()
      );

      //週の表示
      return (
        <svg id="gantt" height={termlength!!.length * 40 + 60} width={endall}>
          <g id="chart">
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(
              termlength?.map((value) => (
                <rect
                  key={value.name + "row"}
                  x="0"
                  y={+value.id * 40 + 59}
                  width={endall}
                  height="40"
                  className={classes.grid_row}
                />
              ))
            )}
          </g>
          <g id="Today">
            {/*今日の日付をオレンジ色にする  */}
            <rect
              x={(endall / TotalYear) * (4 + Math.floor((Month + 1) / 3))}
              y="0"
              width={20}
              height={(termlength!!.length + 1) * 40 + 19}
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
                  [...Array(TotalYear)].map((_: undefined, idx: number) => (
                    <path
                      key={idx + "path"}
                      d={
                        "M " +
                        (endall / TotalYear) * idx +
                        " 59 v" +
                        termlength!!.length * 40
                      }
                      className={classes.tick}
                    />
                  ))
                )
              : [...Array(SelectNum + 1)].map((_: undefined, idx: number) => (
                  <path
                    key={idx + "path"}
                    d={
                      "M " +
                      (endall / (SelectNum + 2)) * (idx + 1) +
                      " 59 v" +
                      termlength!!.length * 40
                    }
                    className={classes.tick}
                  />
                ))}

            {SelectNum == 1
              ? React.Children.toArray(
                  Datelen.index.map((value) =>
                    React.Children.toArray(
                      [...Array(4)].map((_: undefined, idx: number) =>
                        idx == 0 ? (
                          <g className={value.toString()}>
                            {/* 日付を書く場所 */}
                            <text
                              key={Datelen.index[Yearcount] + 1}
                              x={
                                (endall / (4 * (SelectNum + 2))) *
                                  Firstcount++ +
                                10
                              }
                              y="50"
                              className={classes.monthly_text}
                            >
                              {1}
                            </text>
                            <text
                              key={Datelen.index[Yearcount] + "year"}
                              x={
                                endall / (SelectNum + 2) / 4 +
                                (endall / (4 * (SelectNum + 2))) * Firstcount -
                                15
                              }
                              y="25"
                            >
                              {Datelen.index[Yearcount++]}
                            </text>
                          </g>
                        ) : (
                          <g className={value.toString()}>
                            <text
                              key={
                                `${Datelen.index[Yearcount]}` + (idx * 3 + 1)
                              }
                              x={
                                (endall / (4 * (SelectNum + 2))) *
                                  Firstcount++ +
                                10
                              }
                              y="50"
                              className={classes.monthly_text}
                            >
                              {idx * 3 + 1}
                            </text>
                          </g>
                        )
                      )
                    )
                  )
                )
              : [...Array(SelectNum + 2)].map((_: undefined, idx: number) => {
                  //最大描写数が１以外の時
                  //年を表示する
                  return idx == 0 ? (
                    <text
                      key={idx}
                      x={endall / (SelectNum + 2) / 2 - 15}
                      y="25"
                    >
                      {Datelen.index[idx]}
                    </text>
                  ) : (
                    <text
                      key={idx}
                      x={
                        (endall / (SelectNum + 2)) * idx +
                        endall / (SelectNum + 2) / 2 -
                        15
                      }
                      y="25"
                    >
                      {Datelen.index[idx]}
                    </text>
                  );
                })}
          </g>

          {/* termの内容を表示 */}
          <g>
            {React.Children.toArray(
              termlength?.map((value, index) => {
                StartYear = value.startDatetimeScheduled.getFullYear();
                StartMonth = value.startDatetimeScheduled.getMonth(); //termの開始月
                StartDate = value.startDatetimeScheduled.getDate();
                Time =
                  (value.endDatetimeScheduled.getTime() -
                    value.startDatetimeScheduled.getTime()) /
                  86400000;
                return SelectNum == 1 ? (
                  <g className={classes.bar_wrapper}>
                    <g className="bar_group">
                      {/* termの全体表示 */}
                      <rect
                        key={value.id}
                        x={
                          ((StartYear - (Year - 1)) * 12 + StartMonth) *
                            (endall / 36) +
                          (StartDate * endall) / (36 * 30.5)
                        }
                        y={28 + (index + 1) * 40}
                        width={((Time + 1) * endall) / (36 * 30.5)}
                        height="25"
                        rx="3"
                        ry="3"
                        className={classes.bar}
                      />
                      {/* termの名前表示 */}
                      {StartYear >= Year - 1 ? (
                        <text
                          key={value.name}
                          x={
                            ((StartYear - (Year - 1)) * 12 + StartMonth) *
                              (endall / 36) +
                            (StartDate * endall) / (36 * 30.5)
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
                  </g>
                ) : (
                  <g className={classes.bar_wrapper}>
                    <g className="bar_group">
                      {/* termの全体表示 */}
                      <rect
                        key={value.id}
                        x={
                          ((StartYear - (Year - 1)) * 12 + StartMonth) *
                            (endall / ((SelectNum + 2) * 12)) +
                          (StartDate * endall) / ((SelectNum + 2) * 12 * 30.5)
                        }
                        y={28 + (index + 1) * 40}
                        width={
                          ((Time + 1) * endall) / ((SelectNum + 2) * 12 * 30.5)
                        }
                        height="25"
                        rx="3"
                        ry="3"
                        className={classes.bar}
                      />
                      {/* termの名前表示 */}
                      {StartYear >= Year - 1 ? (
                        <text
                          key={value.name}
                          x={
                            ((StartYear - (Year - 1)) * 12 + StartMonth) *
                              (endall / ((SelectNum + 2) * 12)) +
                            (StartDate * endall) / ((SelectNum + 2) * 12 * 30.5)
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
                  </g>
                );
              })
            )}
          </g>
        </svg>
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
        <option value="Weekly">週</option>
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
