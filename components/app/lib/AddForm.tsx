import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Menu, MenuItem, Chip } from '@material-ui/core';
import { useHotkeys } from 'react-hotkeys-hook';

import { Target } from "../../../lib/interface/index";

//sampleData
import { sampleTargets } from "../../../utils/sample-data"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            marginTop: '3em',
        },
        root: {
            width: 'max-content',
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

    const [targetAutoCompleteMenuAnchorEl, setTargetAutoCompleteMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    // TODO: ユーザーのTargetを取得
    const [targetList, setTargetList] = React.useState<{hidden: boolean, target: Target}[]>(sampleTargets.filter(value => value.user_id == 0).map(value => ({ hidden: false, target: value})))

    // Targetの選択状態
    const [selectedTargetIdList, setSelectedTargetIdList] = React.useState<number[]>();
    // デフォルト選択のTargetを指定
    if (props.defaultSelectTargetId != undefined) {
        () => setSelectedTargetIdList([props.defaultSelectTargetId]);
    }

    // Target新規作成用の名前を保持
    const [newTargetName, setNewTargetName] = React.useState<string>('');

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

    const addTarget = (targetId: number) => {
        setSelectedTargetIdList(current => current == undefined ? [targetId] : current.concat([targetId]) )
        menuClose('Target');
    };

    const removeTarget = (targetId: number) => {
        setSelectedTargetIdList(current => current?.filter(value => value != targetId))
    };

    const createNewTarget = (targetName: string) => {
        // TODO: Targetの新規作成、ID取得処理
        const newTargetId = 2;
        addTarget(newTargetId);
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
        if (e.target.value.length == 1) {
            // 1文字のみ入力されている場合
            switch (e.target.value) {
                case '#':
                    // Targetの入力補完リストを表示
                    setTargetList(targetList.map(value => (
                        {
                            hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : false,
                            target: value.target
                        }
                    )));
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
                    // Targetの入力補完リストを表示
                    setTargetList(targetList.map(value => (
                        {
                            hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : false,
                            target: value.target
                        }
                    )));
                    setTargetAutoCompleteMenuAnchorEl(e.target);
                    setNewTargetName('');
                    break;
                default:
                    // 補完リストの絞り込み
                    const strAry = e.target.value.split(' ');
                    const str = strAry[strAry.length - 1];
                    switch (str.slice(0,1)) {
                        case '#':
                            setTargetList(targetList.map(value => (
                                {
                                    hidden: selectedTargetIdList != undefined && selectedTargetIdList.find(targetId => targetId == value.target.id) != undefined ? true : !value.target.name.toLowerCase().includes(str.slice(1).toLowerCase()),
                                    target: value.target
                                }
                            )));
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
            <Input
                placeholder="New to-do / term"
                inputProps={{ 'aria-label': 'description' }}
                onChange={syntaxDetection}
            />
            <br />
            {/* 選択中のTargetリスト */}
            {selectedTargetIdList && selectedTargetIdList.map(targetId =>
                <Chip
                    className={classes.targetChip}
                    key={targetId}
                    label={targetList.find(value => value.target.id == targetId)?.target.name}
                    onDelete={() => removeTarget(targetId)}
                />
            )}
            {/* 補完リストメニュー */}
            <Menu
                className={classes.menu}
                anchorEl={targetAutoCompleteMenuAnchorEl}
                keepMounted
                open={Boolean(targetAutoCompleteMenuAnchorEl)}
                onClose={() => menuClose('Target')}
            >
                {/* Target補完リスト */}
                {targetList.map(value => (
                    !value.hidden && <MenuItem onClick={() => addTarget(value.target.id)} key={value.target.id}>{value.target.name}</MenuItem>
                ))}
                {/* Target新規追加用 */}
                {newTargetName != '' && <MenuItem onClick={() => createNewTarget(newTargetName)} key={'newTarget'}>Create new target: {newTargetName}</MenuItem>}
            </Menu>
        </div>
    );
}