import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Collapse, Divider } from "@material-ui/core";
import { ArrowDropDown } from '@material-ui/icons';

import AddForm from "../lib/AddForm";
import AppDataManager from '../../../lib/app/appDataManager';
import ToDoListItem from '../lib/ToDoListItem';
import ToDoDetail from '../lib/ToDoDetail';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%'
        },
        contentLeft: {
            flex: 1,
            paddingRight: theme.spacing(2)
        },
        list: {
            height: '100%',
            overflowY: 'scroll',
            msOverflowStyle: 'none',    /* IE, Edge 対応 */
            scrollbarWidth: 'none', /* Firefox 対応 */
            "&::-webkit-scrollbar": {  /* Chrome, Safari 対応 */
                display: 'none',
            },
            paddingBottom: theme.spacing(8),
            width: '100%',
        },
        todoListItemDiv: {
            marginLeft: theme.spacing(1),
        },
        todoListDivider: {
            width: '94%',
            marginLeft: 'auto',
        },
        accordionToggleButtonDiv: {
            display: 'flex',
            width: '100%',
            "& p": {
                marginTop: 'auto',
                marginBottom: 'auto',
            },
            "& :hover": {
                cursor: 'pointer',
            },
            opacity: 0.3,
            height: theme.spacing(4),
        },
        accordionIcon: {
            marginTop: 'auto',
            marginBottom: 'auto',
            transition: 'transform 0.4s '
        },
        accordionIconRotate: {
            transform: "rotate(-90deg)",
        },
        contentRight: {
            flex: 1,
            overflow: 'auto',
            paddingLeft: theme.spacing(2)
        },
    }),
);

