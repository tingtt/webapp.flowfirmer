import React from "react"
import { useTheme } from "@material-ui/core/styles"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
} from "recharts"
import Title from "./Title"

export default function Chart(props: any) {
    const theme = useTheme()

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
                    <XAxis
                        dataKey="time"
                        stroke={theme.palette.text.secondary}
                        domain={["dataMin", "dataMax"]}
                        // tickFormatter={(unixTime) => new Date(unixTime).toLocaleString()}
                        tickFormatter={(unixTime) =>
                            new Date(unixTime).toLocaleString()
                        }
                        type="number"
                        // type='string'
                    />
                    <YAxis
                        // dataKey="amount"
                        stroke={theme.palette.text.secondary}
                        type="number"
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: "middle",
                                fill: theme.palette.text.primary,
                            }}
                        >
                            {props.unitName == undefined ? "" : props.unitName}
                        </Label>
                    </YAxis>
                    <Tooltip
                        // wrapperStyle={{ backgroundColor: "red" }}
                        // labelStyle={{ color: "green" }}
                        // itemStyle={{ color: "cyan" }}

                        // mountに単位(unitName)を付加
                        formatter={function (value: any, _: any) {
                            return `${value} ${
                                props.unitName == undefined
                                    ? ""
                                    : props.unitName
                            }`
                        }}
                        // 日付を読みやすい形に変更
                        labelFormatter={function (value) {
                            // return `label: ${value}`;
                            return new Date(value).toLocaleDateString()
                        }}
                    />
                    {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    )
}
