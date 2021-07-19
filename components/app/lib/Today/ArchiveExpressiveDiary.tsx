import { createStyles, Divider, Input, makeStyles, TextField, Theme } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../../lib/interface";
import { Add } from "@material-ui/icons";
import { defaultFeeingTypes } from "../../../../utils/defaultFeelings";

type Props = {
    todo?: ToDo
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        titleDiv: {
            "& > h1": {
                textAlign: 'center',
            },
        },
        shelfDiv: {
            overflowY: 'auto',
            maxHeight: "80%",
            height: theme.spacing(56),
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'row',
                overflowY: 'unset'
            },
            "& > div": {
                marginLeft: theme.spacing(3),
                marginRight: theme.spacing(3),
                flex: "1",
                minHeight: theme.spacing(40),
            },
            "& > hr": {
                height: '1px',
                width: '98%',
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(3),
                [theme.breakpoints.up('md')]: {
                    height: 'unset',
                    width: '1px',
                    marginTop: 'unset'
                },
            },
        },
        shelfBlockTitleDiv: {
            textAlign: 'left',
            fontSize: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
                textAlign: 'center',
            }
        },
        resultDatetimeInputDiv: {
            marginTop: theme.spacing(3),
            width: '100%'
        },
        outcomeListDiv: {
            marginTop: theme.spacing(4),
        },
        outcomeItemDiv: {
            marginTop: theme.spacing(3),
            display: 'flex',
            "& > div": {
                marginTop: 'auto',
                marginBottom: 'auto',
            }
        },
        outcomeInput: {
            marginLeft: 'auto',
        },
        outcomeItemInputNumValue: {
            width: `${theme.spacing(8)}px`,
            "& > input": {
                textAlign: 'end',
            }
        },
        addOutcomeSchemeDiv: {
            justifyContent: 'center',
        },
        addOutcomeSchemeButtonDiv: {
            width: "100%",
            border: `${theme.spacing(0.3)}px solid ${theme.palette.grey.A200}`,
            borderRadius: `${theme.spacing(1)}px`,
            textAlign: 'center',
            "& > svg": {
                color: theme.palette.grey.A200,
                verticalAlign: 'middle',
                transition: '0.2s',
            },
            transition: '0.2s',
            "&:hover": {
                borderColor: theme.palette.grey.A400,
                "& > svg": {
                    color: theme.palette.grey.A400,
                },
            }
        },
        feelingListDiv: {
            display: "flex",
            flexWrap: 'wrap',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
                maxHeight: theme.spacing(52),
                overflowY: "auto",
            },
        },
        feelingListItemDiv: {
            display: 'flex',
            flexDirection: 'column',
            width: theme.spacing(8),
            height: theme.spacing(8),
            borderRadius: '50%',
            margin: theme.spacing(1.5),
            "& > div": {
                margin: 'auto',
                whiteSpace: "nowrap",
            }
        },
        memoTextField: {
            marginTop: theme.spacing(3),
            width: '95%',
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 'auto',
            height: '80%',
            "& > div": {
                height: "100%",
                minHeight: theme.spacing(32),
                "& > textarea": {
                    marginBottom: 'auto',
                },
            },
        }
    })
);

