import React from "react";
import AppDataManager from "../../../lib/app/appDataManager";
import ToDoBox from "./Todobox";
import { useStyles } from './Weekly.module';

export default function Weekly() {
  let today = new Date(); //今日の日付
  let year = today.getFullYear(); //今年
  let month = today.getMonth() + 1; //今月

  let startday: any; //termの開始日
  let endday: any; //termの終了日
  let termDay: number //termの期間
  let startmonth: number; //termの開始月
  let endmonth: number; //termの終了月

  const [startnumber, setstartnumber] = React.useState(0);

  //指定した週目の始まりと最後を出す
  const getWeekOfMonth = (year: number, month: number, weekNumber: number) => {
    let start = new Date(year, month - 1, (weekNumber - 1) * 7 + 1);
    let day = start.getDay();
    start.setDate(start.getDate() + (day ? startnumber - day : -6));
    let end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start: start, end: end };
  };

  //今日が第何週かを出す
  const [week, setweek] = React.useState(Math.floor((today.getDate() - today.getDay() + 12) / 7));

  const getweek = getWeekOfMonth(year, month, week);
  const weekstart:any = getweek.start;
  const weekend = getweek.end;
  let chengeDate = new Date(weekstart)
  chengeDate.setDate(weekstart.getDate() - 1);

  //termの取得するための関数
  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance(0);
    } catch (e) {
      return AppDataManager.getInstance();
    }
  })();

  const classes = useStyles(); //css呼び出し

  const weekchenge = (e: React.MouseEvent<HTMLButtonElement>) => {
    let num = Number(e.currentTarget.getAttribute("value"));
    setweek((current) => current + num); //今週から１週前か後に移動
    chengeDate = getweek.start;
  };

  //日曜はじめ又は、月曜はじめを決める
  const selectweek = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setstartnumber(Number(e.target.value));
  };

  return (
    <div>
      <button className={classes.button_left} onClick={weekchenge} value="-1">
      {"<"}
      </button>
      <button className={classes.button_right} onClick={weekchenge} value="1">
        {">"}
      </button>
      <div className={classes.gantt_warp}>
        <div className={classes.gantt_container}>
          <svg className={classes.gantt} height={4 * 40 + 59} width={7 * 130}>
            <rect
              x="0"
              y="0"
              width={7 * 130}
              height={4 * 40 + 59}
              className={classes.grid_background}
            />
            <g>
              {/* ガントチャートの表を作成 */}
              {React.Children.toArray(
                appDataManager.terms
                  ?.slice(0, 4)
                  .map((value) => (
                    <rect
                      x="0"
                      y={value.id * 40 + 59}
                      width={7 * 130}
                      height="40"
                      className={classes.grid_row}
                    />
                  ))
              )}
            </g>
            <g>
              {/* ガントチャートの横線を作る */}
              {React.Children.toArray(
                appDataManager.terms
                  ?.slice(0, 4)
                  .map((value) => (
                    <line
                      x="0"
                      y={value.id * 40 + 97}
                      width={7 * 130}
                      height="40"
                      className={classes.row_line}
                    />
                  ))
              )}
              {/*今日の日付をオレンジ色にする  */}
              {chengeDate.getMonth() == today.getMonth() &&
                <rect x={(today.getDate() - chengeDate.getDate() - 1) * 130}
                y="0" width="130" height={5 * 40 + 19} className={classes.today_highlight} />
              }
              </g>
            {/* 日付を表示する土台 */}
            <rect
              x="0"
              y="0"
              width={7 * 130}
              height="60"
              className={classes.grid_header}
            />

            {/* ガントチャートの枠組み */}
            <path d="M 0 59 v 190" className={classes.tick_thick} />

            {/* ガントチャートの縦線を作る */}
            {React.Children.toArray(
              [...Array(7)].map((_: undefined, idx: number) => (
                <path
                  d={"M " + (idx + 1) * 130 + " 59 v" + 4 * 40}
                  className={classes.tick}
                />
              ))
            )}

            {React.Children.toArray(
              [...Array(7)].map((_: undefined, idx: number) =>
                (chengeDate.setDate(chengeDate.getDate() + 1),
                () => {
                  if (idx == 0) {
                    //今月の表示
                    return (
                      <text
                        key={idx}
                        x={73 + idx * 130}
                        y="50"
                        className={classes.lower_text}
                      >
                        {chengeDate.getMonth() + 1 + "/" + chengeDate.getDate()}
                      </text>
                    );
                  } else if (chengeDate.getDate() == 1) {
                    // １週間の表示中に月が変わった場合
                    return (
                      <text
                        key={idx}
                        x={73 + idx * 130}
                        y="50"
                        className={classes.lower_text}
                      >
                        {chengeDate.getMonth() + 1 + "/" + chengeDate.getDate()}
                      </text>
                    );
                  } else {
                    //それ以外
                    return (
                      <text
                        key={idx}
                        x={73 + idx * 130}
                        y="50"
                        className={classes.lower_text}
                      >
                        {chengeDate.getDate()}
                      </text>
                    );
                  }
                })()
              )
            )}
            {/* termの内容を表示 */}
            <g className={classes.bar}>
              {React.Children.toArray(appDataManager.terms?.map(value => (
                  startday = value.startDatetimeScheduled, //termの開始日
                  endday = value.endDatetimeScheduled, //termの終了日
                  termDay = (endday-startday)/86400000,
                  startmonth = value.startDatetimeScheduled.getMonth(), //termの開始月
                  endmonth = value.endDatetimeScheduled.getMonth(), //termの終了月
                  () => {
                    if ((startmonth == weekstart.getMonth() || endmonth == weekend.getMonth()) && termDay != 0) { 
                      return (
                      <g className={classes.bar_wrapper}>
                        <g className="bar_group">
                          {/* termの全体表示 */}
                          <rect x={((startday - weekstart)/86400000) * 130} y={28 + (value.id) * 40}
                            width={(termDay) * 130} height="25" rx="3" ry="3" className={classes.bar}/>
                          {/* termの名前表示 */}
                          <text x={((startday - weekstart)/86400000) * 130 +(termDay * 65)}
                            y={41 + (value.id) * 40} className={classes.bar_label}>
                            {value.name}
                          </text>
                        </g>
                        <g className="handle-group">
                          {/* <rect x={(startday - 1) * 40 +(endday - startday + 1) * 40 -9} y={28 + (value.id + 1) * 40} width="8"
                            height="25" rx="3" ry="3" className={classes.handle_right}/>
                          <rect x={(startday - 1) * 40 + 1} y={28 + (value.id + 1) * 40}width="8"
                            height="25" rx="3" ry="3" className={classes.handle_left}/> */}
                        </g>
                      </g>
                      )
                    }
                  })()
                )
              )}
            </g>
          </svg>
        </div>
      </div>
      <select id="selectweek" defaultValue={"0"} onChange={selectweek}>
        <option value="0">日曜はじめ</option>
        <option value="1">月曜はじめ</option>
      </select>
       <div className={classes.todo}>
         {console.log(getweek)}
         {/* １週間を回す */}
         {appDataManager.todos?.filter(value => value.completed).map(value => (
             <ToDoBox todo={value} key={value.id}/>
           ))}
        </div> 
    </div>
  );
}
