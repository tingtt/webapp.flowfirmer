import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chart from './graph/Chart';
// import FeelingChart from './graph/FeelingChart';
import axios from "axios";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">{/*https://material-ui.com/*/}
                Flow firmer
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%'
    },
    contentLeft: {
        flex: 1,
        overflow: 'auto',
        paddingRight: theme.spacing(2)
    },
    contentRight: {
        flex: 1,
        overflow: 'auto',
        paddingLeft: theme.spacing(2)
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

const dateToTimeStr = (date: Date) => {
    return date.getTime();
}

type GraphData = { time: number, amount: number }
type GraphObject = {
    //string number　どっちかきく ///////////////////////////
    targetId: string,
    outcomeId: string,
    title: string,
    unitName: string,
    totalFlg: boolean,
    data: GraphData[],
    dataTotal: GraphData[],
}

// type GraphDataRaw = { time: number, amount: number }
// type GraphObjectRaw = {
//     targetId: string,
//     outcomeId: string
//     title: string,
//     unitName: string,
//     totalFlg: boolean,
//     data: GraphDataRaw[],
//     dataTotal: GraphDataRaw[],
// }
let Res: GraphObject[]
let ResSample: GraphObject[]

const SampleJson: GraphObject[] = [
    {
        targetId: "1",
        outcomeId: "1",
        title: "スクワット",
        unitName: "回",
        totalFlg: false,
        data: [
            { time: new Date(2021, 9, 9).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10).getTime(), amount: 200 },
            { time: new Date(2021, 9, 11).getTime(), amount: 100 },
            { time: new Date(2021, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 13).getTime(), amount: 200 },
            // { time: new Date(2021, 9, 14).getTime(), amount: 100 },
            // { time: new Date(2021, 9, 15).getTime(), amount: 100 },
            { time: new Date(2021, 9, 16).getTime(), amount: 300 },

        ],
        dataTotal: [
            { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10, 12).getTime(), amount: 300 },
            { time: new Date(2021, 9, 11, 12).getTime(), amount: 400 },
            { time: new Date(2021, 9, 12, 12).getTime(), amount: 500 },
        ]
    },
    {
        targetId: "2",
        outcomeId: "2",
        title: "腹筋",
        unitName: "回",
        totalFlg: false,
        data: [
            { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10, 12).getTime(), amount: 200 },
            { time: new Date(2021, 9, 11, 12).getTime(), amount: 500 },
        ],
        dataTotal: [
            { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10, 12).getTime(), amount: 200 },
            { time: new Date(2021, 9, 11, 12).getTime(), amount: 500 },
        ]
    },
    {
        targetId: "3",
        outcomeId: "3",
        title: "腕立て伏せ",
        unitName: "回",
        totalFlg: false,
        data: [
            { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10, 12).getTime(), amount: 90 },
            { time: new Date(2021, 9, 11, 12).getTime(), amount: 110 },
        ],
        dataTotal: [
            { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
            { time: new Date(2021, 9, 10, 12).getTime(), amount: 90 },
            { time: new Date(2021, 9, 11, 12).getTime(), amount: 110 },
        ]
    },
]

//サンプルデータ経由　SampleJsonをResSampleに代入
ResSample = SampleJson.map(value => {
    return {
        targetId: value.targetId,
        outcomeId: value.outcomeId,
        title: value.title,
        unitName: value.unitName,
        totalFlg: value.totalFlg,
        data: value.data.map(row => {
            return {
                time: row.time,
                amount: row.amount
            } as GraphData;
        }),
        dataTotal: value.data.map(row => {
            return {
                time: row.time,
                amount: row.amount
            } as GraphData;
        })
    } as GraphObject
})

//API経由　APIから取得した値をResに代入
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
    });
})
.catch(err => {
    console.log('err:', err);
});

/*
 * 感情データ 
 */
type FeelingGraphObject = {
    positive: number, // 0 - 100
    negative: number, // -100 - 0
    time: string
}[]

const sampleFeelings: FeelingGraphObject = [
    {
        positive: 80,
        negative: 0,
        time: dateToTimeStr((new Date(2021, 7, 13, 7)))
    },
    {
        positive: 90,
        negative: 0,
        time: dateToTimeStr((new Date(2021, 7, 13, 9)))
    },
    {
        positive: 0,
        negative: -20,
        time: dateToTimeStr((new Date(2021, 7, 13, 11)))
    },
    {
        positive: 80,
        negative: 0,
        time: dateToTimeStr((new Date(2021, 7, 13, 13)))
    },
]


let graphList
let graphListSample

export default function Dashboard() {
    const classes = useStyles();


    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // グラフの作成 SAMPLE
    console.log(`ResSampleの中身`)
    console.log(ResSample)

    graphListSample = ResSample.map(value => {
        return (
            <Grid item xs={12} md={6} lg={12}>
                <Paper className={fixedHeightPaper}>
                    <Chart title={value.title} unitName={value.unitName} key={value.targetId} graphData={value.data} />
                </Paper>
            </Grid>
        );
    });
    console.log(`graphListSampleの型 ${typeof graphListSample}`);

    // グラフの作成 API
    console.log(`Resの中身`)
    console.log(Res)

    // 型がundefinedの時は実行しない。(APIから値が取得できない時と同じ)
    if (typeof graphList === 'undefined'){
        console.log("APIからグラフデータが取得できませんでした。")
    }else {
        graphList = Res.map(value => {
            return (
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className={fixedHeightPaper}>
                        <Chart title={value.title} unitName={value.unitName} key={value.targetId} graphData={value.data} />
                        {console.log(Res)}
                    </Paper>
                </Grid>
            );
        });
    }

    console.log(`graphListの型 ${typeof graphList}`);

    // graphList.push(
    //     <Grid item xs={12} md={6} lg={6}>
    //         <Paper className={fixedHeightPaper}>
    //             <Chart title={"a"} unitName={"b"} key={1} graphData={sampleFeelings} />
    //         </Paper>
    //     </Grid>
    // )


    return (
        <div>

            <div className={classes.root}>
                <CssBaseline />
                <main className={classes.content}>

                    {/*<div className={classes.appBarSpacer} />*/}
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/*GanttChart*/}
                            {/*<Grid item xs={12} md={12} lg={12}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        <GanttChart/>*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/* Chart */}
                            {graphListSample}
                            {graphList}
                            {/*<Grid item xs={12} md={12} lg={6}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        /!* 子に渡す値を設定 *!/*/}
                            {/*        <Chart title={nameArray[0]} graphData={allData[0]}/>*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/*<Grid item xs={12} md={6} lg={6}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        <Chart title={nameArray[1]} graphData={allData[1]}/>*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/* Recent Deposits */}
                            {/*<Grid item xs={12} md={6} lg={4}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        <Deposits />*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/*Test Add*/}
                            {/*<Grid item xs={12} md={6} lg={6}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        <Chart />*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/*/!*Test Add*!/*/}
                            {/*<Grid item xs={12} md={6} lg={6}>*/}
                            {/*    <Paper className={fixedHeightPaper}>*/}
                            {/*        <Chart />*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                            {/*/!* Recent Orders *!/*/}
                            {/*<Grid item xs={12}>*/}
                            {/*    <Paper className={classes.paper}>*/}
                            {/*        <Orders />*/}
                            {/*    </Paper>*/}
                            {/*</Grid>*/}
                        </Grid>
                        <Box pt={4}>
                            <Copyright />
                        </Box>
                    </Container>
                </main>
            </div>
        </div>
    );
}
