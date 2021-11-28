import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { ToDo } from "../../../lib/interface"
import { Checkbox, Paper } from "@material-ui/core"

type Props = {
  todo: ToDo
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      width: "95%",
      height: "40px",
      "& > *": {
        margin: theme.spacing(1),
        width: "98%",
        display: "flex",
      },
    },

    checkbox: {
      flexGrow: 1,
      marginTop: "auto",
      marginBottom: "auto",
    },

    text: {
      flexGrow: 4,
      marginTop: "auto",
      marginBottom: "auto",
      cursor: "alias",
    },
  })
)

export default function ToDoBox(props: Props) {
  const classes = useStyles(props)

  const [checked, setChecked] = React.useState<boolean>(props.todo.completed)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return (
    <div className={classes.root}>
      <Paper variant="elevation">
        <Checkbox
          className={classes.checkbox}
          id="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <div className={classes.text}>{props.todo.name}</div>
        {/* <ToDoDetail todo={props.todo} */}
      </Paper>
    </div>
  )
}
