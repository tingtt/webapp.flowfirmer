import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import AppDataManager from "../../../../lib/app/appDataManager";


import { Target, OutcomeScheme, ToDo, Term, HabitRemind, Document, Archive, FeelingType} from "../lib/interface/index";
import {sampleArchives, sampleOutcomeSchemes} from "../../../../utils/sample-data";
import {element} from "prop-types";
// const JsonData = {
//     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6M30.-RmolK2yznBtDt3jnaLmIdMQEMrqSI9l57yGepBQUIg",
//     "data": {
//         "todoId": "6108dec3999f8d48ab580a19",
//         "checkInDateTime": "2021-12-01T03:24:00",
//         "targets": ["60ef8fc17540ec361fa9a3df"],
//         "statistics":{
//             "6108de34999f8dd93b580a17":[
//                 {
//                     "targetId": "1",
//                     "name": "testsample",
//                     "unitname": "tete",
//                     "statisticsRule": "test",
//                     "defaultValue": 10,
//                     "value": 5,
//                     "feelingText": "testtext",
//                     "feelingName": "testName",
//                     "positivePercent": 10,
//                     "negativePercent": 5,
//                     "recordingDateTime": "2021-12-01T03:24:00"
//                 },
//                 {
//                     "targetId": "2",
//                     "name": "testsample2",
//                     "unitname": "tete2",
//                     "statisticsRule": "test2",
//                     "defaultValue": 10,
//                     "value": 7,
//                     "feelingText": "testtext2",
//                     "feelingName": "testName2",
//                     "positivePercent": 10,
//                     "negativePercent": 5,
//                     "recordingDateTime": "2021-12-01T03:24:00"
//                 }
//             ],
//             "6108de34999f8d83918f580a":[
//                 {
//                     "targetId": "11",
//                     "name": "testsample3",
//                     "unitname": "tete3",
//                     "statisticsRule": "test3",
//                     "defaultValue": 10,
//                     "value": 2,
//                     "feelingText": "testtext3",
//                     "feelingName": "testName3",
//                     "positivePercent": 10,
//                     "negativePercent": 5,
//                     "recordingDateTime": "2021-12-01T03:24:00"
//                 },
//                 {
//                     "targetId": "12",
//                     "name": "4",
//                     "unitname": "tete4",
//                     "statisticsRule": "test4",
//                     "defaultValue": 10,
//                     "value": 5,
//                     "feelingText": "testtext4",
//                     "feelingName": "testName4",
//                     "positivePercent": 10,
//                     "negativePercent": 5,
//                     "recordingDateTime": "2021-12-01T03:24:00"
//                 }
//             ]
//         }
//     }
// }

// Generate Sales Data
function createData(time: Date, amount: string | number) {
    return { time, amount };
}

export default function Chart(props) {
    const theme = useTheme();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance();
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    // console.log("sampleGraph")
    // var allData = []
    // var data = []
    // var tempData = {}
    // // console.log("受けとるJson")
    // // console.log(JsonData)
    // // console.log("空の配列宣言")
    // // console.log(data)
    //
    // //["key", "key"]
    // Object.keys(JsonData.data.statistics).forEach(key =>{
    //     JsonData.data.statistics[key].forEach(element =>{
    //         //tempData["date"] = element.recordingDateTime
    //         // tempData["date"] = element.recordingDateTime
    //         // tempData["value"] = element.value
    //         data.push(createData(element.recordingDateTime,element.value))
    //         tempData = {}
    //     })
    //     allData.push(data)
    //     data = []
    // })
    // console.log(data)
    // console.log(allData)

    // let filtered = [12, 5, 8, 130, 44].filter(function (element, index, array) {
    //     return (element >= 10);
    // });
    // console.log(filtered); // [ 12, 130, 44 ]
    //
    // console.log(
    //     sampleGraph.filter(function (e,i,i) {
    //     return (e.data.filter(value => value.statisticd);})
    // );
    // const map1 = sampleGraph.filter(value => value.data.)
    // console.log(map1)

    // const data0 = appDataManager.archives?.filter(value => value.outcomes != undefined);
    //outcomesが存在しているJsonを取得
    // const data = appDataManager.archives?.filter(value => value.outcomes != undefined).map(
    //     value => ({day: value.recordingDateTime, outcomeValue: value.outcomes})
    // ).map(value => createData(value.day.toLocaleDateString(),value.outcomeValue[0].value));
    // console.log("dataの中身");
    // console.log(data);
    // console.log(props.graphData)

    // for (let i = 0; i < sampleArchives.length; i++){
    //
    //     appDataManager.archives?.filter(value => value.outcomes != undefined).map(
    //         value => ({day: value.recordingDateTime, outcomeValue: value.outcomes})
    //     ).map(value => createData(value.day.toLocaleDateString(),value.outcomeValue[i].value));
    // }

    // const sample = appDataManager.archives?.filter(value => value.datetime.getDate() == (new Date()).getDate()).map(value => value);

    // const array = [...Array(30)].map(_ => "a")

    return (
        <React.Fragment>
            <Title>{props.title}</Title>
            <ResponsiveContainer>
                <LineChart
                    data={props.graphData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            Sales ($)
                        </Label>
                    </YAxis>
                    <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
