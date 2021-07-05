import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Chip } from '@material-ui/core';
import { Clear, Event, Loop } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import AppDataManager from '../../../lib/app/appDataManager';
import DateTimeInfoSelectMenu from './DateTimeInfoSelectMenu';
import TargetAutoCompleteListMenu from './TargetAutoCompleteListMenu';
import RepeatPatternAutoCompleteListMenu from './RepeatPatternAutoCompleteListMenu';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        divInput: {
            display: 'flex',
        },
        input: {
            width: '100%',
        },
        dateSelecterDiv: {
            display: 'inline-flex',
            verticalAlign: 'middle',
            "& :hover": {
                color: theme.palette.grey[600],
            },
        },
        calendarIcon: {
            margin: 'auto',
            color: theme.palette.grey.A200,
            marginLeft: theme.spacing(0.5),
            borderRadius: theme.spacing(2),
        },
        infoChipsDiv: {
            display: 'flex',
        },
        targetChipDiv: {
            overflowX: 'auto',
            whiteSpace: 'nowrap'
        },
        targetChip: {
            margin: theme.spacing(0.5),
        },
        clearTargetChipDiv: {
            display: 'inline-flex',
            verticalAlign: 'middle',
            "& :hover": {
                color: theme.palette.grey[600],
            },
        },
        clearTargetChip: {
            backgroundColor: theme.palette.grey.A100,
            color: theme.palette.grey.A200,
            borderRadius: theme.spacing(2),
            height: theme.spacing(4),
            width: theme.spacing(4),
            padding: theme.spacing(0.5),
        },
        repeatPatternChipDiv:{
            marginLeft: 'auto',
        },
        repeatPatternChip: {
            margin: theme.spacing(0.5),
        },
    }),
);

type Props = {
    defaultSelectTargetId?: number
};

