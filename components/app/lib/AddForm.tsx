import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Menu, MenuItem, Chip } from '@material-ui/core';
import { Clear, Event, Loop } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import { Target } from "../../../lib/interface/index";

import AppDataManager from '../../../lib/app/appDataManager';
import DateTimeInfoSelectMenu from './DateTimeInfoSelectMenu';
import TargetAutoCompleteListMenu from './TargetAutoCompleteListMenu';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            marginTop: '3em',
        },
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

    // Target補完リストのアンカー
    const [targetAutoCompleteMenuAnchorEl, setTargetAutoCompleteMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // TODO: ユーザーのTargetを取得
    const [targetList, setTargetList] = React.useState<{hidden: boolean, target: Target}[] | undefined>(
        appDataManager.targets?.map(value => ({ hidden: false, target: value}))
    );

    // Targetの選択状態(デフォルト選択があれば指定)
    const [selectedTargetIdList, setSelectedTargetIdList] = React.useState<number[]>(
        [props.defaultSelectTargetId != undefined ? props.defaultSelectTargetId : -1]
    );

    // RepeatPattern補完リストのアンカー
    const [repeatPatternAutoCompleteMenuAnchorEl, setRepeatPatternAutoCompleteMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // RepeatPatternの補完リスト
    const [repeatPatternList, setRepeatPatternList] = React.useState<[
        {hidden: boolean, key: 'Daily'},
        {hidden: boolean, key: 'Weekly'},
        {hidden: boolean, key: 'Monthly'},
        {hidden: boolean, key: 'Sun'},
        {hidden: boolean, key: 'Mon'},
        {hidden: boolean, key: 'Tue'},
        {hidden: boolean, key: 'Wed'},
        {hidden: boolean, key: 'Thu'},
        {hidden: boolean, key: 'Fri'},
        {hidden: boolean, key: 'Sat'},
    ]>(
        [
            {hidden: false, key: 'Daily'},
            {hidden: false, key: 'Weekly'},
            {hidden: false, key: 'Monthly'},
            {hidden: true, key: 'Sun'},
            {hidden: true, key: 'Mon'},
            {hidden: true, key: 'Tue'},
            {hidden: true, key: 'Wed'},
            {hidden: true, key: 'Thu'},
            {hidden: true, key: 'Fri'},
            {hidden: true, key: 'Sat'},
        ]
    );

    // 選択中のRepeatPatternを保持
    const [selectedRepeatPattern, setRepeatPattern] = React.useState<'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | undefined>(undefined);

    // 補完メニュー非表示
    const menuClose = (menuType?: 'Target' | 'Term' | 'startDate' | 'startTime' | 'endDate' | 'processingTime' | 'RepeatPattern') => {
        switch (menuType) {
            case 'Target':
                setTargetAutoCompleteMenuAnchorEl(null);
                break;
            case 'RepeatPattern':
                setRepeatPatternAutoCompleteMenuAnchorEl(null);
                break;
            default :
                // すべて閉じる
                setTargetAutoCompleteMenuAnchorEl(null);
                setRepeatPatternAutoCompleteMenuAnchorEl(null);
        }
    };

    // 修飾キーや上下キー以外が押されたときにメニューを閉じる
    [...'1234567890-=~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnm[]\\{}|;\':",./<>?'].map(value => {
        useHotkeys(value, () => menuClose());
    });

    // Target関連処理

    const selectTarget = (targetId: number) => {
        setSelectedTargetIdList(current => current == undefined ? [targetId] : current.concat([targetId]) )
        menuClose('Target');
        // #~~を削除
        (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value = (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/\s+#\w*\s*/g, '');
        (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value = (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/^#\w*\s*/g, '');
    };

    const removeTarget = (targetId?: number) => {
        if (targetId != undefined) {
            setSelectedTargetIdList(current => current?.filter(value => value != targetId));
        } else {
            setSelectedTargetIdList([-1]);
        }
    };

    const createNewTarget = (targetName: string) => {
        // TODO: Targetの新規作成、ID取得処理
        const newTarget = appDataManager.registerTarget(targetName);
        // 新規Targetをリストに追加
        setTargetList(appDataManager.targets?.map(value => ({ hidden: false, target: value })));
        // 新規Targetを選択
        selectTarget(newTarget.id);
        // メニューを閉じる
        setTargetAutoCompleteMenuAnchorEl(null);
    };

    // RepeatPattern関連処理

    const selectRepeatPattern = (key: 'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat') => {
        setRepeatPattern(key);
        menuClose('RepeatPattern');
        (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value = (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/\s+\*\w*\s*/g, '');
        (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value = (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/^\*\w*\s*/g, '');
    };

    const clearRepeatPattern = () => {
        setRepeatPattern(undefined);
        menuClose('RepeatPattern');
    };

    /**
     * syntaxDetection
     *
     * 入力値から特定の文字を検出したら対応する補完メニューを表示
     *
     * @param e React.ChangeEvent<HTMLInputElement>
     */
    const syntaxDetection = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputText(e.target.value);

        const modifyRepeatPatternList = (str: string) => {
            setRepeatPatternList(current => {
                var newValue = current;
                if (str.length == 1) {
                    // Daily, Weekly, Monthlyを表示
                    current.forEach((_, idx) => {newValue[idx].hidden = idx > 2});
                } else {
                    // 入力された文字列から補完を表示
                    current.forEach((val, idx) => {newValue[idx].hidden = !val.key.toLowerCase().includes(str.slice(1).toLowerCase())});
                }
                return newValue;
            })
        }

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
                // RepeatPatternの入力補完リストを更新
                modifyRepeatPatternList(str);
                // RepeatPatternの入力補完リストを表示
                setRepeatPatternAutoCompleteMenuAnchorEl(e.target);
                break;

            default:
                break;
        }
    };

    // Date

    const [date, setDate] = React.useState<Date | null>(null);

    const [timeSetted, setTimeSetted] = React.useState<boolean>(false);

    const [datetimeInfoSelectMenuAnchorEl, setDatetimeInfoSelectMenuAnchorEl] = React.useState<null | HTMLElement>(null);

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
                    {selectedTargetIdList != undefined && targetList != undefined && selectedTargetIdList.filter(value => value != -1).map(targetId =>
                        <Chip
                            className={classes.targetChip}
                            key={targetId}
                            label={targetList.find(value => value.target.id == targetId)?.target.name}
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
                targetCreator={createNewTarget}
            />

            {/* RepeatPattern補完リスト */}
            <Menu
                className={classes.menu}
                anchorEl={repeatPatternAutoCompleteMenuAnchorEl}
                keepMounted
                open={Boolean(repeatPatternAutoCompleteMenuAnchorEl)}
                onClose={() => menuClose('RepeatPattern')}
            >
                {/* RepeatPattern補完リスト */}
                {repeatPatternList.filter(value => !value.hidden).map(value => (
                    <MenuItem onClick={() => selectRepeatPattern(value.key)} key={value.key}>{value.key}</MenuItem>
                ))}
            </Menu>

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