import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from "react";
import { ToDo } from "../../../lib/interface";
import { Checkbox, Paper } from "@material-ui/core";

type Props = {
    todo: ToDo
}

const useStyles = makeStyles(() =>
    createStyles({
        checkbox: {
            marginTop: 'auto',
            marginBottom: 'auto',
        },
    })
);

export default function ToDoBox(props:Props){
    
    const classes = useStyles();
  
    const [checked, setChecked] = React.useState<boolean>(props.todo.completed);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return(
        <div>
            <Paper >
            <Checkbox
                className={classes.checkbox}
                checked={checked}
                onChange={handleChange}
            />
            {props.todo.name}
            {console.log(props.todo.startDatetimeScheduled?.getDay())}
             {/* ToDo名 */}
            {/* <span
                className={classes.nameSpan}
            >
                {props.todo.name}
            </span> */}
            {/* 日付情報 */}
        {/* </div> */}
        {/* {props.todo.description != undefined && props.todo.description != "" && <div>
            <div
                className={classes.descDiv}
            >
                {props.todo.description}
            </div>
            <Divider />
        </div>} */}
        {/* <div> */}
            {/* サブToDoリスト */}
        </Paper>
    </div>
    )
}