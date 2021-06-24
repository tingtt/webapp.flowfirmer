import { createStyles, Theme, makeStyles, Checkbox, Chip, InputBase } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../lib/interface";
import { Loop } from "@material-ui/icons";
import AppDataManager from "../../../lib/app/appDataManager";

type Props = {
    todo: ToDo,
    setTodos: React.Dispatch<React.SetStateAction<ToDo[] | undefined>>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: theme.spacing(8),
        },
        rootHeightLong: {
            height: theme.spacing(10),
        },
        infoDiv: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        infoTopHalf: {
            flex: 2,
            display: 'flex',
        },
        infoBottomHalf: {
            flex: 1,
            display: 'flex',
        },
        infoBottomHalfLongHeight: {
            flex: 2,
        },
        checkBox: {
            height: theme.spacing(5),
            width: theme.spacing(5),
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        todoNameSpan: {
            flex: 4,
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.spacing(2.4),
            whiteSpace: 'nowrap',
            overflow: 'auto',
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
            },
        },
        todoDescriptionSpan: {
            flex: 0.5,
            display: 'flex',
            fontSize: theme.spacing(1.5),
            whiteSpace: 'nowrap',
            overflow: 'auto',
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
            },
        },
        todoTargetList: {
            flex: 1,
            display: 'flex',
            whiteSpace: 'nowrap',
            overflow: 'auto',
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
            },
        },
        detailInfoDiv: {
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
        },
        detailInfoSpan: {
            marginLeft: theme.spacing(1),
        },
        termSpan: {
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
            whiteSpace: 'nowrap',
        },
        sampleOverflow: {
            overflow: 'auto',
        }
    }),
);

export default function ToDoListItem(props: Props) {

    const classes = useStyles();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(0)
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    const completionStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // to-do名を更新
        props.todo.completed = event.target.checked;
        // APIを叩いて値を更新し、stateも更新
        props.setTodos(appDataManager.updateTodo(props.todo));
    };

    const nameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // to-do名を更新
        props.todo.name = event.target.value;
        // APIを叩いて値を更新し、stateも更新
        props.setTodos(appDataManager.updateTodo(props.todo));
    };

    console.log(props.todo);
    return (
        <div
            className={clsx(classes.root, {
                [classes.rootHeightLong]: props.todo.description != undefined && props.todo.description != ""
            })}
        >

            <div>
                <div
                    className={classes.infoTopHalf}
                >
                    <Checkbox
                        className={classes.checkBox}
                        defaultChecked={props.todo.completed}
                        onChange={completionStateChange}
                    />
                </div>
                <div
                    className={clsx(classes.infoBottomHalf, {
                        [classes.infoBottomHalfLongHeight]: props.todo.description != undefined && props.todo.description != ""
                    })}
                ></div>
            </div>
            <div
                className={classes.infoDiv}
            >
                <div
                    className={classes.infoTopHalf}
                >
                    <div
                        className={classes.todoNameSpan}
                    >
                        <InputBase
                            type="text"
                            name="todoName"
                            defaultValue={props.todo.name}
                            inputProps={{ 'aria-label': 'naked' }}
                            onChange={nameChange}
                        />
                    </div>
                    <div
                        className={classes.detailInfoDiv}
                    >
                        {/* 実行時間によって表示を切り替え（1時間以上かどうか） */}
                        {props.todo.processingTimeScheduled != undefined && props.todo.processingTimeScheduled >= 60 ?
                            <span className={classes.detailInfoSpan}>{Math.trunc(props.todo.processingTimeScheduled / 60)}h{props.todo.processingTimeScheduled % 60}min</span>
                            :
                            <span className={classes.detailInfoSpan}>{props.todo.processingTimeScheduled}min</span>
                        }
                        <span className={classes.detailInfoSpan}>{props.todo.startDatetimeScheduled != undefined ? props.todo.startDatetimeScheduled.getHours() + ":" + ('0' + props.todo.startDatetimeScheduled.getMinutes()).slice(-2) : ""}</span>
                    </div>
                </div>
                <div
                    className={clsx(classes.infoBottomHalf, {
                        [classes.infoBottomHalfLongHeight]: props.todo.description != undefined && props.todo.description != ""
                    })}
                >
                    <div
                        className={classes.sampleOverflow}
                    >
                        {/* Description */}
                        {props.todo.description != undefined && props.todo.description != "" &&
                            <div
                                className={classes.todoDescriptionSpan}
                            >
                                <span>{props.todo.description}</span>
                            </div>
                        }

                        {/* TargetList */}
                        <div
                            className={classes.todoTargetList}
                        >
                            <span>
                                {props.todo.targetList?.map(value => (
                                    // <Chip
                                    //     label={"#" + value.name}
                                    // />
                                    <span>#{value.name}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                    <div
                        className={classes.detailInfoDiv}
                    >
                        {(() => {
                            if (props.todo.term != undefined) {
                                return <span className={clsx(classes.detailInfoSpan, classes.termSpan)}>{props.todo.term.name}</span>
                            }
                        })()}
                        {(() => {
                            if (props.todo.repeatPattern != undefined) {
                                return <span className={classes.detailInfoSpan}><Loop /></span>
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
