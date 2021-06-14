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

	const navigationListDefaultItem = (navigationState: NavigationState, setNav: React.Dispatch<React.SetStateAction<NavigationState>>) => {
		return (
			<ListItem button key={navigationState.name} onClick={()=>setNav(navigationState)}>
				<ListItemIcon><InboxIcon/></ListItemIcon>
				<ListItemText primary={navigationState.name} />
			</ListItem>
		);
	}

	const navigationListTargetItem = (navigationState: NavigationState, setNav: React.Dispatch<React.SetStateAction<NavigationState>>) => {
		const keyStr = (navigationState.name == 'Target') ? navigationState.target.name : "";
		return (
			<ListItem button key={keyStr} onClick={()=>setNav(navigationState)}>
				<ListItemIcon><InboxIcon/></ListItemIcon>
				<ListItemText primary={keyStr} />
			</ListItem>
		);
	}

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
                navigationListDefaultItem(navigationState, props.setNav)
            ))}
        </List>
        <Divider />
        <List>
            {appNavigationManager.navigationListItems.pinnedTargets.map((navigationState) => (
                navigationListTargetItem(navigationState, props.setNav)
            ))}
            {appNavigationManager.navigationListItems.otherTargets.map((navigationState) => (
                navigationListTargetItem(navigationState, props.setNav)
            ))}
        </List>
        </Drawer>
    );
}