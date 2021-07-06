import { Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    selectedRepeatPattern: { interval: 'Daily' | 'Monthly' } | { interval: 'Weekly', repeatDay: number[] } | null
    repeatPatternSetter: React.Dispatch<React.SetStateAction<{ interval: 'Daily' | 'Monthly' } | { interval: 'Weekly', repeatDay: number[] } | null>>
    date: Date | null
    dateSetter: React.Dispatch<React.SetStateAction<Date | null>>
    timeSettedBool: boolean
    dateStrSetter: React.Dispatch<React.SetStateAction<string>>
    text: string
    textSetter: React.Dispatch<React.SetStateAction<string>>
}

export default function RepeatPatternAutoCompleteListMenu(props: Props) {

    const closeMenu = () => {
        props.menuAnchorElSetter(null);
    };

    // 修飾キーや上下キー以外が押されたときにメニューを閉じる
    [...'1234567890-=~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnm[]\\{}|;\':",./<>?'].map(value => {
        useHotkeys(value, () => {props.menuAnchorElSetter(null)});
    });

    const selectRepeatPattern = (key: 'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat') => {
        if (key == 'Daily' || key == 'Monthly') {
            if (props.date == null) {
                // 日付指定がされていない場合に当日の日付を指定する
                const newDate = new Date();
                // 日付指定
                props.dateSetter(newDate);
                // フォームの値を同期
                props.dateStrSetter(`${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`);
            }
            // 繰り返し情報を更新
            props.repeatPatternSetter({ interval: key });
        } else {
            if (key == 'Weekly') {
                const date = props.date != null ? props.date : new Date();
                props.repeatPatternSetter({ interval: 'Weekly', repeatDay: [date.getDay()]})
            } else {
                // 指定する曜日番号を取得
                var dayNum = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].findIndex(value => value == key);
                if (dayNum == -1) {
                    dayNum = 1;
                }
                if (props.selectedRepeatPattern != null && props.selectedRepeatPattern.interval == 'Weekly') {
                    // 既にWeeklyが指定されている場合
                    props.repeatPatternSetter({ interval: 'Weekly', repeatDay: [...props.selectedRepeatPattern.repeatDay, dayNum]})
                } else {
                    // 指定する曜日になるまで日付を進める
                    const newDate = new Date();
                    [...Array(6)].some(_ => {
                        if (newDate.getDay() == dayNum) {
                            return true;
                        }
                        newDate.setDate(newDate.getDate() + 1);
                    })
                    // 日付指定
                    props.dateSetter(newDate);
                    // フォームの値を同期
                    props.dateStrSetter(`${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`);
                    // 繰り返し情報を更新
                    props.repeatPatternSetter({ interval: 'Weekly', repeatDay: [dayNum]})
                }
            }
        }
        // \*~~を削除
        props.textSetter(current => current.replace(/\s+\*\w*\s*/g, '').replace(/^\*\w*\s*/g, ''));
        // メニューを閉じる
        closeMenu();
    };

    const intervalRepeatPatterList: ("Daily" | "Weekly" | "Monthly")[] = ["Daily" , "Weekly" , "Monthly"];
    const dayRepeatPatternList: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <Menu
            anchorEl={props.menuAnchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={Boolean(props.menuAnchorEl)}
            onClose={closeMenu}
        >
            {/* RepeatPattern補完リスト */}
            {/* "Daily" , "Weekly" , "Monthly" */}
            {intervalRepeatPatterList.filter(value => {
                // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                // 末尾ブロックの文字列の先頭が'*'なら変数strに保持（含まれていなければundefined）
                const str = '\*'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                if (str == undefined) {
                    props.menuAnchorElSetter(null);
                    return false;
                }

                if (str.length == 1) {
                    return true;
                }

                return value.toLowerCase().includes(str.slice(1).toLowerCase())
            }).map(value => (
                <MenuItem onClick={() => selectRepeatPattern(value)} key={value}>{value}</MenuItem>
            ))}
            {/* 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' */}
            {dayRepeatPatternList.filter(value => {
                // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                // 末尾ブロックの文字列の先頭が'*'なら変数strに保持（含まれていなければundefined）
                const str = '\*'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                if (str == undefined) {
                    props.menuAnchorElSetter(null);
                    return false;
                }

                if (str.length == 1) {
                    return false;
                }

                return value.toLowerCase().includes(str.slice(1).toLowerCase())
            }).map(value => (
                <MenuItem onClick={() => selectRepeatPattern(value)} key={value}>{value}</MenuItem>
            ))}
            {(() => {
                const ary = [...intervalRepeatPatterList.filter(value => {
                    // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                    const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                    // 末尾ブロックの文字列の先頭が'*'なら変数strに保持（含まれていなければundefined）
                    const str = '\*'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                    if (str == undefined) {
                        props.menuAnchorElSetter(null);
                        return false;
                    }

                    if (str.length == 1) {
                        return true;
                    }

                    return value.toLowerCase().includes(str.slice(1).toLowerCase())
                }), ...dayRepeatPatternList.filter(value => {
                    // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                    const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                    // 末尾ブロックの文字列の先頭が'*'なら変数strに保持（含まれていなければundefined）
                    const str = '\*'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                    if (str == undefined) {
                        props.menuAnchorElSetter(null);
                        return false;
                    }

                    if (str.length == 1) {
                        return false;
                    }

                    return value.toLowerCase().includes(str.slice(1).toLowerCase())
                })]
                if (ary.length == 0) {
                    return intervalRepeatPatterList.map(value => (
                        <MenuItem onClick={() => selectRepeatPattern(value)} key={value}>{value}</MenuItem>
                    ))
                }
            })()}
        </Menu>
    );
}