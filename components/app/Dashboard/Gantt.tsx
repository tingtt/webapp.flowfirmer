import React from 'react';
import { useStyles } from './Gantt.module';
import { Gantt } from '../../../lib/interface/gantt';
// import { Term } from '../../../lib/interface';
import AppDataManager from "../../../lib/app/appDataManager";

let today = new Date() //今日の日付
let year = today.getFullYear()　//今年
let month = today.getMonth()　//今月
let endDate1 = new Date(year,month,0 ).getDate() //先月末を取得
let endDate2 = new Date(year,month+1,0 ).getDate()//今月末を取得
let endDate3 = new Date(year,month+2,0 ).getDate()//翌月末を取得

let endall = endDate1 + endDate2 + endDate3 //表示する付きの総数
let endate = -1　//日付カウントアップ専用

let startday:number　//termの始める日
let endday:number //termの終わる日

let countmonth = -1
let selectmonth = [month-1,month,month+1]
const strmonth = ["January","February","March","April","May","June","July","August","September","October","November","December"]
let startmonth:number
let endmonth:number

export default function Gantt() {

  const appDataManager: AppDataManager = (() => {
    try {
        return  AppDataManager.generateInstance(0)
    } catch (e) {
        return  AppDataManager.getInstance();
    }
  })();

  // const [arrayTerm, setarrayTerm] = React.useState<Term>();

  const [Datelen , setDatelen] = React.useState({index:[endDate1,endDate2,endDate3]}) //月の日付の数

  //ガントチャート描画距離の指定
  const [calendarState, setCalendar] = React.useState<Gantt>({name: 'month',numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]})

  const selectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    let select = e.target.value

    if(select == "weekly"){
      setCalendar({name: 'week',　numSelecter: [1, 2, 3, 4, 5, 6] })
    }else if(select == "Monthly"){
      setCalendar({name: 'month', numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] })
    }else if(select == "Yearly"){
      setCalendar({name: 'year', numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
    };
    
  }

  const chengeCalendar = (e:React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);

    // today = new Date()
    // year = today.getFullYear()
    // month = today.getMonth()
      // endDate = new Date(year,month+2,0)
      // Datelen = endDate.getDate()
    

  }

  const classes = useStyles();

  // teram全体の数
  const length = appDataManager.terms?.length!
  
  return (
  <div>
    <select id={calendarState.name} name="number" onChange={chengeCalendar}>
      {React.Children.toArray(calendarState.numSelecter.map(value => (
        <option value={value} >{value}</option>
      )))}
    </select>
    <select id="calendar" defaultValue={'Monthly'} onChange={selectChange}>
      <option value="weekly">週</option>
      <option value="Monthly" >月</option>
      <option value="Yearly" >年</option>
    </select>

    <div className={classes.gantt_warp}>
      <div className={classes.gantt_container}>

        <svg id="gantt" height={length*40+59} width={endall*40}>
          <rect x="0" y="0" width={endall*40} height={length*40+59} className={classes.grid_background} />
          <g>
            {/* ガントチャートの表を作成 */}
            {React.Children.toArray(appDataManager.terms?.map(value => (
              <rect  x="0" y={value.id*40+59} width={endall*40} height="40" className={classes.grid_row} />
            )))}
            </g>
            <g>
            {/* ガントチャートの横線を作る */}
            {React.Children.toArray(appDataManager.terms?.map(value => (
              <line  x="0" y={value.id*40+97} width={endall*40} height="40" className={classes.row_line} />
            )))}
            {/*今日の日付をオレンジ色にする  */}
            <rect x={(today.getDate()-1)*40} y="0" width="40" height={(length+1)*40+19} className={classes.today_highlight} />
            </g>
            
            {/* 日付を表示する土台 */}
            <rect　x="0" y="0" width={endall*40} height="60" className={classes.grid_header}/>
            
            {/* ガントチャートの枠組み */}
            <path d="M 0 59 v 190" className={classes.tick_thick} />
            
            {/* ガントチャートの縦線を作る */}
            {React.Children.toArray([...Array(endall)].map((_: undefined, idx: number) => (
            <path  d={"M " + (idx + 1) * 40 + " 59 v" + length*40} className={classes.tick}/>
            )))}

            {Datelen.index.map(value => (
              <g className={"date"+selectmonth[++countmonth]}>
                {React.Children.toArray([...Array(value)].map((_: undefined, idx: number) => (
                  (() => {if (idx == 15 || (idx%45 == 0 && idx!=0) ){
                    return ([
                      // 日付を書く場所 
                      <text key={idx} x={19+(++endate*40)} y="50" className={classes.lower_text}>{++idx}</text>,
                      //月の名前を表示 
                      <text key={selectmonth[countmonth]} x={endate*40} y="25">{strmonth[selectmonth[countmonth]]}</text>
                    ])
                  }else{
                    // 日付を書く場所 
                    return <text key={idx} x={19+(++endate*40)} y="50" className={classes.lower_text}>{++idx}</text>
                  }
                })()
                )))}
              </g>
            ))}

              {/* console.log([...Array(Datelen.index[i])].map(value => value)); */}
            
            {/* todoの内容を表示 */}
            <g className={classes.bar}>
              {React.Children.toArray(appDataManager.terms?.map(value => (
                startday = value.startDatetimeScheduled.getDate(),
                endday = value.endDatetimeScheduled.getDate(),
                startmonth = value.startDatetimeScheduled.getMonth(),
                console.log(startmonth),
                <g className={classes.bar_wrapper}>
                  <g className='bar_group'>
                    {/* termの全体表示 */}
                    <rect  x={(startday-1)*40} y={28+(value.id+1)*40} width={(endday-startday+1)*40} height="25" rx="3" ry="3" className={classes.bar} />
                    {/* termの名前表示 */}
                    <text x={(startday-1)*40+(endday-startday+1)*20} y={41+(value.id+1)*40} className={classes.bar_label}>{value.name}</text>
                  </g>
                  <g className="handle-group">
                    <rect x={(startday-1)*40+(endday-startday+1)*40-9} y={28+(value.id+1)*40} width="8" height="25" rx="3" ry="3" className={classes.handle_right} onMouseDown={mousedown}/>
                    <rect x={(startday-1)*40+1} y={28+(value.id+1)*40} width="8" height="25" rx="3" ry="3" className={classes.handle_left}/>
                  </g>
                </g>
              )))}
            </g>
          </svg>

        </div>
      </div>
    </div>
  );

  function mousedown(event:React.MouseEvent<HTMLOrSVGElement>){  
    console.log(event)
  }

};
