import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Divider } from "@material-ui/core";

import AddForm from "../lib/AddForm";
import AppDataManager from '../../../lib/app/appDataManager';
import ToDoListItem from '../lib/ToDoListItem';

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
                    {appDataManager.todos?.filter(value => !value.completed || true ).map(value => <div><ToDoListItem todo={value} /><Divider /></div>)}
                    {/* TODO: 完了済to-do、記録済リマインドリスト実装 */}
                </div>
            </div>
            <Divider orientation='vertical' flexItem/>
            {/* 右 */}
            <div
                className={classes.contentRight}
            >
                {/* TODO: to-do詳細画面 */}
            </div>
        </div>
    )
}