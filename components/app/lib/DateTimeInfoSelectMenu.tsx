import 'date-fns';
import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Menu, MenuItem, TextField } from '@material-ui/core';
import { Clear, Loop } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    date: Date | null
    dateSetter: React.Dispatch<React.SetStateAction<Date | null>>
    timeSettedBool: boolean
    timeSettedBoolSetter: React.Dispatch<React.SetStateAction<boolean>>
    dateStr: string
    dateStrSetter: React.Dispatch<React.SetStateAction<string>>
    timeStr: string
    timeStrSetter: React.Dispatch<React.SetStateAction<string>>
    repeatPattern: 'Daily' | 'Weekly' | 'Monthly' | null
    repeatPatternSetter: React.Dispatch<React.SetStateAction<"Daily" | "Weekly" | "Monthly" | null>>
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
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
        repeatPatternSelecterDiv: {
            display: 'flex',
            marginBottom: theme.spacing(2),
        },
        repeatPatternSelecterItem: {
            width: theme.spacing(35),
        },
        clearButtonDiv: {
            marginTop: theme.spacing(2.4),
            margin: 'auto',
            color: theme.palette.grey.A200,
            "& :hover": {
                color: theme.palette.grey[600]
            }
        },
        clearRepeatPatternDiv: {
            margin: 'auto',
            color: theme.palette.grey.A200,
            "& :hover": {
                color: theme.palette.grey[600]
            }
        },
        buttonFontColorPrimary: {
            color: theme.palette.primary.main
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

    useHotkeys('command+\\', () =>props.menuAnchorElSetter(null))

    // 日付指定
    const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TextFieldの値を更新
        props.dateStrSetter(e.target.value);

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
        props.timeStrSetter(e.target.value);

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
            props.dateStrSetter(`${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`);
            return newDate;
        })

        props.timeSettedBoolSetter(true);
    };

    const [repeatPatternMenuAnchorEl, setRepeatPatternMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // Clear all
    const clearAll = () => {
        props.dateSetter(null);
        props.timeSettedBoolSetter(false);
        props.dateStrSetter("");
        props.timeStrSetter("");
        props.menuAnchorElSetter(null);
        props.repeatPatternSetter(null);
    }

    return (
        <Menu
            className={classes.root}
            anchorEl={props.menuAnchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
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
                        value={props.dateStr}
                        onChange={setDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {props.date != null && <div
                        className={classes.clearButtonDiv}
                        onClick={() => {
                            props.dateSetter(null);
                            props.timeSettedBoolSetter(false);
                            props.dateStrSetter("");
                            props.timeStrSetter("");
                            props.repeatPatternSetter(null);
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
                        value={props.timeStr}
                        onChange={setTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {props.timeSettedBool &&  <div
                        className={classes.clearButtonDiv}
                        onClick={() => {
                            props.timeSettedBoolSetter(false);
                            props.timeStrSetter("");
                        }}
                    >
                        <Clear/>
                    </div>}
                </div>
                <div
                    className={classes.repeatPatternSelecterDiv}
                >
                    <Button
                        className={clsx(classes.button, {
                            [classes.buttonFontColorPrimary]: props.repeatPattern != undefined
                        })}
                        variant="outlined"
                        onClick={(e: React.MouseEvent<HTMLElement>) => setRepeatPatternMenuAnchorEl(e.currentTarget)}
                    >
                        <Loop />{props.repeatPattern != undefined ? props.repeatPattern : "Repeat"}
                    </Button>
                    {props.repeatPattern != undefined && <div
                        className={classes.clearRepeatPatternDiv}
                        onClick={() => {
                            props.repeatPatternSetter(null);
                        }}
                    >
                        <Clear />
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
            <Menu
                anchorEl={repeatPatternMenuAnchorEl}
                open={Boolean(repeatPatternMenuAnchorEl)}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                onClose={() => setRepeatPatternMenuAnchorEl(null)}
            >
                {(["Daily" , "Weekly" , "Monthly"] as ("Daily" | "Weekly" | "Monthly")[]).map(value => (
                    <MenuItem
                        className={classes.repeatPatternSelecterItem}
                        key={value}
                        onClick={() => {
                            props.repeatPatternSetter(value);
                            if (props.date == null) {
                                // 繰り返しパターン指定時に日付が指定されていないときに当日を指定
                                const nowDate = new Date();
                                props.dateSetter(nowDate);
                                props.timeSettedBoolSetter(false);
                                props.dateStrSetter(`${nowDate.getFullYear()}-${("0" + (nowDate.getMonth() + 1)).slice(-2)}-${("0" + nowDate.getDate()).slice(-2)}`);
                                props.timeStrSetter("");
                            }
                            setRepeatPatternMenuAnchorEl(null);
                        }}
                    >
                        {value}
                    </MenuItem>
                ))}
            </Menu>
        </Menu>
    );
}
