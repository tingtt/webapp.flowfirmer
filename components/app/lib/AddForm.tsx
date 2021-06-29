import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Menu, MenuItem, Chip } from '@material-ui/core';
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
        targetChip: {
            margin: theme.spacing(0.5),
        }
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

    // 補完メニュー非表示
    const menuClose = (menuType?: 'Target' | 'Term' | 'startDate' | 'startTime' | 'endDate' | 'processingTime') => {
        switch (menuType) {
            case 'Target':
                setTargetAutoCompleteMenuAnchorEl(null);
                break;
            default :
                // すべて閉じる
                setTargetAutoCompleteMenuAnchorEl(null);
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
        (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value = (targetAutoCompleteMenuAnchorEl as HTMLInputElement).value.replace(/\s*#\w*\s*/, '');
    };

    const removeTarget = (targetId: number) => {
        setSelectedTargetIdList(current => current?.filter(value => value != targetId))
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

    /**
     * syntaxDetection
     *
     * 入力値から特定の文字を検出したら対応する補完メニューを表示
     *
     * @param e React.ChangeEvent<HTMLInputElement>
     */
    const syntaxDetection = (e: React.ChangeEvent<HTMLInputElement>) => {

        const modifyTargetList = (str?: string) => {
            // Targetの入力補完リストを更新
            setTargetList(current => {
                if (current != undefined) {
                    // 未選択のTargetを表示
                            return current.map(value => (
                                {
                                    hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : false,
                                    target: value.target
                                }
                            ));
                        }
                        // Targetが1つもない場合
                        return undefined;
                    });
        }

        if (e.target.value.length == 1) {
            // 1文字のみ入力されている場合
            switch (e.target.value) {
                case '#':
                    // Targetの入力補完リストを更新
                    modifyTargetList();
                    // Targetの入力補完リストを表示
                    setTargetAutoCompleteMenuAnchorEl(e.target);
                    setNewTargetName('');
                    break;
                default:
                    break;
            }
        } else {
            // 2文字以上入力されている場合
            switch (e.target.value.slice(-2)) {
                /**
                 * case * : 末尾がsuntaxリテラルの場合
                 * default > case * : それ以外（syntaxリテラル後に文字列が入力されている）
                 */
                case ' #':
                    // Targetの入力補完リストを更新
                    modifyTargetList();
                    // Targetの入力補完リストを表示
                    setTargetAutoCompleteMenuAnchorEl(e.target);
                    setNewTargetName('');
                    break;
                default:
                    // 補完リストの絞り込み
                    const strAry = e.target.value.split(' ');
                    const str = strAry[strAry.length - 1];
                    switch (str.slice(0,1)) {
                        case '#':
                            // Targetの入力補完リストを更新
                            modifyTargetList(str);
                            // Targetの入力補完リストを表示
                            setTargetAutoCompleteMenuAnchorEl(e.target);
                            setNewTargetName(str.slice(1));
                            break;
                        default:
                            break;
                    }
                    break;
            }
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
            {/* 選択中のTargetリスト */}
            <div>
                {selectedTargetIdList != undefined && targetList != undefined && selectedTargetIdList.filter(value => value != -1).map(targetId =>
                    <Chip
                        className={classes.targetChip}
                        key={targetId}
                        label={targetList.find(value => value.target.id == targetId)?.target.name}
                        onDelete={() => removeTarget(targetId)}
                    />
                )}
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
        </div>
    );
}