export default function ArchiveExpressiveDiary(props: Props) {

    if (props.todo == undefined) {
        return <div></div>;
    }

    const classes = useStyles();

    return (
        <div
            className={classes.root}
        >
            {/* タイトル（ToDo名） */}
            <div
                className={classes.titleDiv}
            >
                <h1>{props.todo.name}</h1>
            </div>
            <div
                className={classes.shelfDiv}
            >
                {/* 時間、成果入力 */}
                <div>
                    <div
                        className={classes.shelfBlockTitleDiv}
                    >
                        Result
                    </div>
                    {/* 開始時間 */}
                    <TextField
                        className={classes.resultDatetimeInputDiv}
                        label="Start"
                        type="datetime-local"
                        defaultValue={props.todo.startDatetimeScheduled != undefined && props.todo.timeInfoExisted ? `${props.todo.startDatetimeScheduled.getFullYear()}-${`0${props.todo.startDatetimeScheduled.getMonth() + 1}`.slice(-2)}-${`0${props.todo.startDatetimeScheduled.getDate()}`.slice(-2)}T${`0${props.todo.startDatetimeScheduled.getHours()}`.slice(-2)}:${`0${props.todo.startDatetimeScheduled.getMinutes()}`.slice(-2)}` : ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    {/* 終了時間 */}
                    <TextField
                        className={classes.resultDatetimeInputDiv}
                        label="End"
                        type="datetime-local"
                        defaultValue={(() => {
                            if (props.todo.startDatetimeScheduled != undefined && props.todo.timeInfoExisted && props.todo.processingTimeScheduled != undefined) {
                                // 開始日時に実行時間を加算
                                if (props.todo.startDatetimeScheduled.getMinutes() + props.todo.processingTimeScheduled >= 60) {
                                    const endDatetime = new Date(props.todo.startDatetimeScheduled.getTime() + (props.todo.processingTimeScheduled * 60 * 1000));
                                    return `${endDatetime.getFullYear()}-${`0${endDatetime.getMonth() + 1}`.slice(-2)}-${`0${endDatetime.getDate()}`.slice(-2)}T${`0${endDatetime.getHours()}`.slice(-2)}:${`0${endDatetime.getMinutes() + props.todo.processingTimeScheduled}`.slice(-2)}`;
                                } else {
                                    return `${props.todo.startDatetimeScheduled.getFullYear()}-${`0${props.todo.startDatetimeScheduled.getMonth() + 1}`.slice(-2)}-${`0${props.todo.startDatetimeScheduled.getDate()}`.slice(-2)}T${`0${props.todo.startDatetimeScheduled.getHours()}`.slice(-2)}:${`0${props.todo.startDatetimeScheduled.getMinutes() + props.todo.processingTimeScheduled}`.slice(-2)}`;
                                }
                            }
                            return "";
                        })()}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    {/* 成果 */}
                    <div
                        className={classes.outcomeListDiv}
                    >
                        {props.todo.targetList != undefined && props.todo.targetList.filter(value => value.outcomeSchemes != undefined).map(target => {
                            if (target.outcomeSchemes == undefined) {
                                return;
                            }
                            return target.outcomeSchemes.map(scheme => {
                                if (scheme.statisticsRule == 'String') {
                                    return (
                                        <div
                                            className={classes.outcomeItemDiv}
                                            key={`${props.todo?.id}${scheme.id}`}
                                        >
                                            <div>
                                                {scheme.name}
                                            </div>
                                            <Input defaultValue={scheme.defaultValue} />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            className={classes.outcomeItemDiv}
                                            key={`${props.todo?.id}${scheme.id}`}
                                        >
                                            <div>
                                                {scheme.name}
                                            </div>
                                            <Input
                                                type="number"
                                                defaultValue={scheme.defaultValue}
                                                className={clsx(classes.outcomeItemInputNumValue, classes.outcomeInput)}
                                            />
                                            <div>
                                                {scheme.unitName != undefined ? scheme.unitName : ""}
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        })}
                        <div
                            className={clsx(classes.outcomeItemDiv, classes.addOutcomeSchemeDiv)}
                        >
                            <div
                                className={classes.addOutcomeSchemeButtonDiv}
                            >
                                <Add />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider orientation='vertical' flexItem/>
                {/* 感情選択 */}
                <div>
                    <div
                        className={classes.shelfBlockTitleDiv}
                    >
                        Feelings
                    </div>
                    <div
                        className={classes.feelingListDiv}
                    >
                        {defaultFeeingTypes.sort((a,b) => {
                            return ((100 - a.defaultPositivePercent) + a.defaultNegativePercent) > ((100 - b.defaultPositivePercent) + b.defaultNegativePercent) ? 1 : -1;
                        }).map(value => {
                            // RBG: (255, 255, 0) -> (0, 255, 0) -> (0, 255, 255) -> (0, 0, 255)
                            // Emotion: (100, 0) -> (0, 100)
                            var r = 255;
                            var g = 255;
                            var b = 0;
                            if ((((100 - value.defaultPositivePercent) + value.defaultNegativePercent) / 2) <= 33) {
                                r = Math.round(255 * (1 - ((100 - value.defaultPositivePercent) + value.defaultNegativePercent) / 2 / 33));
                                g = 255;
                                b = 0;
                            } else if ((((100 - value.defaultPositivePercent) + value.defaultNegativePercent) / 2) <= 67) {
                                r = 0;
                                g = 255;
                                b = Math.round(255 * (((((100 - value.defaultPositivePercent) + value.defaultNegativePercent) / 2) - 33) / 34));
                            } else {
                                r = 0;
                                g = Math.round(255 * (1 - (((((100 - value.defaultPositivePercent) + value.defaultNegativePercent) / 2) - 67) / 33)));
                                b = 255;
                            }
                            // styleを生成
                            const emotionColorClasses = (makeStyles((theme: Theme) =>
                                createStyles({
                                    emotionColorDiv: {
                                        backgroundColor: `rgba(${r},${g},${b},0.8)`,
                                    },
                                    selectedEmotionItemDiv: {
                                        "&:before, &:after": {
                                            content: '""',
                                            width: theme.spacing(2),
                                            height: theme.spacing(3),
                                            position: "relative",
                                            display: "inline-block",
                                        },
                                        "&:before": {
                                            borderLeft: "solid 1px #5767bf",
                                            borderTop: "solid 1px #5767bf",
                                        },
                                        "&:after": {
                                            borderRight: "solid 1px #5767bf",
                                            borderBottom: "solid 1px #5767bf",
                                            marginTop: 'auto',
                                            marginLeft: 'auto'
                                        }
                                    }
                                })
                            ))();
                            return (
                                <div
                                    className={clsx(classes.feelingListItemDiv, emotionColorClasses.emotionColorDiv, {[emotionColorClasses.selectedEmotionItemDiv]: true})}
                                >
                                    <div>{value.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Divider orientation='vertical' flexItem/>
                {/* メモ（日記） */}
                <div>
                    <div
                        className={classes.shelfBlockTitleDiv}
                    >
                        Memo
                    </div>
                    <TextField
                        className={classes.memoTextField}
                        multiline
                        // rows={10}
                        variant="outlined"
                    />
                </div>
            </div>
        </div>
    );
}