import 'date-fns';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';
import AppDataManager from '../../../lib/app/appDataManager';

type Props = {
    menuAnchorEl: null | HTMLElement
    menuAnchorElSetter: React.Dispatch<React.SetStateAction<null | HTMLElement>>
    selectedIdList: number[]
    idListSetter: React.Dispatch<React.SetStateAction<number[]>>
    text: string
    textSetter: React.Dispatch<React.SetStateAction<string>>
    targetCreator: (targetName: string) => void
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    })
);

export default function DateTimeInfoSelectMenu(props: Props) {

    const classes = useStyles();

    const closeMenu = () => {
        props.menuAnchorElSetter(null);
    };

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(0)
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    // 選択処理
    const selectTarget = (targetId: number) => {
        props.idListSetter(current => current == undefined ? [targetId] : current.concat([targetId]) )
        closeMenu();
        // #~~を削除
        props.textSetter(current => current.replace(/\s+#\w*\s*/g, '').replace(/^#\w*\s*/g, ''));
    };

    return (
        <Menu
            className={classes.root}
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

                return <MenuItem onClick={() => props.targetCreator(str.slice(1))} key={'newTarget'}>Create new target: {str.slice(1)}</MenuItem>;

            })()}
        </Menu>
    );
}
