import {
  Button,
  Checkbox,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Menu,
  Theme,
} from "@material-ui/core"
import { Add } from "@material-ui/icons"
import React from "react"
import { OutcomeScheme } from "../../../../lib/interface"
import RegisterOutcomeSchemeMenu from "./RegisterOutcomeSchemeMenu"

type Props = {
  anchorEl: HTMLElement | null
  onClose: () => void
  outcomesState: {
    targetId: string
    name: string
    themeColor: {
      r: number
      g: number
      b: number
    }
    outcomes: {
      scheme: OutcomeScheme
      enable: boolean
      value: string | number
    }[]
  }[]
  outcomesStateSetter: React.Dispatch<
    React.SetStateAction<
      {
        targetId: string
        name: string
        themeColor: {
          r: number
          g: number
          b: number
        }
        outcomes: {
          scheme: OutcomeScheme
          enable: boolean
          value: string | number
        }[]
      }[]
    >
  >
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outcomeSchemeMenu: {
      "& .MuiPopover-paper": {
        width: theme.spacing(48),
      },
    },
    outcomeSchemeMenuActionsDiv: {
      marginTop: theme.spacing(1),
      display: "flex",
      justifyContent: "space-evenly",
    },
    outcomeSchemeMenuActionButton: {
      width: "45%",
    },
  })
)

export default function SelectOutcomeSchemesMenu(props: Props) {
  const classes = useStyles()

  // OutcomeScheme登録MenuのAnchor
  const [newOutcomeSchemeMenuAnchorEl, setNewOutcomeSchemeMenuAnchorEl] =
    React.useState<HTMLElement | null>(null)

  return (
    <Menu
      className={classes.outcomeSchemeMenu}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      getContentAnchorEl={null}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      <List subheader={<li />}>
        {props.outcomesState.map((target) => {
          return (
            <li key={`section-${target.targetId}`}>
              <ListSubheader>{target.name}</ListSubheader>
              {target.outcomes.map((outcome) => {
                return (
                  <ListItem
                    key={`item-${target.targetId}-${outcome.scheme.id}`}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        defaultChecked={outcome.enable}
                        onChange={() => {
                          outcome.enable = !outcome.enable
                        }}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-${outcome.scheme.id}`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={outcome.scheme.name} />
                  </ListItem>
                )
              })}
            </li>
          )
        })}
        <li key={`sectin-add`}>
          {props.outcomesState.length != 0 && (
            <ListSubheader>
              <Divider />
            </ListSubheader>
          )}
          <ListItem
            button
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              setNewOutcomeSchemeMenuAnchorEl(e.currentTarget)
            }
            key={`item-add`}
          >
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary={"New"} />
          </ListItem>
        </li>
        <li
          key={`sction-actions`}
          className={classes.outcomeSchemeMenuActionsDiv}
        >
          <Button
            className={classes.outcomeSchemeMenuActionButton}
            variant="outlined"
            color="secondary"
            onClick={props.onClose}
          >
            Cancel
          </Button>
          <Button
            className={classes.outcomeSchemeMenuActionButton}
            variant="outlined"
            color="primary"
            onClick={() => {
              props.outcomesStateSetter(props.outcomesState)
              props.onClose()
            }}
          >
            Ok
          </Button>
        </li>
      </List>
      {/* 新規成果スキーマ登録画面 */}
      <RegisterOutcomeSchemeMenu
        anchorEl={newOutcomeSchemeMenuAnchorEl}
        onClose={() => setNewOutcomeSchemeMenuAnchorEl(null)}
        outcomesState={props.outcomesState}
        outcomesStateSetter={props.outcomesStateSetter}
      />
    </Menu>
  )
}
