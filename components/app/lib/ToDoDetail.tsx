import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import React from "react";
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
            "& input": {
                fontSize: theme.spacing(3),
            },
        },
        descDiv: {
            margin: theme.spacing(2.4),
        }
    })
);

type Props = {
    todo: ToDo,
    setTodos: React.Dispatch<React.SetStateAction<ToDo[] | undefined>>
}

export default function ToDoDetail(props: Props) {

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
                    defaultChecked={props.todo.completed}
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
                        defaultValue={props.todo.name}
                        inputProps={{ 'aria-label': 'naked' }}
                        onChange={nameChange}
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