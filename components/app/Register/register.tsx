import React from "react"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import { Button, TextField } from "@material-ui/core"
import { useRouter } from "next/dist/client/router"
import axios from "axios"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: theme.spacing(64),
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(8),
    },
    titleDiv: {
      marginBottom: "unset",
    },
    loginLinkSpan: {
      color: theme.palette.info.dark,
      textDecoration: "underline",
      cursor: "pointer",
      "&:active": {
        color: theme.palette.error.main,
      },
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
      display: "flex",
      "& > span": {
        marginTop: "auto",
        color: theme.palette.error.main,
      },
    },
    signInButton: {
      height: theme.spacing(6),
      marginBottom: theme.spacing(2),
    },
  })
)

export default function registerComponent() {
  const classes = useStyles()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [pass, setPass] = React.useState("")
  const [confirmPass, setConfirmPass] = React.useState("")

  const [message, setMessage] = React.useState("")

  const nameInputRef = React.useRef<HTMLInputElement>()
  const emailInputRef = React.useRef<HTMLInputElement>()
  const passInputRef = React.useRef<HTMLInputElement>()
  const confirmPassInputRef = React.useRef<HTMLInputElement>()

  const router = useRouter()

  /**
   * comparePass
   *
   * パスの一致確認
   * パラメータがない場合はstateの値を確認する
   *
   * @param pair { a: string, b: string }
   * @returns boolean
   */
  const comparePass = (pair?: { a: string; b: string }) => {
    if (pair != undefined) {
      return pair.a == pair.b
    } else {
      return pass != "" && pass == confirmPass
    }
  }

  /**
   * entryValidation
   *
   * 入力値を検証し、メッセージの更新とフォーカス移動を行う。
   *
   * @returns boolean
   */
  const entryValidation = () => {
    if (name == "") {
      setMessage("Please enter your name.")
      if (nameInputRef.current != undefined) {
        nameInputRef.current.focus()
      }
      return false
    }
    if (email == "") {
      setMessage("Please enter your email address.")
      if (emailInputRef.current != undefined) {
        emailInputRef.current.focus()
      }
      return false
    }
    if (
      !/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/.test(
        email
      )
    ) {
      setMessage("Please enter a valid email address.")
      if (emailInputRef.current != undefined) {
        emailInputRef.current.focus()
      }
      return false
    }
    if (pass == "") {
      setMessage("The password field is required.")
      if (passInputRef.current != undefined) {
        passInputRef.current.focus()
      }
      return false
    }
    if (pass.length < 8) {
      setMessage("Password must be at least 8 characters")
      if (passInputRef.current != undefined) {
        passInputRef.current.focus()
      }
      return false
    }
    if (!comparePass()) {
      setMessage("The password and confirmation password do not match.")
      if (confirmPassInputRef.current != undefined) {
        confirmPassInputRef.current.focus()
      }
      return false
    }
    setMessage("")
    return true
  }

  /**
   * register
   *
   * 入力値を検証後、APIを叩き、emailの値を保持して'/login'に遷移
   */
  const register = () => {
    if (!entryValidation()) {
      return
    }

    var args = {
      headers: {
        "Content-Type": "application/json",
      },
      name: name,
      password: pass,
      email: email,
    }

    axios
      .post("https://flowfirmer.tingtt.jp" + `/api/new_user_reg`, args)
      .then(function (response) {
        // if (response.data.status == 200 && typeof response.data.token === "string") {
        if (response.data.status == 200) {
          router.push(
            {
              pathname: "/login",
              query: { email: email },
            },
            "/login"
          )
        } else {
          setMessage(response.data["message"])
          if (
            response.data["message"] == "メールアドレスがすでに登録されています"
          ) {
            if (emailInputRef.current != undefined) {
              emailInputRef.current.focus()
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error)
        setMessage("Failed to access api.")
      })
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.titleDiv}>Create an account</h2>
      <div>
        <span>or </span>
        <span
          className={classes.loginLinkSpan}
          onClick={() => {
            router.push(
              {
                pathname: "/login",
                query: {
                  email:
                    message == "メールアドレスがすでに登録されています"
                      ? email
                      : "",
                },
              },
              "/login"
            )
          }}
        >
          sign in
        </span>
      </div>
      <TextField
        className={classes.nameField}
        variant="outlined"
        placeholder="Name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value)
        }}
        autoFocus
        inputRef={nameInputRef}
      />
      <TextField
        className={classes.mailField}
        variant="outlined"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value)
        }}
        inputRef={emailInputRef}
      />
      <TextField
        className={classes.passwordTextField}
        variant="outlined"
        placeholder="Password (more than 8 chars)"
        type="password"
        value={pass}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPass(e.target.value)
        }}
        inputRef={passInputRef}
      />
      <TextField
        className={classes.passwordTextField}
        variant="outlined"
        placeholder="Comfirm Password"
        type="password"
        value={confirmPass}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setConfirmPass(e.target.value)
        }}
        inputRef={confirmPassInputRef}
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
  )
}
