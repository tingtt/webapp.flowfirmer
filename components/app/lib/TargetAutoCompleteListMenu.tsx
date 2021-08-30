import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import AppDataManager from '../../../lib/app/appDataManager';
import { useHotkeys } from 'react-hotkeys-hook';

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    selectedIdList: string[] | undefined
    idListSetter: React.Dispatch<React.SetStateAction<string[] | undefined>>
    text: string
    textSetter: React.Dispatch<React.SetStateAction<string>>
};

export default function DateTimeInfoSelectMenu(props: Props) {

    const closeMenu = () => {
        props.menuAnchorElSetter(null);
    };

    // 修飾キーや上下キー以外が押されたときにメニューを閉じる
    [...'1234567890-=~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnm[]\\{}|;\':",./<>?'].map(value => {
        useHotkeys(value, () => {props.menuAnchorElSetter(null)});
    });

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(document.cookie.split('; ').find((row: string) => row.startsWith('token'))!.split('=')[1]);
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    // 選択処理
    const selectTarget = (targetId: string) => {
        props.idListSetter(current => current == undefined ? [targetId] : current.concat([targetId]) )
        closeMenu();
        // #~~を削除
        props.textSetter(current => current.replace(/\s+#\w*\s*/g, '').replace(/^#\w*\s*/g, ''));
    };

    // Target新規追加処理
    const createNewTarget = (targetName: string) => {
        // TODO: Targetの新規作成、ID取得処理
        const newTarget = appDataManager.registerTarget(targetName);
        // 新規Targetを選択
        selectTarget(newTarget.id);
        // メニューを閉じる
        props.menuAnchorElSetter(null);
    };

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
            {/* Target補完リスト */}
            {appDataManager.targets != undefined && appDataManager.targets.filter(target => {
                // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                // 末尾ブロックの文字列の先頭が'#'なら変数strに保持（含まれていなければundefined）
                const str = '#'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                if (str == undefined) {
                    props.menuAnchorElSetter(null);
                    return false;
                }

                if (str.length == 1) {
                    return !(props.selectedIdList != undefined && props.selectedIdList.find(targetId => targetId == target.id) != undefined);
                }

                return !(props.selectedIdList != undefined && props.selectedIdList.find(targetId => targetId == target.id) != undefined ? true : !target.name.toLowerCase().includes(str.slice(1).toLowerCase()));
            }).map(target => (
                <MenuItem onClick={() => selectTarget(target.id)} key={target.id}>{target.name}</MenuItem>
            ))}

            {/* Target新規追加用 */}
            {(() => {
                // 末尾に入力されたブロックを取り出し（スペース区切りでブロック分け）
                const inputValue = props.text.slice(props.text.lastIndexOf(' ') + 1);
                // 末尾ブロックの文字列の先頭が'#'なら変数strに保持（含まれていなければundefined）
                const str = '#'.includes(inputValue.slice(0,1)) ? inputValue : undefined;

                if (str == undefined || str.length == 1) {
                    return;
                }

                return <MenuItem onClick={() => createNewTarget(str.slice(1))} key={'newTarget'}>Create new target: {str.slice(1)}</MenuItem>;

            })()}
        </Menu>
    );
}
