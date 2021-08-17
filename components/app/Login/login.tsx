import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';


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
        mailField: {
            marginTop: theme.spacing(5),
        },
        passwordTextField: {
            marginTop: theme.spacing(2),
        },
        msgField: {
            height: theme.spacing(6),
            display: 'flex',
            "& > span": {
                marginTop: 'auto',
                color: theme.palette.error.main
            }
        },
        signInButton: {
            height: theme.spacing(6),
            marginBottom: theme.spacing(2),
        }
    })
);

export default function loginComponent() {

    const router = useRouter();

    const classes = useStyles();

    const [email, setEmail] = React.useState("");
    const [pass, setPass] = React.useState("");

    const [message, setMessage] = React.useState("");

    // SignInボタンの切り替え
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    const checkEntries = (entryEmail?: string, entryPass?: string) => {
        if (entryEmail == undefined) {
            entryEmail = email;
        }
        if (entryPass == undefined) {
            entryPass = pass;
        }
        if (entryEmail == "" || entryPass == "" || !/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/.test(entryEmail)) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    }

    const verify = (email: string, pass: string) => {
        var args = {
            headers: {
                "Content-Type": "application/json",
            },
            email: email,
            password: pass,
        };

        axios.post("http://localhost/api/login", args)
            .then(function (response) {
                if (response.data.status == 200 && typeof response.data.token === "string") {
                    router.push(
                        {
                            pathname: "/app",
                            query: { token: response.data.token },
                        },
                        "/app"
                    );
                } else {
                    setMessage(response.data["message"]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div
            className={classes.root}
        >
            <h2 className={classes.titleDiv} >Sign in</h2>
            <div>
                <span>or </span><Link href="/register">create an account</Link>
            </div>
            <TextField
                className={classes.mailField}
                variant='outlined'
                placeholder='Email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    checkEntries(e.target.value, pass);
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
                    checkEntries(email, e.target.value);
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && !buttonDisabled) {
                        verify(email, pass);
                    }
                }}
            />
            <div className={classes.msgField}>
                <span>{message}</span>
            </div>
            <Button
                className={classes.signInButton}
                variant="contained"
                color="primary"
                onClick={() => verify(email, pass)}
                disabled={buttonDisabled}
            >
                Sign in
            </Button>
            <Link href="/login">Forgot your password?</Link>
        </div>
    );
}