import { Chip, createStyles, Divider, Input, makeStyles, TextField, Theme } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../../lib/interface";
import { Add, SettingsBackupRestore } from "@material-ui/icons";
import { defaultFeeingTypes } from "../../../../utils/defaultFeelings";
import { FeelingType, Percentage } from "../../../../lib/interface/archive";
import { sampleFeelingTypes } from "../../../../utils/sample-data";

type Props = {
    todo?: ToDo
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        titleDiv: {
            display: 'flex',
            position: 'relative',
            "& > h1": {
                marginTop: theme.spacing(2.5),
                marginBottom: theme.spacing(2.5),
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        targetListDiv: {
            position: 'absolute',
            display: 'flex',
            right: 0,
            height: '100%',
            verticalAlign: 'middle',
            "& > .MuiChip-root": {
                margin: `auto ${theme.spacing(0.5)}px`,
            }
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
            position: 'relative',
            display: 'flex',
            justifyContent: 'unset',
            [theme.breakpoints.up('md')]: {
                justifyContent: 'center',
            },
            "& div": {
                textAlign: 'left',
                fontSize: theme.spacing(3),
                [theme.breakpoints.up('md')]: {
                    textAlign: 'center',
                },
            },
        },
        shelfBlockClearButton: {
            position: 'absolute',
            right: '0',
            height: '100%',
            opacity: '0.6'
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
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
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


    /**
     * 時間
     */

    // デフォルト値
    const defaultResultDatetime = {
        start: (() => {
            if (props.todo.startDatetimeScheduled != undefined && props.todo.timeInfoExisted) {
                return `${props.todo.startDatetimeScheduled.getFullYear()}-${`0${props.todo.startDatetimeScheduled.getMonth() + 1}`.slice(-2)}-${`0${props.todo.startDatetimeScheduled.getDate()}`.slice(-2)}T${`0${props.todo.startDatetimeScheduled.getHours()}`.slice(-2)}:${`0${props.todo.startDatetimeScheduled.getMinutes()}`.slice(-2)}`
            }
            return "";
        })(),
        end: (() => {
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
        })()
    }

    // 値
    const [resultDatetimeStart, setResultDatetimeStart] = React.useState<string>(defaultResultDatetime.start);
    const [resultDatetimeEnd, setResultDatetimeEnd] = React.useState<string>(defaultResultDatetime.end);

    // リセット処理
    const resetResultDatetime = () => {
        setResultDatetimeStart(defaultResultDatetime.start);
        setResultDatetimeEnd(defaultResultDatetime.end);
    }


    /**
     * 成果
     */

    // 成果のスキーマリスト
    const defaultResultOutcomes = (() => {
        if (props.todo.targetList != undefined) {
            // outcomeSchemeをTargetごとに展開
            return props.todo.targetList.filter(
                target => target.outcomeSchemes != undefined
            ).map(
                target => target.outcomeSchemes!
            ).reduce(
                (previous, current) => previous.concat(current)
            );
        }
        return [];
    })().map(scheme => {
        return {
            scheme: scheme,
            value: (() => {
                if (scheme.statisticsRule == 'String') {
                    return scheme.defaultValue != undefined ? scheme.defaultValue as string : "";
                }
                return scheme.defaultValue != undefined ? scheme.defaultValue as number : 0;
            })()
        }
    });

    const [resultOutcomes, setResultOutcomes] = React.useState(defaultResultOutcomes);

    // リセット処理
    const resetResultOutcomes = () => {
        setResultOutcomes(defaultResultOutcomes);
    }


    /**
     * 感情
     */

    // リスト
    const feels = defaultFeeingTypes.map(value => {
        const [selectedState, setSelectedState] = React.useState<boolean>(false);
        const [positivePercent, setPositivePercent] = React.useState<Percentage>(value.defaultPositivePercent);
        const [negativePercent, setNegativePercent] = React.useState<Percentage>(value.defaultNegativePercent);
        return {
            feel: value,
            selectedState: {
                value: selectedState,
                toggle: () => setSelectedState(current => !current),
            },
            positivePercentState: {
                value: positivePercent,
                set: setPositivePercent
            },
            NegativePercentState: {
                value: negativePercent,
                set: setNegativePercent
            }
        }
    })

    // リセット処理
    const resetFeelSelectStates = () => {
        feels.forEach(value => {
            if (value.selectedState.value) {
                value.selectedState.toggle();
            }
        })
    }


    /**
     * メモ（日記）
     */

    // 値
    const [memo, setMemo] = React.useState<string>("");

    // リセット処理
    const resetMemo = () => {
        setMemo("");
    }

    return (
        <div
            className={classes.root}
        >
            {/* タイトル（ToDo名） */}
            <div
                className={classes.titleDiv}
            >
                <h1>{props.todo.name}</h1>
                <div className={classes.targetListDiv}>
                    {props.todo.targetList?.map(target => {
                        const classChipColorClasses = (makeStyles((theme: Theme) =>
                            createStyles({
                                chipColor: {
                                    backgroundColor: `rgba(${target.themeColor.r},${target.themeColor.g},${target.themeColor.b},0.5)`
                                }
                            })
                        ))();
                        return <Chip
                            className={classChipColorClasses.chipColor}
                            key={target.id}
                            label={target.name}
                        />
                    })}
                </div>
            </div>
            {/* 成果、感情、メモ */}
            <div
                className={classes.shelfDiv}
            >
                {/* 時間、成果入力 */}
                <div>
                    <div
                        className={classes.shelfBlockTitleDiv}
                    >
                        <div>Result</div>
                        {(resultDatetimeStart != defaultResultDatetime.start || resultDatetimeEnd != defaultResultDatetime.end || resultOutcomes.some(resultOutcome => resultOutcome.value != defaultResultOutcomes.find(value => value.scheme.id == resultOutcome.scheme.id)!.value)) &&
                            <SettingsBackupRestore
                                className={classes.shelfBlockClearButton}
                                onClick={() => {
                                    resetResultDatetime();
                                    resetResultOutcomes();
                                }}
                            />
                        }
                    </div>
                    {/* 開始時間 */}
                    <TextField
                        className={classes.resultDatetimeInputDiv}
                        label="Start"
                        type="datetime-local"
                        value={resultDatetimeStart}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setResultDatetimeStart(e.target.value) }}
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
                        value={resultDatetimeEnd}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setResultDatetimeEnd(e.target.value) }}
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
                        {resultOutcomes.map(resultOutcome => {
                            const scheme = resultOutcome.scheme;
                            if (scheme.statisticsRule == 'String') {
                                return (
                                    <div
                                        className={classes.outcomeItemDiv}
                                        key={`${props.todo?.id}${scheme.id}`}
                                    >
                                        <div>
                                            {scheme.name}
                                        </div>
                                        <Input
                                            value={resultOutcome.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setResultOutcomes(current => current.map(value => {
                                                    if (scheme.id != value.scheme.id) {
                                                        return value;
                                                    }
                                                    var newValue = value;
                                                    newValue.value = e.target.value;
                                                    return newValue;
                                                }))
                                            }}
                                        />
                                    </div>
                                );
                            }
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
                                        value={resultOutcome.value}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setResultOutcomes(current => current.map(value => {
                                                if (scheme.id != value.scheme.id) {
                                                    return value;
                                                }
                                                var newValue = value;
                                                newValue.value = e.target.value;
                                                return newValue;
                                            }))
                                        }}
                                        className={clsx(classes.outcomeItemInputNumValue, classes.outcomeInput)}
                                    />
                                    <div>
                                        {scheme.unitName != undefined ? scheme.unitName : ""}
                                    </div>
                                </div>
                            );
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
                        <div>Feelings</div>
                        {feels.some(value => value.selectedState.value) && <SettingsBackupRestore className={classes.shelfBlockClearButton} onClick={resetFeelSelectStates} />}
                    </div>
                    <div
                        className={classes.feelingListDiv}
                    >
                        {feels.sort((a,b) => {
                            return ((100 - a.feel.defaultPositivePercent) + a.feel.defaultNegativePercent) > ((100 - b.feel.defaultPositivePercent) + b.feel.defaultNegativePercent) ? 1 : -1;
                        }).map(value => {
                            // RBG: (255, 255, 0) -> (0, 255, 0) -> (0, 255, 255) -> (0, 0, 255)
                            // Emotion: (100, 0) -> (0, 100)
                            var r = 255;
                            var g = 255;
                            var b = 0;
                            if ((((100 - value.feel.defaultPositivePercent) + value.feel.defaultNegativePercent) / 2) <= 33) {
                                r = Math.round(255 * (1 - ((100 - value.feel.defaultPositivePercent) + value.feel.defaultNegativePercent) / 2 / 33));
                                g = 255;
                                b = 0;
                            } else if ((((100 - value.feel.defaultPositivePercent) + value.feel.defaultNegativePercent) / 2) <= 67) {
                                r = 0;
                                g = 255;
                                b = Math.round(255 * (((((100 - value.feel.defaultPositivePercent) + value.feel.defaultNegativePercent) / 2) - 33) / 34));
                            } else {
                                r = 0;
                                g = Math.round(255 * (1 - (((((100 - value.feel.defaultPositivePercent) + value.feel.defaultNegativePercent) / 2) - 67) / 33)));
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
                                    },
                                    greyScale: {
                                        filter: 'grayscale(0.9)',
                                    }
                                })
                            ))();
                            return (
                                <div
                                    className={clsx(
                                        classes.feelingListItemDiv,
                                        emotionColorClasses.emotionColorDiv,
                                        {[emotionColorClasses.selectedEmotionItemDiv]: value.selectedState.value},
                                        {[emotionColorClasses.greyScale]: (feels.filter(value => value.selectedState.value).length == 3 && !value.selectedState.value)}
                                    )}
                                    onClick={() => {
                                        if (value.selectedState.value) {
                                            value.selectedState.toggle();
                                        } else if (feels.filter(value => value.selectedState.value).length < 3) {
                                            value.selectedState.toggle();
                                        }
                                    }}
                                >
                                    <div>{value.feel.name}</div>
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
                        <div>Memo</div>
                        {memo != "" && <SettingsBackupRestore className={classes.shelfBlockClearButton} onClick={resetMemo} />}
                    </div>
                    <TextField
                        className={classes.memoTextField}
                        value={memo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setMemo(e.target.value)}}
                        multiline
                        variant="outlined"
                    />
                </div>
            </div>
        </div>
    );
}