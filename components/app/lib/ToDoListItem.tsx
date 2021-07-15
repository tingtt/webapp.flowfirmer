import { createStyles, Theme, makeStyles, Checkbox, InputBase, Chip } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../lib/interface";
import { Create, Loop } from "@material-ui/icons";
import AppDataManager from "../../../lib/app/appDataManager";

type Props = {
    todo: ToDo,
    setTodos: React.Dispatch<React.SetStateAction<ToDo[] | undefined>>
    selectedToDoIdSetter: React.Dispatch<React.SetStateAction<number | undefined>>
    snackbarStateSetter: React.Dispatch<React.SetStateAction<{open: boolean, msg: string, type?: 'todoCompleted' | 'todoDeleted'}>>
    showDate?: boolean
    exDiaryDialogStateSetter: React.Dispatch<React.SetStateAction<ToDo | undefined>>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: theme.spacing(8),
            width: '100%'
        },
        rootHeightLong: {
            height: theme.spacing(10),
        },
        infoDiv: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        colorRed: {
            color: theme.palette.error.main
        },
        infoTopHalf: {
            flex: 2,
            display: 'flex',
            width: '100%',
        },
        infoBottomHalf: {
            flex: 1,
            display: 'flex',
            width: '100%',
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
        todoNameDiv: {
            flex: 4,
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.spacing(2.4),
            whiteSpace: 'nowrap',
            width: '100%',
            overflowX: 'scroll',
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
            },
        },
        todoDescriptionDiv: {
            flex: 0.5,
            display: 'flex',
            fontSize: theme.spacing(1.5),
            whiteSpace: 'nowrap',
            width: '100%',
            overflowX: 'scroll',
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
            width: '100%',
            overflowX: 'scroll',
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
            '&:hover': {
                cursor: 'pointer',
            },
        },
        detailInfoSpan: {
            marginLeft: theme.spacing(1),
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        loopIcon: {
            color: theme.palette.grey.A200
        },
        termSpan: {
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
            whiteSpace: 'nowrap',
        },
        eDiaryIcon: {
            height: '100%',
            width: theme.spacing(5),
            color: theme.palette.grey.A100,
            '&:hover': {
                cursor: 'pointer',
                color: theme.palette.grey[600]
            },
        },
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

    const selectTodo = () => {
        // 詳細表示コンポーネントに表示するToDoを更新
        props.selectedToDoIdSetter(props.todo.id);
    }

    const completionStateChange = () => {
        // SnackBarを表示
        props.snackbarStateSetter({open: true, msg: `${props.todo.name} completed.`, type: 'todoCompleted'});
        // 完了状態を更新
        appDataManager.toggleTodoCompletionState(props.todo.id);
        // APIを叩いて値を更新し、stateも更新
        props.setTodos(appDataManager.todos);
    };

    const nameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // to-do名を更新
        props.todo.name = event.target.value;
        // APIを叩いて値を更新し、stateも更新
        props.setTodos(appDataManager.updateTodo(props.todo));
    };

    const deleteTodo = () => {
        // SnackBarを表示
        props.snackbarStateSetter({open: true, msg: "ToDo deleted.", type: 'todoDeleted'});
        // 削除
        appDataManager.deleteTodo(props.todo.id);
        // Stateを更新
        props.setTodos(appDataManager.todos);
    }

    return (
        <div
            className={clsx(classes.root, {
                [classes.rootHeightLong]: props.todo.description != undefined && props.todo.description != ""
            })}
        >
            {/* checkbox */}
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
                    onClick={selectTodo}
                ></div>
            </div>
            {/* info */}
            <div
                className={classes.infoDiv}
                onClick={selectTodo}
            >
                {/* top half */}
                <div
                    className={classes.infoTopHalf}
                >
                    {/* name */}
                    <div
                        className={classes.todoNameDiv}
                    >
                        <InputBase
                            type="text"
                            name="todoName"
                            value={props.todo.name}
                            inputProps={{ 'aria-label': 'naked' }}
                            onChange={nameChange}
                            onKeyDown={e => {
                                if ((e.target as HTMLInputElement).value == "" && e.key == 'Backspace') {
                                    // 値が空文字のときにBackspaceキーが押さたときにToDoを削除
                                    deleteTodo();
                                }
                            }}
                            className={clsx({
                                [classes.colorRed]: props.todo.startDatetimeScheduled != undefined && props.todo.startDatetimeScheduled.getFullYear() <= (new Date()).getFullYear() && props.todo.startDatetimeScheduled.getMonth() <= (new Date()).getMonth() && props.todo.startDatetimeScheduled.getDate() < (new Date()).getDate()
                            })}
                            autoComplete="off"
                        />
                    </div>
                    {/* time info */}
                    <div
                        className={clsx(
                            classes.detailInfoDiv,
                            {
                                [classes.colorRed]: props.todo.startDatetimeScheduled != undefined && props.todo.startDatetimeScheduled.getFullYear() <= (new Date()).getFullYear() && props.todo.startDatetimeScheduled.getMonth() <= (new Date()).getMonth() && props.todo.startDatetimeScheduled.getDate() < (new Date()).getDate()
                            },
                        )}
                    >
                        {/* 日付表示 */}
                        {props.showDate && props.todo.startDatetimeScheduled != undefined && (
                            <span className={classes.detailInfoSpan}>
                                {props.todo.startDatetimeScheduled.getMonth()}/{props.todo.startDatetimeScheduled.getDate()}
                            </span>
                        )}
                        {/* 実行時間によって表示を切り替え（1時間以上かどうか） */}
                        {props.todo.processingTimeScheduled != undefined ? props.todo.processingTimeScheduled >= 60 ?
                            <span className={classes.detailInfoSpan}>{Math.trunc(props.todo.processingTimeScheduled / 60)}h{props.todo.processingTimeScheduled % 60}min</span>
                            :
                            <span className={classes.detailInfoSpan}>{props.todo.processingTimeScheduled}min</span>
                            :
                            undefined
                        }
                        {props.todo.startDatetimeScheduled != undefined && props.todo.timeInfoExisted && <span className={classes.detailInfoSpan}>{props.todo.startDatetimeScheduled.getHours() + ":" + ('0' + props.todo.startDatetimeScheduled.getMinutes()).slice(-2)}</span>}
                    </div>
                </div>
                {/* bottom half */}
                <div
                    className={clsx(classes.infoBottomHalf, {
                        [classes.infoBottomHalfLongHeight]: props.todo.description != undefined && props.todo.description != ""
                    })}
                >
                    <div>
                        {/* Description */}
                        {props.todo.description != undefined && props.todo.description != "" &&
                            <div
                                className={classes.todoDescriptionDiv}
                            >
                                <span>{props.todo.description}</span>
                            </div>
                        }

                        {/* TargetList */}
                        <div
                            className={classes.todoTargetList}
                        >
                            {props.todo.targetList != undefined && props.todo.targetList.map(value => {
                                const inScopeClasses = makeStyles((theme: Theme) =>
                                    createStyles({
                                        targetChip: {
                                            backgroundColor: `rgba(${value.themeColor.r},${value.themeColor.g},${value.themeColor.b},0.5)`,
                                            height: theme.spacing(2),
                                            marginRight: theme.spacing(0.8)
                                        },
                                    })
                                )();
                                return (
                                    <Chip
                                        key={value.id}
                                        className={inScopeClasses.targetChip}
                                        label={value.name}
                                    />
                                )
                            })}
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
                                return (
                                    <span className={clsx(classes.detailInfoSpan, classes.loopIcon)}>
                                        <Loop/>
                                    </span>
                                );
                            }
                        })()}
                    </div>
                </div>
            </div>
            {/* expressive diary */}
            {props.todo.completed && <div
                onClick={() => {
                    // 成果、感情日記をつける画面を開く
                }}
            >
                <Create
                    className={classes.eDiaryIcon}
                    onClick={() => props.exDiaryDialogStateSetter(props.todo)}
                />
            </div>}
        </div>
    );
}