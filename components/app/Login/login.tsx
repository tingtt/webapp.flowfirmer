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
        mailField: {
            marginTop: theme.spacing(5),
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

export default function loginComponent() {

    const classes = useStyles();

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
            />
            <TextField
                className={classes.passwordTextField}
                variant='outlined'
                placeholder='Password'
                type='password'
            />
            <Button
                className={classes.signInButton}
                variant="contained"
                color="primary"
            >
                Sign in
            </Button>
            <Link href="/login">Forgot your password?</Link>
        </div>
    );
}