export default function AddForm(props: Props) {

    const classes = useStyles();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(0)
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    // 入力値
    const [inputText, setInputText] = React.useState<string>("");

    /**
     * Target
     */

    // 補完リストのアンカー
    const [targetAutoCompleteMenuAnchorEl, setTargetAutoCompleteMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // 選択状態(デフォルト選択があれば指定)
    const [selectedTargetIdList, setSelectedTargetIdList] = React.useState<number[] | undefined>(props.defaultSelectTargetId != undefined ? [props.defaultSelectTargetId] : undefined);

    // 選択解除
    const removeTarget = (targetId?: number) => {
        if (targetId != undefined) {
            setSelectedTargetIdList(current => current?.filter(value => value != targetId));
        } else {
            setSelectedTargetIdList(undefined);
        }
    };

    /**
     * RepeatPattern
     */

    // 補完リストのアンカー
    const [repeatPatternAutoCompleteMenuAnchorEl, setRepeatPatternAutoCompleteMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // 選択状態
    const [selectedRepeatPattern, setRepeatPattern] = React.useState<'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | undefined>(undefined);

    // 選択解除
    const clearRepeatPattern = () => {
        setRepeatPattern(undefined);
    };

    /**
     * Date
     */

    // 日時情報
    const [date, setDate] = React.useState<Date | null>(null);

    // 開始時間の指定状態
    const [timeSetted, setTimeSetted] = React.useState<boolean>(false);

    // メニューのアンカー
    const [datetimeInfoSelectMenuAnchorEl, setDatetimeInfoSelectMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    /**
     * Hotkeys
     */

    // 修飾キーや上下キー以外が押されたときにメニューを閉じる
    [...'1234567890-=~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnm[]\\{}|;\':",./<>?'].map(value => {
        useHotkeys(value, () => {
            if (targetAutoCompleteMenuAnchorEl != null) {
                setTargetAutoCompleteMenuAnchorEl(null);
            }
            if (repeatPatternAutoCompleteMenuAnchorEl != null) {
                setRepeatPatternAutoCompleteMenuAnchorEl(null);
            }
            if (datetimeInfoSelectMenuAnchorEl != null) {
                setDatetimeInfoSelectMenuAnchorEl(null)
            }
        });
    });

    /**
     * syntaxDetection
     *
     * 入力値から特定の文字を検出したら対応する補完メニューを表示
     *
     * @param e React.ChangeEvent<HTMLInputElement>
     */
    const syntaxDetection = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputText(e.target.value);

        // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
        const inputValue = e.target.value.slice(e.target.value.lastIndexOf(' ') + 1);
        // 末尾ブロックの文字列の先頭が'#', '*'なら変数strに保持（含まれていなければundefined）
        const str = '#*'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

        if (str == undefined) {
            return;
        }

        switch (true) {
            // '#'
            case /#\w*/.test(str):
                // Targetの入力補完リストを表示
                setTargetAutoCompleteMenuAnchorEl(e.target);
                break;

            // '*'
            case /\*\w*/.test(str):
                // RepeatPatternの入力補完リストを表示
                setRepeatPatternAutoCompleteMenuAnchorEl(e.target);
                break;

            default:
                break;
        }
    };

    return (
        <div
            className={classes.root}
        >
            {/* 追加フォーム */}
            <div
                className={classes.divInput}
            >
                <Input
                    placeholder="New to-do / term"
                    inputProps={{ 'aria-label': 'description' }}
                    value={inputText}
                    onChange={syntaxDetection}
                    className={classes.input}
                />
                <div
                    className={classes.dateSelecterDiv}
                    onClick={(e: React.MouseEvent<HTMLElement>) => setDatetimeInfoSelectMenuAnchorEl(e.currentTarget)}
                >
                    <Event
                        className={classes.calendarIcon}
                    />
                </div>
            </div>
            <br />
            <div
                className={classes.infoChipsDiv}
            >
                {/* 選択中のTargetリスト */}
                <div
                    className={classes.targetChipDiv}
                >
                    {appDataManager.targets != undefined && selectedTargetIdList != undefined && selectedTargetIdList.filter(value => value != -1).map(targetId =>
                        <Chip
                            className={classes.targetChip}
                            key={targetId}
                            label={appDataManager.targets?.find(value => value.id == targetId)?.name}
                            onDelete={() => removeTarget(targetId)}
                        />
                    )}
                    {/* 2つ以上のTargetを選択中に全クリア用のChip */}
                    {selectedTargetIdList != undefined && selectedTargetIdList.filter(value => value > -1).length >= 2 &&
                        <div
                            className={classes.clearTargetChipDiv}
                        >
                            <Clear
                                className={clsx(classes.targetChip, classes.clearTargetChip)}
                                onClick={() => removeTarget()}
                            />
                        </div>
                    }
                </div>
                {/* 選択中のRepeatPattern */}
                {selectedRepeatPattern != undefined && <div
                    className={classes.repeatPatternChipDiv}
                >
                    <Chip
                        icon={<Loop />}
                        className={classes.repeatPatternChip}
                        onDelete={clearRepeatPattern}
                        label={selectedRepeatPattern}
                    />
                </div>}
            </div>
            {/* 補完リストメニュー */}
            {/* Target補完リスト */}
            <TargetAutoCompleteListMenu
                menuAnchorEl={targetAutoCompleteMenuAnchorEl}
                menuAnchorElSetter={setTargetAutoCompleteMenuAnchorEl}
                selectedIdList={selectedTargetIdList}
                idListSetter={setSelectedTargetIdList}
                text={inputText}
                textSetter={setInputText}
            />

            {/* RepeatPattern補完リスト */}
            <RepeatPatternAutoCompleteListMenu
                menuAnchorEl={repeatPatternAutoCompleteMenuAnchorEl}
                menuAnchorElSetter={setRepeatPatternAutoCompleteMenuAnchorEl}
                selectedRepeatPattern={selectedRepeatPattern}
                repeatPatternSetter={setRepeatPattern}
                text={inputText}
                textSetter={setInputText}
            />

            {/* 日時指定用メニュー */}
            <DateTimeInfoSelectMenu
                menuAnchorEl={datetimeInfoSelectMenuAnchorEl}
                menuAnchorElSetter={() => setDatetimeInfoSelectMenuAnchorEl(null)}
                date={date}
                dateSetter={setDate}
                timeSettedBool={timeSetted}
                timeSettedBoolSetter={setTimeSetted}
            />
        </div>
    );
}