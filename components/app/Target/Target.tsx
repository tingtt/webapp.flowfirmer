import React from "react"
import clsx from "clsx"
import { Container, Grid, makeStyles, Paper, Theme } from "@material-ui/core"
import axios from "axios"
import GanttChart from "./Gantt"
import Chart from "../Dashboard/graph/Chart"

type Props = {
  targetId: string
}

type GraphData = { time: number; amount: number }
type GraphObject = {
  targetId: string
  outcomeId: string
  title: string
  unitName: string
  totalFlg: boolean
  data: GraphData[]
  dataTotal: GraphData[]
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}))

const dateToTimeStr = (date: Date) => {
  return date.getTime()
}

let graphObjects: GraphObject[] = []

export default function Target(props: Props) {
  axios
    .post("https://flowfirmer.tingtt.jp" + "/api/getOutcomeArchiveByTargetId", {
      targetId: props.targetId,
    })
    .then((res) => {
      // statusのチェック
      if (res.data.status == 200) {
        // dataをグラフ用のオブジェクトに変換
        graphObjects = (res.data.data as GraphObject[]).map((outcome) => {
          // 通常グラフのデータを整形
          outcome.data = outcome.data.map((data) => {
            // 日時情報をグラフで扱える形式に変換
            const timeNum = dateToTimeStr(new Date(data.time))
            return {
              time: timeNum,
              amount: data.amount,
            }
          })
          // 加算グラフのデータを整形
          outcome.dataTotal = outcome.dataTotal.map((data) => {
            // 日時情報をグラフで扱える形式に変換
            const timeNum = dateToTimeStr(new Date(data.time))
            return {
              time: timeNum,
              amount: data.amount,
            }
          })
          return outcome
        })
      } else {
        console.log(`err: Failed to fetch OutcomeArchive. ${res.data.message}`)
      }
    })
    .catch((err) => {
      console.log("err:", err)
    })

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <GanttChart targetId={props.targetId} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {graphObjects.map((value) => {
            return (
              <Grid item xs={12} md={6} lg={6}>
                <Paper className={clsx(classes.paper, classes.fixedHeight)}>
                  <Chart
                    title={value.title}
                    unitName={value.unitName}
                    key={value.targetId}
                    graphData={value.data}
                  />
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </div>
  )
}
