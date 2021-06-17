import { createStyles, Theme, makeStyles, Checkbox } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { ToDo } from "../../../lib/interface";
import { Loop } from "@material-ui/icons";

type Props = {
    todo: ToDo
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            height: theme.spacing(8),
        },
        rootHeightLong: {
            height: theme.spacing(10),
        },
        checkBox: {
            height: theme.spacing(5),
            width: theme.spacing(5)
        },
        mainInfoSpan: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            height: '100%',
            whiteSpace: 'nowrap',
            overflow: 'auto',
        },
        todoNameSpan: {
            flex: 4,
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.spacing(2.4),
        },
        todoDescriptionSpan: {
            flex: 0.5,
            fontSize: theme.spacing(1.5),
        },
        todoTargetList: {
            flex: 1,
        },
        detailInfoDiv: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            marginLeft: 'auto',
            height: '100%',
            whiteSpace: 'nowrap'
        },
        detailInfoTopHalf: {
            flex: 1,
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
        },
        detailInfoBottomHalf: {
            flex: 1,
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center'
        },
        detailInfoSpan: {
            marginLeft: theme.spacing(1),
        },
        termSpan: {
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
        }
    }),
);

export default function ToDoListItem(props: Props) {

    const classes = useStyles();

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    console.log(props.todo);
    return (
        <div
            className={clsx(classes.root, {
                [classes.rootHeightLong]: props.todo.description != undefined && props.todo.description != ""
            })}
        >
            <Checkbox
                className={classes.checkBox}
                checked={checked}
                onChange={handleChange}
            />
            <div
                className={classes.mainInfoSpan}
            >
                {/* name */}
                <span
                    className={classes.todoNameSpan}
                >
                    {props.todo.name}{[...Array(30)].map(_ => "a")}
                </span>

                {/* Description */}
                {props.todo.description != undefined && props.todo.description != "" &&
                    <span
                        className={classes.todoDescriptionSpan}
                    >
                        {props.todo.description}
                    </span>
                }

                {/* TargetList */}
                <div
                    className={classes.todoTargetList}
                >
                    {props.todo.targetList?.map(value => <span>#{value.name}</span>)}
                </div>
            </div>
            <div
                className={classes.detailInfoDiv}
            >
                <span
                    className={classes.detailInfoTopHalf}
                >
                    {props.todo.processingTimeScheduled != undefined && props.todo.processingTimeScheduled >= 60 ?
                        <span className={classes.detailInfoSpan}>{Math.trunc(props.todo.processingTimeScheduled / 60)}h{props.todo.processingTimeScheduled % 60}min</span>
                        :
                        <span className={classes.detailInfoSpan}>{props.todo.processingTimeScheduled}min</span>
                    }
                    <span className={classes.detailInfoSpan}>6:30</span>
                </span>
                <span
                    className={classes.detailInfoBottomHalf}
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
                </span>
            </div>
        </div>
    );
}