export default function Today() {

    const classes = useStyles();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(0)
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    const [todos, setTodos] = React.useState(appDataManager.todos)

    const [selectedToDoId, setSelectedToDoId] = React.useState<number>();

    // Collapse state
    const [noDateToDosShown, setNoDateToDosShown] = React.useState<boolean>(true);
    const [delayedToDosShown, setDelayedToDosShown] = React.useState<boolean>(true);
    const [todayPendingToDosShown, setTodayPendingToDosShown] = React.useState<boolean>(true);
    const [todayCompletedToDosShown, setTodayCompletedToDosShown] = React.useState<boolean>(true);

    return (
        <div
            className={classes.root}
        >
            {/* 左 */}
            <div
                className={classes.contentLeft}
            >
                <AddForm setTodos={setTodos} />
                {todos != undefined && (
                    <div
                        className={classes.list}
                    >
                        {/* 日時未指定のToDos */}
                        {todos.filter(value => !value.completed && value.startDatetimeScheduled == undefined).length > 0 && (
                            <Collapse in={noDateToDosShown} collapsedHeight="33px">
                                <div
                                    className={classes.accordionToggleButtonDiv}
                                    onClick={() => setNoDateToDosShown(current => !current)}
                                >
                                    <ArrowDropDown
                                        className={clsx(classes.accordionIcon, {
                                            [classes.accordionIconRotate]: !noDateToDosShown
                                        })}
                                    />
                                    <p>No date</p>
                                </div>
                                {todos.filter(value => !value.completed && value.startDatetimeScheduled == undefined).map(value => (
                                    <div
                                        className={classes.todoListItemDiv}
                                        key={value.id}
                                        onClick={() => setSelectedToDoId(value.id)}
                                    >
                                        <ToDoListItem key={value.id} todo={value} setTodos={setTodos} />
                                        <Divider
                                            className={classes.todoListDivider}
                                        />
                                    </div>
                                ))}
                            </Collapse>
                        )}
                        {/* 遅延しているToDo */}
                        {todos.filter(value => value.startDatetimeScheduled != undefined && !value.completed && (() => {
                            const date = new Date();
                            return value.startDatetimeScheduled.getFullYear() <= date.getFullYear() && value.startDatetimeScheduled.getMonth() <= date.getMonth() && value.startDatetimeScheduled.getDate() < date.getDate();
                        })()).length > 0 && (
                            <Collapse in={delayedToDosShown} collapsedHeight="33px">
                                <div
                                    className={classes.accordionToggleButtonDiv}
                                    onClick={() => setDelayedToDosShown(current => !current)}
                                >
                                    <ArrowDropDown
                                        className={clsx(classes.accordionIcon, {
                                            [classes.accordionIconRotate]: !delayedToDosShown
                                        })}
                                    />
                                    <p>Delayed</p>
                                </div>
                                {todos.filter(value => value.startDatetimeScheduled != undefined && !value.completed && (() => {
                                    const date = new Date();
                                    return value.startDatetimeScheduled.getFullYear() <= date.getFullYear() && value.startDatetimeScheduled.getMonth() <= date.getMonth() && value.startDatetimeScheduled.getDate() < date.getDate();
                                })()).map(value => (
                                    <div
                                        className={classes.todoListItemDiv}
                                        key={value.id}
                                        onClick={() => setSelectedToDoId(value.id)}
                                    >
                                        <ToDoListItem key={value.id} todo={value} setTodos={setTodos} />
                                        <Divider
                                            className={classes.todoListDivider}
                                        />
                                    </div>
                                ))}
                            </Collapse>
                        )}
                        {/* 未完了のToDos */}
                        {todos.filter(value => {
                            if (value.startDatetimeScheduled == undefined || value.completed) {
                                return false;
                            }

                            const date = new Date();
                            return value.startDatetimeScheduled.getFullYear() == date.getFullYear() && value.startDatetimeScheduled.getMonth() == date.getMonth() && value.startDatetimeScheduled.getDate() == date.getDate();

                        }).length > 0 && (
                            <Collapse in={todayPendingToDosShown} collapsedHeight="33px">
                                <div
                                    className={classes.accordionToggleButtonDiv}
                                    onClick={() => setTodayPendingToDosShown(current => !current)}
                                >
                                    <ArrowDropDown
                                        className={clsx(classes.accordionIcon, {
                                            [classes.accordionIconRotate]: !todayPendingToDosShown
                                        })}
                                    />
                                    <p>Pending</p>
                                </div>
                                {todos.filter(value => {
                                    if (value.startDatetimeScheduled == undefined || value.completed) {
                                        return false;
                                    }
                                    const date = new Date();
                                    return value.startDatetimeScheduled.getFullYear() == date.getFullYear() && value.startDatetimeScheduled.getMonth() == date.getMonth() && value.startDatetimeScheduled.getDate() == date.getDate();
                                }).sort((a,b) => {
                                    var comparison: number = 0;
                                    if (a.startDatetimeScheduled == undefined) {
                                        if (b.startDatetimeScheduled != undefined) {
                                            comparison = -1;
                                        }
                                    } else {
                                        if (b.startDatetimeScheduled == undefined) {
                                            comparison = 1;
                                        } else {
                                            a.startDatetimeScheduled < b.startDatetimeScheduled ? comparison = -1 : comparison = 1;
                                        }
                                    }
                                    return comparison;
                                }).map(value => (
                                    <div
                                        className={classes.todoListItemDiv}
                                        key={value.id}
                                        onClick={() => setSelectedToDoId(value.id)}
                                    >
                                        <ToDoListItem key={value.id} todo={value} setTodos={setTodos} />
                                        <Divider
                                            className={classes.todoListDivider}
                                        />
                                    </div>
                                ))}
                            </Collapse>
                        )}
                        {/* 完了済ToDos, 記録済リマインド */}
                        {todos.filter(value => {
                            if (value.startDatetimeScheduled == undefined || !value.completed) {
                                return false;
                            }
                            return Math.trunc(value.startDatetimeScheduled.getTime() / ( 24 * 60 * 60 * 1000)) == Math.trunc((new Date()).getTime() / ( 24 * 60 * 60 * 1000))
                        }).length > 0 && (
                            <Collapse in={todayCompletedToDosShown} collapsedHeight="33px">
                                <div
                                    className={classes.accordionToggleButtonDiv}
                                    onClick={() => setTodayCompletedToDosShown(current => !current)}
                                >
                                    <ArrowDropDown
                                        className={clsx(classes.accordionIcon, {
                                            [classes.accordionIconRotate]: !todayCompletedToDosShown
                                        })}
                                    />
                                    <p>Completed</p>
                                </div>
                                {todos.filter(value => {
                                    if (value.startDatetimeScheduled == undefined || !value.completed) {
                                        return false;
                                    }
                                    return Math.trunc(value.startDatetimeScheduled.getTime() / ( 24 * 60 * 60 * 1000)) == Math.trunc((new Date()).getTime() / ( 24 * 60 * 60 * 1000))
                                }).map(value => (
                                    <div
                                        className={classes.todoListItemDiv}
                                        key={value.id}
                                        onClick={() => setSelectedToDoId(value.id)}
                                    >
                                        <ToDoListItem key={value.id} todo={value} setTodos={setTodos} />
                                        <Divider
                                            className={classes.todoListDivider}
                                        />
                                    </div>
                                ))}
                            </Collapse>
                        )}
                    </div>
                )}
            </div>
            <Divider orientation='vertical' flexItem/>
            {/* 右 */}
            <div
                className={classes.contentRight}
            >
                {/* TODO: to-do詳細画面 */}
                {todos?.filter(value => value.id == selectedToDoId).map(value => (
                    <div key={value.id}>
                        <ToDoDetail todo={value} setTodos={setTodos} />
                    </div>
                ))}
            </div>
        </div>
    )
}