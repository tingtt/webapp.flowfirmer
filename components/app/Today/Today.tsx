import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Divider } from "@material-ui/core";

import AddForm from "../lib/AddForm";

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
        contentRight: {
            flex: 1,
            paddingLeft: theme.spacing(2)
        },
    }),
);

export default function Today() {

    const classes = useStyles();

    return (
        <div
            className={classes.root}
        >
            {/* 左 */}
            <div
                className={classes.contentLeft}
            >
                <AddForm />
                {/* TODO: to-doリスト実装 */}
                {/* TODO: 完了済to-do、記録済リマインドリスト実装 */}
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