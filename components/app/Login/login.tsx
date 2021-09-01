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
    const {query} = router;

    const classes = useStyles();

    const [email, setEmail] = React.useState(typeof query.email == "string" ? query.email : "");
    const [pass, setPass] = React.useState("");

    const [message, setMessage] = React.useState("");

    const emailInputRef = React.useRef<HTMLInputElement>();
    const passInputRef = React.useRef<HTMLInputElement>();

    /**
     * entryValidation
     *
     * 入力値を検証し、メッセージの更新とフォーカス移動を行う。
     *
     * @returns boolean
     */
    const entryValidation = () => {
        if (email == "") {
            setMessage("Please enter your email address.");
            if (emailInputRef.current != undefined) {
                emailInputRef.current.focus();
            }
            return false;
        }
        if (!/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/.test(email)) {
            setMessage("Please enter a valid email address.");
            if (emailInputRef.current != undefined) {
                emailInputRef.current.focus();
            }
            return false;
        }
        if (pass == "") {
            setMessage("Please enter your password.");
            if (passInputRef.current != undefined) {
                passInputRef.current.focus();
            }
            return false;
        }
        setMessage("");
        return true;
    }

    /**
     * verify
     *
     * 入力値を検証後、APIを叩き、tokenを取得して'/app'に遷移
     *
     * @param email string
     * @param pass string
     */
    const verify = (email: string, pass: string) => {
        if (!entryValidation()) {
            return;
        }

        var args = {
            headers: {
                "Content-Type": "application/json",
            },
            email: email,
            password: pass,
        };

        axios.post(`/api/login`, args)
            .then(function (response) {
                if (response.data.status == 200 && typeof response.data.token === "string") {
                    // tokenをブラウザのcookieに保持
                    document.cookie = `token=${response.data.token}`
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
                setMessage("Failed to access api.");
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
                }}
                inputRef={emailInputRef}
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
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        verify(email, pass);
                    }
                }}
                inputRef={passInputRef}
            />
            <div className={classes.msgField}>
                <span>{message}</span>
            </div>
            <Button
                className={classes.signInButton}
                variant="contained"
                color="primary"
                onClick={() => verify(email, pass)}
            >
                Sign in
            </Button>
            <Link href="/login">Forgot your password?</Link>
        </div>
    );
}