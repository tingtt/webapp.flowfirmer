import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../lib/interface";
import { Checkbox, Divider, InputBase } from "@material-ui/core";
import AppDataManager from '../../../lib/app/appDataManager';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        titleDiv: {
            display: 'flex',
            alignItems: 'center',
        },
        checkbox: {
            height: theme.spacing(6),
            width: theme.spacing(6),
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        nameSpan: {
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.spacing(3),
            width: '100%',
            "& .MuiInputBase-root": {
                width: '100%',
            },
            "& input": {
                fontSize: theme.spacing(3),
            },
        },
        descDiv: {
            margin: theme.spacing(2.4),
            "& .MuiInputBase-root": {
                width: "100%",
            },
        },
        colorRed: {
            color: theme.palette.error.main
        },
    })
);

type Props = {
    todo: ToDo,
    setTodos: React.Dispatch<React.SetStateAction<ToDo[] | undefined>>
    snackbarStateSetter: React.Dispatch<React.SetStateAction<{open: boolean, msg: string, type?: 'todoCompleted' | 'todoDeleted'}>>
}

export default function ToDoDetail(props: Props) {

    const classes = useStyles();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance();
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

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

    const descChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // to-doのdescriptionを更新
        props.todo.description = event.target.value;
        // APIを叩いて値を更新し、stateも更新
        props.setTodos(appDataManager.updateTodo(props.todo));
    };

    return (
        <div>
            <div
                className={classes.titleDiv}
            >
                <Checkbox
                    className={classes.checkbox}
                    checked={props.todo.completed}
                    onChange={completionStateChange}
                />
                <Divider orientation='vertical' flexItem />
                {/* ToDo名 */}
                <span
                    className={classes.nameSpan}
                >
                    <InputBase
                        type="text"
                        name="todoName"
                        value={props.todo.name}
                        inputProps={{ 'aria-label': 'naked' }}
                        onChange={nameChange}
                        className={clsx({[classes.colorRed] : props.todo.startDatetimeScheduled != undefined && ((props.todo.startDatetimeScheduled.getFullYear() * 100 + props.todo.startDatetimeScheduled.getMonth()) * 100 + props.todo.startDatetimeScheduled.getDate() < ((new Date()).getFullYear() * 100 + (new Date()).getMonth()) * 100 + (new Date()).getDate())})}
                        autoComplete="off"
                    />
                </span>
                {/* 日付情報 */}
            </div>
            <Divider />
            <div>
                <div
                    className={classes.descDiv}
                >
                    <InputBase
                        type="text"
                        name="todoDesc"
                        defaultValue={props.todo.description}
                        inputProps={{ 'aria-label': 'naked' }}
                        onChange={descChange}
                        autoComplete="off"
                    />
                </div>
                <Divider />
            </div>
            <div>
                {/* サブToDoリスト */}
            </div>
        </div>
    );
}