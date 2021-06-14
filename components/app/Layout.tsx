import React from 'react';
import clsx from 'clsx';
import NavigationDrawer from './NavigationDrawer'

import { NavigationState } from '../../lib/state/navigationState'

import { useHotkeys } from 'react-hotkeys-hook';
import { createStyles, CssBaseline, makeStyles, Theme } from '@material-ui/core';

export default function Layout() {

    const [navigationDrawerOpen, setNavigationDrawerOpen] = React.useState(true);
    const [navigationState, setNavigationState] = React.useState<NavigationState>({name: 'All'})

    // ナビゲーションドロワーの表示切り替え
    const handleDrawerToggle = () => {
        setNavigationDrawerOpen(current => !current);
    };
    useHotkeys('command+\\', handleDrawerToggle);

    const drawerWidth = 240;

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                display: 'flex',
            },
            hide: {
                display: 'none',
            },
            drawer: {
                width: drawerWidth,
                flexShrink: 0,
            },
            drawerPaper: {
                width: drawerWidth,
            },
            content: {
                flexGrow: 1,
                padding: theme.spacing(3),
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                marginLeft: -drawerWidth,
            },
            contentShift: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            },
        }),
    );

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavigationDrawer
                drawerOpen={navigationDrawerOpen}
                setDrawerOpen={setNavigationDrawerOpen}
                setNav={setNavigationState}
                classes={classes}
            />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: navigationDrawerOpen,
                })}
            >
                <p>
                    {(navigationState.name == 'Target')? navigationState.target.name : navigationState.name}
                </p>
            </main>
        </div>
    );
}