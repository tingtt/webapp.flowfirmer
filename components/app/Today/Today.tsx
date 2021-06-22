import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Divider } from "@material-ui/core";

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
            overflow: 'auto',
            paddingRight: theme.spacing(2)
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

    const [selectedToDoId, setSelectedToDoId] = React.useState<number>();

    return (
        <div
            className={classes.root}
        >
            {/* 左 */}
            <div
                className={classes.contentLeft}
            >
                <AddForm />
                <div>
                    <Divider />
                    {/* TODO: to-doリスト実装 */}
                    {appDataManager.todos?.filter(value => !value.completed).sort((a,b) => {
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
                        <div key={value.id} onClick={() => setSelectedToDoId(value.id)} >
                            <ToDoListItem key={value.id} todo={value} />
                            <Divider />
                        </div>
                    ))}
                    {/* TODO: 完了済to-do、記録済リマインドリスト実装 */}
                    {appDataManager.todos?.filter(value => value.completed).map(value => (
                        <div key={value.id} onClick={() => setSelectedToDoId(value.id)} >
                            <ToDoListItem key={value.id} todo={value} />
                            <Divider />
                        </div>
                    ))}
                </div>
            </div>
            <Divider orientation='vertical' flexItem/>
            {/* 右 */}
            <div
                className={classes.contentRight}
            >
                {/* TODO: to-do詳細画面 */}
                {appDataManager.todos?.filter(value => value.id == selectedToDoId).map(value => (
                    <div key={value.id}>
                        <ToDoDetail todo={value} />
                    </div>
                ))}
            </div>
        </div>
    )
}