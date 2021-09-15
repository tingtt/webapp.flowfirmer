import axios from "axios";
import GanttChart from "./Gantt";

type Props = {
    targetId: string
};

type GraphData = { time: number, amount: number }
type GraphObject = {
    targetId: string,
    outcomeId: string,
    title: string,
    unitName: string,
    totalFlg: boolean,
    data: GraphData[],
    dataTotal: GraphData[],
}

export default function Target(props: Props) {
    let Res: GraphObject[]

    const dateToTimeStr = (date: Date) => {
        return date.getTime();
    }

    //API経由 APIから取得した値をResに代入
    axios.post('/api/getOutcomeArchiveByUserId')
    .then( (res) => {
        // return;
        // statusのチェック
        if (res.data.status == 200) {
            console.log("axios post getOutcomeArchiveByUserId 成功");
        }else{
            console.log(`err: Failed to fetch OutcomeArchive. ${res.data.message}`);
        }

        // dataをグラフ用のオブジェクトに変換
        Res = (res.data.data as GraphObject[]).map(outcome => {
            // 通常グラフのデータを整形
            outcome.data = outcome.data.map(data => {
                // 日時情報をグラフで扱える形式に変換
                const timeNum = dateToTimeStr(new Date(data.time));
                return {
                    time: timeNum,
                    amount: data.amount
                }
            })
            // 加算グラフのデータを整形
            outcome.dataTotal = outcome.dataTotal.map(data => {
                // 日時情報をグラフで扱える形式に変換
                const timeNum = dateToTimeStr(new Date(data.time));
                return {
                    time: timeNum,
                    amount: data.amount
                }
            })
            return outcome;
        }).filter(outcome => outcome.targetId == props.targetId);
    })
    .catch(err => {
        console.log('err:', err);
    });

    return (
        <div>
            <GanttChart targetId={props.targetId}/>
        </div>
    )
}
