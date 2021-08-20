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
// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         root: {
//             display: 'flex',
//             height: '100%'
//         },
//         contentLeft: {
//             flex: 1,
//             overflow: 'auto',
//             paddingRight: theme.spacing(2)
//         },
//         contentRight: {
//             flex: 1,
//             overflow: 'auto',
//             paddingLeft: theme.spacing(2)
//         },
//     }),
// );

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

export type Patients = {
    date: string,
    data: Array<any>
};
const JsonData = {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6M30.-RmolK2yznBtDt3jnaLmIdMQEMrqSI9l57yGepBQUIg",
    "data": {
        "todoId": "6108dec3999f8d48ab580a19",
        "checkInDateTime": "2021-12-01T03:24:00",
        "targets": ["60ef8fc17540ec361fa9a3df"],
        "statistics":{
            "6108de34999f8dd93b580a17":[
                {
                    "targetId": "1",
                    "name": "testsample1",
                    "unitname": "tete",
                    "statisticsRule": "test",
                    "defaultValue": 10,
                    "value": 5,
                    "feelingText": "testtext",
                    "feelingName": "testName",
                    "positivePercent": 10,
                    "negativePercent": 5,
                    "recordingDateTime": "2021-12-01T03:24:00"
                },
                {
                    "targetId": "2",
                    "name": "testsample1",
                    "unitname": "tete2",
                    "statisticsRule": "test2",
                    "defaultValue": 10,
                    "value": 7,
                    "feelingText": "testtext2",
                    "feelingName": "testName2",
                    "positivePercent": 10,
                    "negativePercent": 5,
                    "recordingDateTime": "2021-12-01T03:24:00"
                }
            ],
            "6108de34999f8d83918f580a":[
                {
                    "targetId": "11",
                    "name": "testsample2",
                    "unitname": "tete3",
                    "statisticsRule": "test3",
                    "defaultValue": 10,
                    "value": 2,
                    "feelingText": "testtext3",
                    "feelingName": "testName3",
                    "positivePercent": 10,
                    "negativePercent": 5,
                    "recordingDateTime": "2021-12-01T03:24:00"
                },
                {
                    "targetId": "12",
                    "name": "testsample2",
                    "unitname": "tete4",
                    "statisticsRule": "test4",
                    "defaultValue": 10,
                    "value": 5,
                    "feelingText": "testtext4",
                    "feelingName": "testName4",
                    "positivePercent": 10,
                    "negativePercent": 5,
                    "recordingDateTime": "2021-12-01T03:24:00"
                }
            ]
        }
    }
}

function createData(time: Date, amount: string | number) {
    return { time, amount };
}


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

    //追加
    console.log("sampleGraph")
    var nameArray = []
    var name = ""
    var allData = []
    var data = []
    var tempData = {}
    // console.log("受けとるJson")
    // console.log(JsonData)
    // console.log("空の配列宣言")
    // console.log(data)

    //["key", "key"]
    Object.keys(JsonData.data.statistics).forEach(key =>{
        JsonData.data.statistics[key].forEach(element =>{
            //tempData["date"] = element.recordingDateTime
            // tempData["date"] = element.recordingDateTime
            // tempData["value"] = element.value
            data.push(createData(element.recordingDateTime,element.value))
            tempData = {}
            name = element.name
        })
        nameArray.push(name)
        allData.push(data)
        data = []
        name = ""
    })
    console.log(data)
    console.log(allData)

    function graph(index){
        return <Grid item xs={12} md={6} lg={6}><Paper className={fixedHeightPaper}><Chart title={nameArray[index]} graphData={allData[index]}/></Paper></Grid>
    }


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
                        {
                            graph(0)
                        }
                        {
                            graph(1)
                        }

                        {/* Chart */}
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
