import GanttChart from "../Target/Gantt";
import React from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './graph/listItems';
import Chart from './graph/Chart';
import Deposits from './graph/Deposits';
import Orders from './graph/Orders';
import {element, func, number} from "prop-types";
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

type GraphData = { time: string, amount: string }
type GraphObject = {
    targetId: string,
    outcomeId: string,
    title: string,
    unitName: string,
    totalFlg: boolean,
    data: GraphData[],
    dataTotal: GraphData[],
}
let Res: GraphObject[];
axios.post('/api/getOutcomeArchiveByUserId')
    .then( (res) => {
        Res = (res.data as GraphObject[]).map(outcome => {
            outcome.data = outcome.data.map(data => {
                const timeStr = new Date(data.time).toString()
                return {
                    time: timeStr,
                    amount: data.amount
                }
            })
            outcome.dataTotal = outcome.dataTotal.map(data => {
                const timeStr = new Date(data.time).toString()
                return {
                    time: timeStr,
                    amount: data.amount
                }
            })
            return outcome;
        })
    })
const Res2 = [
    {
        targetId: 1,
        outcomeId: 1,
        title: "スクワット",
        unitName: "回",
        totalFlg: false,
        data: [
            { time: new Date(2021, 9, 9, 12), amount: 100 },
            { time: new Date(2021, 9, 10, 12), amount: 200 },
            { time: new Date(2021, 9, 11, 12), amount: 150 },
        ],
        dataTotal: [
            { time: new Date(2021, 9, 9, 12), amount: 100 },
            { time: new Date(2021, 9, 10, 12), amount: 300 },
            { time: new Date(2021, 9, 11, 12), amount: 450 },
        ]
    },
    {
        targetId: 2,
        outcomeId: 2,
        title: "腹筋",
        unitName: "回",
        totalFlg: false,
        data: [
            { time: new Date(2021, 9, 9, 12), amount: 100 },
            { time: new Date(2021, 9, 10, 12), amount: 200 },
            { time: new Date(2021, 9, 11, 12), amount: 500 },
        ],
        dataTotal: [
            { time: new Date(2021, 9, 9, 12), amount: 100 },
            { time: new Date(2021, 9, 10, 12), amount: 200 },
            { time: new Date(2021, 9, 11, 12), amount: 500 },
        ]
    },
]


export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    let graphList: {} | null | undefined = [];
    //大幅変更後
    //Res => Backend, Res2 => testData
    Res2.forEach(key =>{
        console.log("title" + key.title);
        console.log("targetId" + key.targetId);
        console.log("data" + key.data);
        graphList.push(
            <Grid item xs={12} md={6} lg={6}>
                <Paper className={fixedHeightPaper}>
                    <Chart title={key.title} unitName={key.unitName} graphData={key.data} />
                </Paper>
            </Grid>
        )
    });


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
