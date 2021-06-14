import React from "react";
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';

import { NavigationState } from '../../lib/state/navigationState'
import { ClassNameMap } from "@material-ui/styles";
import AppNavigatoinListManager from "../../lib/app/appNavigationListManager";
import { AccountCircle, AddCircle, Bookmark, BookmarkBorder, Search, Today, ViewWeek, AllInbox, Dashboard } from "@material-ui/icons";

type Props = {
	drawerOpen: boolean
	setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
	setNav: React.Dispatch<React.SetStateAction<NavigationState>>
	classes: ClassNameMap
}

export default function NavigationDrawer(props: Props) {
    const classes = props.classes;

    const appNavigationManager = AppNavigatoinListManager.generateInstance(0);

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.drawerOpen}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <Divider />
            <List>
                <ListItem button key={'Profile'}>
                    <ListItemIcon><AccountCircle/></ListItemIcon>
                    <ListItemText primary={'Profile'}/>
                </ListItem>
                <ListItem button key={'New'}>
                    <ListItemIcon><AddCircle/></ListItemIcon>
                    <ListItemText primary={'New'}/>
                </ListItem>
                <ListItem button key={'Search'}>
                    <ListItemIcon><Search/></ListItemIcon>
                    <ListItemText primary={'Search'}/>
                </ListItem>
            </List>
            <Divider />
            <List>
                {appNavigationManager.navigationListItems.originalItems.map((navigationState) => (
                    <ListItem button key={navigationState.name} onClick={()=>props.setNav(navigationState)}>
                        <ListItemIcon>
                            {navigationState.name == 'All' && <AllInbox/>}
                            {navigationState.name == 'Today' && <Today/>}
                            {navigationState.name == 'Weekly' && <ViewWeek/>}
                            {navigationState.name == 'Dashboard' && <Dashboard/>}
                        </ListItemIcon>
                        <ListItemText primary={navigationState.name} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {[...appNavigationManager.navigationListItems.pinnedTargets, ...appNavigationManager.navigationListItems.otherTargets].map((navigationState) => {
                    if (navigationState.name != 'Target') {
                        throw new Error("NavigatoinState is not correct.");
                    }
                    return (
                        <ListItem button key={navigationState.target.name} onClick={()=>props.setNav(navigationState)}>
                            <ListItemIcon>{(navigationState.target.pinnedAtNavigationList) ? <Bookmark/> : <BookmarkBorder/>}</ListItemIcon>
                            <ListItemText primary={navigationState.target.name} />
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
}