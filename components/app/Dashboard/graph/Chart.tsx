import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import AppDataManager from "../../../../lib/app/appDataManager";
// Generate Sales Data
function createData(time: Date, amount: string | number) {
    //
    // let year = time.getFullYear();
    // let month = time.getMonth() + 1;
    // let day = time.getDate();

    // console.log( year + '年' + month + '月' + day + '日');
    // let aaa = ("0" + month +":" + day + "0");
    // console.log(aaa);
    return { time, amount };
}



// const data = [
//     createData('00:00', 0),
//     createData('03:00', 300),
//     createData('06:00', 600),
//     createData('09:00', 800),
//     createData('12:00', 1500),
//     createData('15:00', 2000),
//     createData('18:00', 2400),
//     createData('21:00', 2400),
//     createData('24:00', undefined),
// ];

export default function Chart() {
    const theme = useTheme();


    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(0)
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();


    type Prop = {
        day: Date,
        mount: number
    }[]
    // const data:Prop = [
    //     {
    //         day:new Date(),
    //         mount: 1,
    //     }
    // ]
    //
    // function create(){
    //     // appDataManager.archives?.filter(value => value.datetime.getDate() == ().getDate()).map(value => value);
    // }

    // const data0 = appDataManager.archives?.filter(value => value.outcomes != undefined);
    //outcomesが存在しているJsonを取得
    const data = appDataManager.archives?.filter(value => value.outcomes != undefined).map(
        value => ({day: value.recordingDateTime, outcomeValue: value.outcomes})
    ).map(value => createData(value.day.toLocaleDateString(),value.outcomeValue[0].value));

    // const sample = appDataManager.archives?.filter(value => value.datetime.getDate() == (new Date()).getDate()).map(value => value);
    console.log("dataの中身");
    console.log(data);
    // const array = [...Array(30)].map(_ => "a")

    // function createData(time ,amount) {
    //     return { time, amount };
    // }

    return (
        <React.Fragment>
            <Title>Today</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
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
