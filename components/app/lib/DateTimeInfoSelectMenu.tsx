import 'date-fns';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Menu, TextField } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    date: Date | null
    dateSetter: React.Dispatch<React.SetStateAction<Date | null>>
    timeSettedBool: boolean
    timeSettedBoolSetter: React.Dispatch<React.SetStateAction<boolean>>
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '3em',
            "& .MuiPopover-paper": {
                width: theme.spacing(40),
            }
        },
        menuInnerDiv: {
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
        },
        dateDiv: {
            display: 'flex',
            marginBottom: theme.spacing(2),
        },
        timeDiv: {
            display: 'flex',
            marginBottom: theme.spacing(2),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: "100%"
        },
        celearButtonDiv: {
            marginTop: theme.spacing(2.4),
            margin: 'auto',
            color: theme.palette.grey.A200,
            "& :hover": {
                color: theme.palette.grey[600]
            }
        },
        mainButtonsDiv: {
            display: 'flex',
        },
        button: {
            flex: '1',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        }
    })
);

export default function DateTimeInfoSelectMenu(props: Props) {

    const classes = useStyles();

    // 日付の文字列
    const [dateStr, setDateStr] = React.useState<string>(props.date != null ?
        `${props.date.getFullYear()}-${("0" + (props.date.getMonth() + 1)).slice(-2)}-${("0" + props.date.getDate()).slice(-2)}`
        :
        ""
    );

    // 時間の文字列
    const [timeStr, setTimeStr] = React.useState<string>(props.date != null && props.timeSettedBool ?
        `${("0" + props.date.getHours()).slice(-2)}:${("0" + props.date.getMinutes()).slice(-2)}`
        :
        ""
    );

    // 日付指定
    const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TextFieldの値を更新
        setDateStr(e.target.value);

        if (e.target.value == "") {
            // 初期化
            props.dateSetter(null);
            return;
        }

        // 文字列を分解してnumber[]に
        const splited = e.target.value.split(/[-/]/).map(value => +value);

        // 得た数値からDate型の値を生成してStateの日付情報を更新
        props.dateSetter(current => {
            if (current != null) {
                current.setFullYear(splited[0]);
                current.setMonth(splited[1] - 1);
                current.setDate(splited[2]);
                return current;
            }

            return new Date(splited[0], splited[1], splited[2]);
        });
    };

    // 時間指定
    const setTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TextFieldの値を更新
        setTimeStr(e.target.value);

        if (e.target.value == "") {
            // 初期化
            props.timeSettedBoolSetter(false);
            return;
        }

        // 文字列を分解してnumber[]に
        const splited = e.target.value.split(":").map(value => +value);

        // 得た数値でStateの時間情報を更新
        props.dateSetter(current => {
            if (current != null) {
                current.setHours(splited[0], splited[1]);
                return current;
            }
            const newDate = new Date();
            newDate.setHours(splited[0], splited[1]);
            setDateStr(`${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`);
            return newDate;
        })

        props.timeSettedBoolSetter(true);
    };

    // Clear all
    const clearAll = () => {
        props.dateSetter(null);
        props.timeSettedBoolSetter(false);
        props.menuAnchorElSetter(null);
    }

    return (
        <Menu
            className={classes.root}
            anchorEl={props.menuAnchorEl}
            keepMounted
            open={Boolean(props.menuAnchorEl)}
            onClose={() => props.menuAnchorElSetter(null)}
        >
            <div
                className={classes.menuInnerDiv}
            >
                <div
                    className={classes.dateDiv}
                >
                    <TextField
                        className={classes.textField}
                        label="Date"
                        type="date"
                        value={dateStr}
                        onChange={setDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {props.date != null && <div
                        className={classes.celearButtonDiv}
                        onClick={() => {
                            props.dateSetter(null);
                            props.timeSettedBoolSetter(false);
                            setDateStr("");
                            setTimeStr("");
                        }}
                    >
                        <Clear />
                    </div>}
                </div>
                <div
                    className={classes.timeDiv}
                >
                    <TextField
                        className={classes.textField}
                        label="Start time"
                        type="time"
                        value={timeStr}
                        onChange={setTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {props.timeSettedBool &&  <div
                        className={classes.celearButtonDiv}
                        onClick={() => {
                            props.timeSettedBoolSetter(false);
                            setTimeStr("");
                        }}
                    >
                        <Clear/>
                    </div>}
                </div>
                <div
                    className={classes.mainButtonsDiv}
                >
                    <Button
                        className={classes.button}
                        variant="outlined"
                        onClick={clearAll}
                    >
                        Clear
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => props.menuAnchorElSetter(null)}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </Menu>
    );
}
