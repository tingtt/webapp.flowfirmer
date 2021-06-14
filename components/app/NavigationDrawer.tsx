import React from "react";
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import { NavigationState } from '../../lib/state/navigationState'
import { ClassNameMap } from "@material-ui/styles";
import AppNavigatoinListManager from "../../lib/app/appNavigationListManager";

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
            {['Profile', 'New', 'Search'].map((text) => (
                <ListItem button key={text}>
                <ListItemIcon><InboxIcon/></ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            {appNavigationManager.navigationListItems.originalItems.map((navigationState) => (
                <ListItem button key={navigationState.name} onClick={()=>props.setNav(navigationState)}>
                    <ListItemIcon><InboxIcon/></ListItemIcon>
                    <ListItemText primary={navigationState.name} />
                </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            {appNavigationManager.navigationListItems.pinnedTargets.map((navigationState) => {
                const keyStr = (navigationState.name == 'Target') ? navigationState.target.name : "";
                return (
                    <ListItem button key={keyStr} onClick={()=>props.setNav(navigationState)}>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText primary={keyStr} />
                    </ListItem>
                );
            })}
            {appNavigationManager.navigationListItems.otherTargets.map((navigationState) => {
                const keyStr = (navigationState.name == 'Target') ? navigationState.target.name : "";
                return (
                    <ListItem button key={keyStr} onClick={()=>props.setNav(navigationState)}>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText primary={keyStr} />
                    </ListItem>
                );
            })}
        </List>
        </Drawer>
    );
}