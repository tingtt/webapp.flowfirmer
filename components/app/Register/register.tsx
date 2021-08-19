import React from 'react';
import Link from 'next/link'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
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
        nameField: {
            marginTop: theme.spacing(5),
        },
        mailField: {
            marginTop: theme.spacing(2),
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

export default function registerComponent() {

    const classes = useStyles();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");

    const [message, setMessage] = React.useState("");

    const router = useRouter();

    /**
     * comparePass
     *
     * パスの一致確認
     * パラメータがない場合はstateの値を確認する
     *
     * @param pair { a: string, b: string }
     * @returns boolean
     */
    const comparePass = (pair?: { a: string, b: string }) => {
        if (pair != undefined) {
            return pair.a == pair.b;
        } else {
            return pass != "" && pass == confirmPass;
        }
    }

    /**
     * entryValidation
     *
     * @returns boolean
     */
    const entryValidation = () => {
        if (name == "") {
            setMessage("Please enter your name.");
            return false;
        }
        if (email == "") {
            setMessage("Please enter your email address.");
            return false;
        }
        if (!/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/.test(email)) {
            setMessage("Please enter a valid email address.");
            return false;
        }
        if (pass == "") {
            setMessage("The password field is required.");
            return false;
        }
        if (pass.length < 8) {
            setMessage("Password must be at least 8 characters");
            return false;
        }
        if (!comparePass()) {
            setMessage("The password and confirmation password do not match.");
            return false;
        }
        return true;
    }

    const register = () => {
        if (!entryValidation()) {
            return;
        }

        var args = {
            headers: {
                "Content-Type": "application/json",
            },
            name: name,
            password: pass,
            email: email
        };

        axios.post("http://localhost/api/new_user_reg", args)
            .then(function (response) {
                // if (response.data.status == 200 && typeof response.data.token === "string") {
                if (response.data.status == 200) {
                    router.push(
                        {
                            pathname: "/login",
                            query: { email: email },
                        },
                        "/login"
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
                autoFocus
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
                placeholder='Password (more than 8 chars)'
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
            <div className={classes.msgField}>
                <span>{message}</span>
            </div>
            <Button
                className={classes.signInButton}
                variant="contained"
                color="primary"
                onClick={register}
            >
                Sign up
            </Button>
        </div>
    );
}