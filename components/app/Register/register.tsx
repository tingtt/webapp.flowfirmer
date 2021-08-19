import React from 'react';
import Link from 'next/link'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: theme.spacing(64),
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: theme.spacing(8),
        },
        titleDiv: {
            marginBottom: 'unset',
        },
        nameField: {
            marginTop: theme.spacing(5),
        },
        mailField: {
            marginTop: theme.spacing(2),
        },
        passwordTextField: {
            marginTop: theme.spacing(2),
        },
        signInButton: {
            height: theme.spacing(6),
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(2),
        }
    })
);

export default function registerComponent() {

    const classes = useStyles();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");

    return (
        <div
            className={classes.root}
        >
            <h2 className={classes.titleDiv} >Create an account</h2>
            <div>
                <span>or </span><Link href="/login">sign in</Link>
            </div>
            <TextField
                className={classes.nameField}
                variant='outlined'
                placeholder='Name'
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                }}
            />
            <TextField
                className={classes.mailField}
                variant='outlined'
                placeholder='Email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                }}
            />
            <TextField
                className={classes.passwordTextField}
                variant='outlined'
                placeholder='Password'
                type='password'
                value={pass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPass(e.target.value);
                }}
            />
            <TextField
                className={classes.passwordTextField}
                variant='outlined'
                placeholder='Comfirm Password'
                type='password'
                value={confirmPass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmPass(e.target.value);
                }}
            />
            <Button
                className={classes.signInButton}
                variant="contained"
                color="primary"
            >
                Sign up
            </Button>
        </div>
    );
}