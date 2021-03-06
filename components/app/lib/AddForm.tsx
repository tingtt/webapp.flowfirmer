import React from "react"
import clsx from "clsx"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import Input from "@material-ui/core/Input"
import { Chip } from "@material-ui/core"
import { Clear, Event, Loop } from "@material-ui/icons"

import AppDataManager from "../../../lib/app/appDataManager"
import DateTimeInfoSelectMenu from "./DateTimeInfoSelectMenu"
import TargetAutoCompleteListMenu from "./TargetAutoCompleteListMenu"
import RepeatPatternAutoCompleteListMenu from "./RepeatPatternAutoCompleteListMenu"
import { ToDo } from "../../../lib/interface"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    divInput: {
      display: "flex",
    },
    input: {
      width: "100%",
    },
    form: {
      width: "100%",
    },
    dateSelecterDiv: {
      display: "inline-flex",
      verticalAlign: "middle",
      "& :hover": {
        color: theme.palette.grey[600],
      },
    },
    calendarIcon: {
      margin: "auto",
      color: theme.palette.grey.A200,
      marginLeft: theme.spacing(0.5),
      borderRadius: theme.spacing(2),
    },
    infoChipsDiv: {
      display: "flex",
    },
    targetChipDiv: {
      overflowX: "auto",
      whiteSpace: "nowrap",
    },
    targetChip: {
      margin: theme.spacing(0.5),
    },
    clearTargetChipDiv: {
      display: "inline-flex",
      verticalAlign: "middle",
      "& :hover": {
        color: theme.palette.grey[600],
      },
    },
    clearTargetChip: {
      backgroundColor: theme.palette.grey.A100,
      color: theme.palette.grey.A200,
      borderRadius: theme.spacing(2),
      height: theme.spacing(4),
      width: theme.spacing(4),
      padding: theme.spacing(0.5),
    },
    repeatPatternChipDiv: {
      marginLeft: "auto",
    },
    repeatPatternChip: {
      margin: theme.spacing(0.5),
    },
  })
)

type Props = {
  defaultSelectTargetId?: string
  setTodos: React.Dispatch<React.SetStateAction<ToDo[] | undefined>>
}

