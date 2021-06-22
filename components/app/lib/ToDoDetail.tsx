import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import React from "react";
import { ToDo } from "../../../lib/interface";
import { Checkbox, Divider } from "@material-ui/core";

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
        },
        descDiv: {
            margin: theme.spacing(2.4),
        }
    })
);

type Props = {
    todo: ToDo
}

export default function ToDoDetail(props: Props) {

    const classes = useStyles();

    const [checked, setChecked] = React.useState<boolean>(props.todo.completed);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <div>
            <div
                className={classes.titleDiv}
            >
                <Checkbox
                    className={classes.checkbox}
                    checked={checked}
                    onChange={handleChange}
                />
                <Divider orientation='vertical' flexItem />
                {/* ToDo名 */}
                <span
                    className={classes.nameSpan}
                >
                    {props.todo.name}
                </span>
                {/* 日付情報 */}
            </div>
            <Divider />
            {props.todo.description != undefined && props.todo.description != "" && <div>
                <div
                    className={classes.descDiv}
                >
                    {props.todo.description}
                </div>
                <Divider />
            </div>}
            <div>
                {/* サブToDoリスト */}
            </div>
        </div>
    );
}