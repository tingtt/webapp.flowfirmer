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
import ChartFeeling from './graph/ChartFeeling';
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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%'
    },
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
    targetId: string,
    outcomeId: string,
    title: string,
    unitName: string,
    totalFlg: boolean,
    data: GraphData[],
    dataTotal: GraphData[],
}

/**
 * 成果データ
 */

let outcomes: GraphObject[] = [];

// call api.
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
    outcomes = (res.data.data as GraphObject[]).map(outcome => {
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
    time: number
}[]

// { time: new Date(2021, 9, 9, 12).getTime(), amount: 100 },
const sampleFeelings: FeelingGraphObject = [
    {
        positive: 80,
        negative: 0,
        time: new Date(2021, 7, 13, 7).getTime()
    },
    {
        positive: 90,
        negative: 0,
        time: new Date(2021, 7, 13, 9).getTime()
    },
    {
        positive: 0,
        negative: -20,
        time: new Date(2021, 7, 13, 11).getTime()
    },
    {
        positive: 80,
        negative: 0,
        time: new Date(2021, 7, 13, 13).getTime()
    },
]

// TODO: 感情データ取得

export default function Dashboard() {
    const classes = useStyles();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <div>

            <div className={classes.root}>
                <CssBaseline />
                <main className={classes.content}>

                    {/*<div className={classes.appBarSpacer} />*/}
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* 成果グラフ */}
                            {outcomes.map(value => {
                                return (
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaper}>
                                            <Chart title={value.title} unitName={value.unitName} key={value.targetId} graphData={value.data} />
                                        </Paper>
                                    </Grid>
                                );
                            })}
                            {/* 感情グラフ */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    <ChartFeeling graphData={sampleFeelings} />
                                </Paper>
                            </Grid>
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