export default function AddForm(props: Props) {
  const classes = useStyles()

  const appDataManager: AppDataManager = (() => {
    try {
      return AppDataManager.generateInstance()
    } catch (e) {
      return AppDataManager.getInstance()
    }
  })()

  // ?????????
  const [inputText, setInputText] = React.useState<string>("")

  /**
   * Target
   */

  // ??????????????????????????????
  const [targetAutoCompleteMenuAnchorEl, setTargetAutoCompleteMenuAnchorEl] =
    React.useState<null | HTMLElement>(null)

  // ????????????(???????????????????????????????????????)
  const [selectedTargetIdList, setSelectedTargetIdList] = React.useState<
    string[] | undefined
  >(
    props.defaultSelectTargetId != undefined
      ? [props.defaultSelectTargetId]
      : undefined
  )

  // ????????????
  const removeTarget = (targetId?: string) => {
    if (targetId != undefined) {
      setSelectedTargetIdList((current) =>
        current?.filter((value) => value != targetId)
      )
    } else {
      setSelectedTargetIdList(undefined)
    }
  }

  /**
   * RepeatPattern
   */

  // ??????????????????????????????
  const [
    repeatPatternAutoCompleteMenuAnchorEl,
    setRepeatPatternAutoCompleteMenuAnchorEl,
  ] = React.useState<null | HTMLElement>(null)

  // ????????????
  const [selectedRepeatPattern, setRepeatPattern] = React.useState<
    | { interval: "Daily" }
    | { interval: "Weekly"; repeatDay: number[] }
    | { interval: "Monthly"; repeatDate?: number }
    | null
  >(null)

  // ????????????
  const clearRepeatPattern = () => {
    setRepeatPattern(null)
  }

  /**
   * Date
   */

  // ????????????
  const [date, setDate] = React.useState<Date | null>(null)

  // ???????????????????????????
  const [timeSetted, setTimeSetted] = React.useState<boolean>(false)

  // Term flag
  const [termFlg, setTermFlg] = React.useState(false)

  // ???????????????Term???
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  // ???????????????????????????
  const [datetimeInfoSelectMenuAnchorEl, setDatetimeInfoSelectMenuAnchorEl] =
    React.useState<null | HTMLElement>(null)

  // ??????????????????????????????????????????????????????
  const [dateStr, setDateStr] = React.useState<string>("")
  const [timeStr, setTimeStr] = React.useState<string>("")
  const [endDateStr, setEndDateStr] = React.useState<string>("")

  /**
   * syntaxDetection
   *
   * ???????????????????????????????????????????????????????????????????????????????????????
   *
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  const syntaxDetection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)

    // ???????????????????????????????????????????????????????????????????????????????????????????????????
    const inputValue = e.target.value.slice(e.target.value.lastIndexOf(" ") + 1)
    // ??????????????????????????????????????????'#', '*'????????????str???????????????????????????????????????undefined???
    const str = "#*".includes(inputValue.slice(0, 1)) ? inputValue : undefined

    if (str == undefined) {
      return
    }

    switch (true) {
      // '#'
      case /#\w*/.test(str):
        // Target?????????????????????????????????
        setTargetAutoCompleteMenuAnchorEl(e.target)
        break

      // '*'
      case /\*\w*/.test(str):
        // RepeatPattern?????????????????????????????????
        setRepeatPatternAutoCompleteMenuAnchorEl(e.target)
        break

      default:
        break
    }
  }

  const clearAll = () => {
    setInputText("")
    setDate(null)
    setDateStr("")
    setRepeatPattern(null)
    setSelectedTargetIdList(undefined)
    setTimeSetted(false)
    setTimeStr("")
    setEndDate(null)
    setEndDateStr("")
    setTermFlg(false)
  }

  const registerTodo = () => {
    // to-do??????
    // ????????????State?????????
    appDataManager
      .registerTodo(
        inputText,
        date != null ? { date: date, timeSetted: timeSetted } : undefined,
        undefined,
        selectedTargetIdList,
        undefined,
        date != null && selectedRepeatPattern != null
          ? selectedRepeatPattern
          : undefined
      )
      .then((res) => {
        console.log(res)
        if (res != false) {
          // state?????????
          props.setTodos(res)
          // ?????????????????????
          clearAll()
        }
      })
  }

  const registerTerm = () => {
    if (inputText == "" || date == null || endDate == null) {
      console.log("??????????????????????????????")
      return false
    }
    // Term??????
    appDataManager
      .registerTerm(inputText, date, endDate, selectedTargetIdList)
      .then((res) => {
        if (res != false) {
          // TODO: state?????????
          console.log(res)
          // ?????????????????????
          clearAll()
        }
      })
  }

  return (
    <div className={classes.root}>
      {/* ?????????????????? */}
      <div className={classes.divInput}>
        <form
          autoComplete="off"
          className={classes.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            if (termFlg) {
              registerTerm()
            } else {
              registerTodo()
            }
            e.preventDefault()
          }}
        >
          <Input
            name="todoName"
            placeholder="New to-do / term"
            inputProps={{ "aria-label": "description" }}
            value={inputText}
            onChange={syntaxDetection}
            className={classes.input}
          />
        </form>
        <div
          className={classes.dateSelecterDiv}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            setDatetimeInfoSelectMenuAnchorEl(e.currentTarget)
          }
        >
          <Event className={classes.calendarIcon} />
        </div>
      </div>
      <br />
      <div className={classes.infoChipsDiv}>
        {/* ????????????Target????????? */}
        <div className={classes.targetChipDiv}>
          {appDataManager.targets != undefined &&
            selectedTargetIdList != undefined &&
            selectedTargetIdList
              .filter((value) => value != "")
              .map((targetId) => (
                <Chip
                  className={classes.targetChip}
                  key={targetId}
                  label={
                    appDataManager.targets?.find(
                      (value) => value.id == targetId
                    )?.name
                  }
                  onDelete={() => removeTarget(targetId)}
                />
              ))}
          {/* 2????????????Target?????????????????????????????????Chip */}
          {selectedTargetIdList != undefined &&
            selectedTargetIdList.length >= 2 && (
              <div className={classes.clearTargetChipDiv}>
                <Clear
                  className={clsx(classes.targetChip, classes.clearTargetChip)}
                  onClick={() => removeTarget()}
                />
              </div>
            )}
        </div>
        {/* ????????????RepeatPattern */}
        {selectedRepeatPattern != null && (
          <div className={classes.repeatPatternChipDiv}>
            <Chip
              icon={<Loop />}
              className={classes.repeatPatternChip}
              onDelete={clearRepeatPattern}
              label={
                selectedRepeatPattern.interval == "Weekly"
                  ? selectedRepeatPattern.interval +
                    " (" +
                    selectedRepeatPattern.repeatDay.map(
                      (value) =>
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          value
                        ] + ","
                    ) +
                    ")"
                  : selectedRepeatPattern.interval
              }
            />
          </div>
        )}
      </div>

      {/*
                ???????????????????????????
            */}

      {/* Target??????????????? */}
      <TargetAutoCompleteListMenu
        menuAnchorEl={targetAutoCompleteMenuAnchorEl}
        menuAnchorElSetter={setTargetAutoCompleteMenuAnchorEl}
        selectedIdList={selectedTargetIdList}
        idListSetter={setSelectedTargetIdList}
        text={inputText}
        textSetter={setInputText}
      />

      {/* RepeatPattern??????????????? */}
      <RepeatPatternAutoCompleteListMenu
        menuAnchorEl={repeatPatternAutoCompleteMenuAnchorEl}
        menuAnchorElSetter={setRepeatPatternAutoCompleteMenuAnchorEl}
        selectedRepeatPattern={selectedRepeatPattern}
        repeatPatternSetter={setRepeatPattern}
        date={date}
        dateSetter={setDate}
        timeSettedBool={timeSetted}
        dateStrSetter={setDateStr}
        text={inputText}
        textSetter={setInputText}
      />

      {/* ??????????????????????????? */}
      <DateTimeInfoSelectMenu
        menuAnchorEl={datetimeInfoSelectMenuAnchorEl}
        menuAnchorElSetter={() => setDatetimeInfoSelectMenuAnchorEl(null)}
        date={date}
        dateSetter={setDate}
        timeSettedBool={timeSetted}
        timeSettedBoolSetter={setTimeSetted}
        dateStr={dateStr}
        dateStrSetter={setDateStr}
        timeStr={timeStr}
        timeStrSetter={setTimeStr}
        repeatPattern={selectedRepeatPattern}
        repeatPatternSetter={setRepeatPattern}
        termFlg={termFlg}
        termFlgSetter={setTermFlg}
        endDate={endDate}
        endDateSetter={setEndDate}
        endDateStr={endDateStr}
        endDateStrSetter={setEndDateStr}
      />
    </div>
  )
}
