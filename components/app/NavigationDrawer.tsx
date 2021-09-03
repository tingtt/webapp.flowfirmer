import React from "react";
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { NavigationState } from '../../lib/state/navigationState'
import { ClassNameMap } from "@material-ui/styles";
import AppNavigatoinListManager from "../../lib/app/appNavigationListManager";
import AppDataManager from "../../lib/app/appDataManager";
import { AccountCircle, AddCircle, Bookmark, BookmarkBorder, Search, Today, ViewWeek, AllInbox, Dashboard } from "@material-ui/icons";

type Props = {
	drawerOpen: boolean
	setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
	setNav: React.Dispatch<React.SetStateAction<NavigationState>>
	classes: ClassNameMap
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        targetListDiv: {
            overflow: 'auto',
        },
        bottomItem: {
            marginTop: 'auto',
        }
    })
);

export default function NavigationDrawer(props: Props) {
    const layoutClasses = props.classes;
    const classes = useStyles();

    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance();
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    const appNavigationManager: AppNavigatoinListManager = (() => {
        try {
            return  AppNavigatoinListManager.generateInstance()
        } catch (e) {
            return  AppNavigatoinListManager.getInstance();
        }
    })();

    return (
        <Drawer
            className={layoutClasses.drawer}
            variant="persistent"
            anchor="left"
            open={props.drawerOpen}
            classes={{
            paper: layoutClasses.drawerPaper,
            }}
        >
            <Divider />
            <List>
                <ListItem button key={'Profile'}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary={'Profile'}/>
                </ListItem>
                <ListItem button key={'New'}>
                    <ListItemIcon>
                        <AddCircle />
                    </ListItemIcon>
                    <ListItemText primary={'New'} />
                </ListItem>
                <ListItem button key={'Search'}>
                    <ListItemIcon>
                        <Search />
                    </ListItemIcon>
                    <ListItemText primary={'Search'} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {/* ナビゲーションリスト */}
                {/* TargetとDashboard以外を抽出して表示 */}
                {appNavigationManager.navigationListItems.filter(value => value.name != 'Target' && value.name != 'Dashboard').map((navigationState) => (
                    <ListItem button key={navigationState.name} onClick={()=>props.setNav(navigationState)}>
                        <ListItemIcon>
                            {/* アイコンの切り替え */}
                            {navigationState.name == 'All' ? <AllInbox /> : navigationState.name == 'Today' ? <Today /> : navigationState.name == 'Weekly' ? <ViewWeek /> : null}
                        </ListItemIcon>
                        <ListItemText primary={navigationState.name} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <div
                className={classes.targetListDiv}
            >
                <List>
                    {/* Targetのナビゲーションリスト */}
                    {appDataManager.targets != undefined && appDataManager.targets.filter(value => !value.hiddenAtNavigationList)
                    // pinされているTargetを優先表示
                    .sort((a, b) => a.pinnedAtNavigationList == b.pinnedAtNavigationList ? 0 : !a.pinnedAtNavigationList && b.pinnedAtNavigationList ? 1 : -1)
                    .map(value => ({name: 'Target', targetId: value.id} as NavigationState)).map((navigationState) => {
                        const target = appDataManager.targets!.find(target => target.id == (navigationState.name == 'Target' ? navigationState.targetId : ""));
                        // Targetのチェック
                        if (target === undefined || target === null) {
                            throw new Error(
                                `Expected 'val' to be defined, but received ${target}`
                            );
                        }
                        return (
                            <ListItem button key={target.name} onClick={()=>props.setNav(navigationState)}>
                                <ListItemIcon>
                                    {/* ピン留めされているかの判定でアイコンを切り替え */}
                                    {(navigationState.name == 'Target' && target.pinnedAtNavigationList) ? <Bookmark /> : <BookmarkBorder />}
                                </ListItemIcon>
                                <ListItemText primary={target.name} />
                            </ListItem>
                        );
                    })}
                </List>
            </div>
            <div
                className={classes.bottomItem}
            >
                <Divider />
                <List>
                    {/* Dashboard */}
                    {/* navigationListItemにDashboardが含まれていて、hiddenがundefinedの場合に表示 */}
                    {appNavigationManager.navigationListItems.filter(value => value.name == 'Dashboard' && value.hidden == undefined).length != 0 &&
                        <ListItem button key={'Dashboard'} onClick={()=>props.setNav({name: 'Dashboard'})}>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItem>
                    }
                </List>
            </div>
        </Drawer>
    );
}