import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Menu, MenuItem, Tab, Tabs, TextField } from '@material-ui/core';
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
    repeatPattern: { interval: 'Daily' } | { interval: 'Weekly', repeatDay: number[] } | { interval: 'Monthly', repeatDate?: number } | null
    repeatPatternSetter: React.Dispatch<React.SetStateAction<{ interval: 'Daily' } | { interval: 'Weekly', repeatDay: number[] } | { interval: 'Monthly', repeatDate?: number } | null>>
    endDate: Date | null
    endDateSetter: React.Dispatch<React.SetStateAction<Date | null>>
    endDateStr: string
    endDateStrSetter: React.Dispatch<React.SetStateAction<string>>
    termFlg: boolean
    termFlgSetter: React.Dispatch<React.SetStateAction<boolean>>
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
        tabsDiv: {
            marginBottom: theme.spacing(2),
        },
        tab: {
            width: "50%",
            minWidth: "unset",
        },
        fieldDiv: {
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

    type SetDateProp = { target: { value: string } };

    // 日付指定
    const setDate = (e: React.ChangeEvent<HTMLInputElement> | SetDateProp) => {
         // TextFieldの値を更新
        props.dateStrSetter(e.target.value);
        console.log(`start: ${e.target.value}`);

        if (e.target.value == "") {
            // 初期化
            props.dateSetter(null);
            if (props.repeatPattern?.interval == 'Monthly') {
                props.repeatPatternSetter({ interval: 'Monthly', repeatDate: undefined })
            }
            return;
        }

        // 文字列を分解してnumber[]に
        const splited = e.target.value.split(/[-/]/).map(value => +value);
        const date = props.date != null
            ? (() => {
                const current = props.date;
                current.setFullYear(splited[0]);
                current.setMonth((splited[1] - 1));
                current.setDate(splited[2]);
                return current;
            })()
            : new Date(splited[0], splited[1] - 1, splited[2])

        // 得た数値からDate型の値を生成してStateの日付情報を更新
        props.dateSetter(date);

        // `e`がReact.ChangeEvent型のときのみ終了日時の自動設定
        if (e.hasOwnProperty('currentTarget')) {
            if (props.endDate == null) {
                // 2週間になるように指定
                // TODO: デフォルトの間隔をユーザー設定から取得
                setEndDate({ target: { value: `${splited[0]}-${`0${splited[1]}`.slice(-2)}-${`0${splited[2] + 13}`.slice(-2)}` }});
            } else if (props.endDate < date) {
                // 同日を指定
                setEndDate({ target: { value: e.target.value }});
            }
        }

        // Monthlyの場合に繰り返す日付を更新
        if (props.repeatPattern?.interval == 'Monthly') {
            props.repeatPatternSetter({ interval: 'Monthly', repeatDate: date.getDate() })
        }
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

    // 終了日
    const setEndDate = (e: React.ChangeEvent<HTMLInputElement> | SetDateProp) => {
        // TextFieldの値を更新
        props.endDateStrSetter(e.target.value);
        console.log(`end: ${e.target.value}`);

        if (e.target.value == "") {
            // 初期化
            props.endDateSetter(null);
            return;
        }

        // 文字列を分解してnumber[]に
        const splited = e.target.value.split(/[-/]/).map(value => +value);
        const date = props.endDate != null
            ? (() => {
                const current = props.endDate;
                current.setFullYear(splited[0]);
                current.setMonth((splited[1] - 1));
                current.setDate(splited[2]);
                return current;
            })()
            : new Date(splited[0], splited[1] - 1, splited[2])

        // 得た数値からDate型の値を生成してStateの日付情報を更新
        props.endDateSetter(date);

        // `e`がReact.ChangeEvent型のときのみ開始日時の自動設定
        if (e.hasOwnProperty('currentTarget')) {
            if (props.date == null) {
                // 2週間になるように指定
                // TODO: デフォルトの間隔をユーザー設定から取得
                setDate({ target: { value: `${splited[0]}-${`0${splited[1]}`.slice(-2)}-${`0${splited[2] - 13}`.slice(-2)}` }});
            } else if (props.date > date) {
                // 同日を指定
                setDate({ target: { value: e.target.value }});
            }
        }
    }

    const [repeatPatternMenuAnchorEl, setRepeatPatternMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // Clear all
    const clearAll = () => {
        props.dateSetter(null);
        props.timeSettedBoolSetter(false);
        props.dateStrSetter("");
        props.timeStrSetter("");
        props.menuAnchorElSetter(null);
        props.repeatPatternSetter(null);
        props.endDateSetter(null);
        props.endDateStrSetter("");
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
                <Tabs
                    className={classes.tabsDiv}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    value={props.termFlg ? 1 : 0}
                    onChange={(_, value:number) => {
                        if (value == 0) {
                            props.termFlgSetter(false);
                        } else {
                            props.termFlgSetter(true);
                        }
                    }}
                >
                    <Tab
                        className={classes.tab}
                        label={"ToDo"}
                    />
                    <Tab
                        className={classes.tab}
                        label={"Term"}
                    />
                </Tabs>
                <div
                    className={classes.fieldDiv}
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
                {props.termFlg ?
                    <div
                        className={classes.fieldDiv}
                    >
                        <TextField
                            className={classes.textField}
                            label="End date"
                            type="date"
                            value={props.endDateStr}
                            onChange={setEndDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {props.endDate != null && <div
                            className={classes.clearButtonDiv}
                            onClick={() => {
                                props.endDateSetter(null);
                                props.endDateStrSetter("");
                            }}
                        >
                            <Clear />
                        </div>}
                    </div>
                    :
                    <div>
                        <div
                            className={classes.fieldDiv}
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
                                <Loop />{props.repeatPattern != undefined ? props.repeatPattern.interval == 'Weekly' ? props.repeatPattern.interval + " (" + props.repeatPattern.repeatDay.map(value => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value] + ",") + ")" : props.repeatPattern.interval : "Repeat"}
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
                    </div>
                }
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
                            const nowDate = new Date();
                            if (props.date == null) {
                                // 繰り返しパターン指定時に日付が指定されていないときに当日を指定
                                props.dateSetter(nowDate);
                                props.timeSettedBoolSetter(false);
                                props.dateStrSetter(`${nowDate.getFullYear()}-${("0" + (nowDate.getMonth() + 1)).slice(-2)}-${("0" + nowDate.getDate()).slice(-2)}`);
                                props.timeStrSetter("");
                            }
                            if (value == 'Weekly') {
                                props.repeatPatternSetter({ interval: value, repeatDay: [props.date != null ? props.date.getDay() : nowDate.getDay()] });
                            } else if (value == 'Monthly') {
                                props.repeatPatternSetter({ interval: value, repeatDate: props.date != null ? props.date.getDate() : nowDate.getDate() });
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
