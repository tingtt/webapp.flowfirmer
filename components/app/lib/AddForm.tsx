import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Menu, MenuItem, Chip } from '@material-ui/core';
import { Clear, Loop } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import { Target } from "../../../lib/interface/index";

import AppDataManager from '../../../lib/app/appDataManager';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            marginTop: '3em',
        },
        root: {
            width: '100%',
        },
        divInput: {
            textAlign: 'center',
        },
        input: {
            width: '100%',
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
        clearTargetChip: {
            backgroundColor: theme.palette.grey.A100,
            color: theme.palette.grey.A200,
            borderRadius: theme.spacing(2),
            height: theme.spacing(4),
            width: theme.spacing(4),
            padding: theme.spacing(0.5),
            verticalAlign: 'middle'
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

    // Target新規作成用の名前を保持
    const [newTargetName, setNewTargetName] = React.useState<string>('');

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
        menuClose('Target');
    };

    // RepeatPattern関連処理

    const selectRepeatPattern = (key: 'Daily' | 'Weekly' | 'Monthly' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat') => {
        setRepeatPattern(key);
        menuClose('RepeatPattern');
        (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value = (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/\s+\*\w*\s*/g, '');
        (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value = (repeatPatternAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/^\*\w*\s*/g, '');
    };

    const removeRepeatPattern = () => {
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

        const modifyTargetList = (str: string) => {
            // Targetの入力補完リストを更新
            setTargetList(current => {
                if (current != undefined) {
                    // 未選択のTargetを表示
                    return current.map(value => {
                        if (str.length == 1) {
                            return {
                                hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : false,
                                target: value.target
                            }
                        }
                        return {
                            hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : !value.target.name.toLowerCase().includes(str.slice(1).toLowerCase()),
                            target: value.target
                        }
                    });
                }
                // Targetが1つもない場合
                return undefined;
            });
        }

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
                // Targetの入力補完リストを更新
                modifyTargetList(str);
                // Targetの入力補完リストを表示
                setTargetAutoCompleteMenuAnchorEl(e.target);
                if (str.length > 1) {
                    setNewTargetName(str.slice(1));
                } else {
                    setNewTargetName('');
                }
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
                    onChange={syntaxDetection}
                    className={classes.input}
                />
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
                        <Clear
                            className={clsx(classes.targetChip, classes.clearTargetChip)}
                            onClick={() => removeTarget()}
                        />
                    }
                </div>
                {/* 選択中のRepeatPattern */}
                {selectedRepeatPattern != undefined && <div
                    className={classes.repeatPatternChipDiv}
                >
                    <Chip
                        icon={<Loop />}
                        className={classes.repeatPatternChip}
                        onDelete={removeRepeatPattern}
                        label={selectedRepeatPattern}
                    />
                </div>}
            </div>
            {/* 補完リストメニュー */}
            {/* Target補完リスト */}
            <Menu
                className={classes.menu}
                anchorEl={targetAutoCompleteMenuAnchorEl}
                keepMounted
                open={Boolean(targetAutoCompleteMenuAnchorEl)}
                onClose={() => menuClose('Target')}
            >
                {/* Target補完リスト */}
                {targetList != undefined && targetList.filter(value => !value.hidden).map(value => (
                    <MenuItem onClick={() => selectTarget(value.target.id)} key={value.target.id}>{value.target.name}</MenuItem>
                ))}
                {/* Target新規追加用 */}
                {newTargetName != '' && <MenuItem onClick={() => createNewTarget(newTargetName)} key={'newTarget'}>Create new target: {newTargetName}</MenuItem>}
            </Menu>
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
        </div>
    );
}