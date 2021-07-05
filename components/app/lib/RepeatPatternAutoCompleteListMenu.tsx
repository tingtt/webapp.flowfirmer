import { Menu, MenuItem } from "@material-ui/core";
import React from "react";

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    selectedRepeatPattern: "Daily" | "Weekly" | "Monthly" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | undefined
    repeatPatternSetter: React.Dispatch<React.SetStateAction<"Daily" | "Weekly" | "Monthly" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | undefined>>
    text: string
    textSetter: React.Dispatch<React.SetStateAction<string>>
}

export default function RepeatPatternAutoCompleteListMenu(props: Props) {

    const closeMenu = () => {
        props.menuAnchorElSetter(null);
    };

    const selectRepeatPattern = (key: 'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat') => {
        props.repeatPatternSetter(key);
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
        </Menu>
    );
}