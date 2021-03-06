import {
  Button,
  Chip,
  createStyles,
  Divider,
  Input,
  InputLabel,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core"
import React from "react"
import clsx from "clsx"
import { OutcomeScheme, ToDo } from "../../../../lib/interface"
import { Add, SettingsBackupRestore } from "@material-ui/icons"
import { defaultFeeingTypes } from "../../../../utils/defaultFeelings"
import { Percentage } from "../../../../lib/interface/archive"
import AppDataManager from "../../../../lib/app/appDataManager"
import SelectOutcomeSchemesMenu from "./SelectOutcomeSchemes"

type Props = {
  todo?: ToDo
  close: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    titleDiv: {
      display: "flex",
      position: "relative",
      "& > h1": {
        marginTop: theme.spacing(2.5),
        marginBottom: theme.spacing(2.5),
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    targetListDiv: {
      position: "absolute",
      display: "flex",
      right: theme.spacing(3),
      height: "100%",
      verticalAlign: "middle",
      "& > .MuiChip-root": {
        margin: `auto ${theme.spacing(0.5)}px`,
      },
    },
    shelfDiv: {
      overflowY: "auto",
      maxHeight: "80%",
      height: theme.spacing(56),
      [theme.breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "row",
        overflowY: "unset",
      },
      "& > div": {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        flex: "1",
        minHeight: theme.spacing(40),
      },
      "& > hr": {
        height: "1px",
        width: "98%",
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(3),
        [theme.breakpoints.up("md")]: {
          height: "unset",
          width: "1px",
          marginTop: "unset",
        },
      },
    },
    shelfBlockTitleDiv: {
      position: "relative",
      display: "flex",
      justifyContent: "unset",
      [theme.breakpoints.up("md")]: {
        justifyContent: "center",
      },
      "& div": {
        textAlign: "left",
        fontSize: theme.spacing(3),
        [theme.breakpoints.up("md")]: {
          textAlign: "center",
        },
      },
    },
    shelfBlockClearButtonDiv: {
      position: "absolute",
      right: "0",
      height: "100%",
      opacity: "0.6",
      "&:hover": {
        opacity: "0.8",
      },
    },
    resultDatetimeInputDiv: {
      marginTop: theme.spacing(3),
      width: "100%",
    },
    outcomeListDiv: {
      marginTop: theme.spacing(4),
    },
    outcomeItemDiv: {
      marginTop: theme.spacing(3),
      display: "flex",
      "& > div": {
        marginTop: "auto",
        marginBottom: "auto",
      },
    },
    outcomeInput: {
      marginLeft: "auto",
    },
    outcomeItemInputNumValue: {
      width: `${theme.spacing(8)}px`,
      "& > input": {
        textAlign: "end",
      },
    },
    addOutcomeSchemeDiv: {
      justifyContent: "center",
    },
    addOutcomeSchemeButtonDiv: {
      width: "100%",
      border: `${theme.spacing(0.3)}px solid ${theme.palette.grey.A200}`,
      borderRadius: `${theme.spacing(1)}px`,
      textAlign: "center",
      "& > svg": {
        color: theme.palette.grey.A200,
        verticalAlign: "middle",
        transition: "0.2s",
      },
      transition: "0.2s",
      "&:hover": {
        borderColor: theme.palette.grey.A400,
        "& > svg": {
          color: theme.palette.grey.A400,
        },
      },
    },
    feelingListDiv: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      [theme.breakpoints.up("md")]: {
        maxHeight: theme.spacing(52),
        overflowY: "auto",
      },
      msOverflowStyle: "none" /* IE, Edge ?????? */,
      scrollbarWidth: "none" /* Firefox ?????? */,
      "&::-webkit-scrollbar": {
        /* Chrome, Safari ?????? */ display: "none",
      },
    },
    feelingListItemDiv: {
      display: "flex",
      flexDirection: "column",
      width: theme.spacing(8),
      height: theme.spacing(8),
      borderRadius: "50%",
      margin: theme.spacing(1.5),
      "& > div": {
        margin: "auto",
        whiteSpace: "nowrap",
      },
    },
    memoTextField: {
      marginTop: theme.spacing(3),
      width: "95%",
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      height: "80%",
      "& > div": {
        height: "100%",
        minHeight: theme.spacing(32),
        "& > textarea": {
          marginBottom: "auto",
        },
      },
    },
    bottomDiv: {
      display: "flex",
      justifyContent: "flex-end",
      padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0 ${theme.spacing(
        1
      )}px`,
      "& .MuiButton-root": {
        "&:not(:first-child)": {
          marginLeft: theme.spacing(1),
        },
      },
    },
  })
)

export default function ArchiveExpressiveDiary(props: Props) {
  if (props.todo == undefined) {
    return <div></div>
  }

  const classes = useStyles()

  const appDataManager = (() => {
    try {
      return AppDataManager.generateInstance()
    } catch (e) {
      return AppDataManager.getInstance()
    }
  })()

  /**
   * ??????
   */

  // ??????????????????
  const defaultResultDatetime = {
    start: (() => {
      if (
        props.todo != undefined &&
        props.todo.archived &&
        appDataManager.archives != undefined
      ) {
        const archived = appDataManager.archives.find(
          (value) =>
            value.refInfo.refType == "ToDo" &&
            value.refInfo.ref.id == props.todo!.id
        )
        if (archived != undefined && archived.refInfo.refType == "ToDo") {
          return `${archived.refInfo.startDateTime.getFullYear()}-${`0${
            archived.refInfo.startDateTime.getMonth() + 1
          }`.slice(-2)}-${`0${archived.refInfo.startDateTime.getDate()}`.slice(
            -2
          )}T${`0${archived.refInfo.startDateTime.getHours()}`.slice(
            -2
          )}:${`0${archived.refInfo.startDateTime.getMinutes()}`.slice(-2)}`
        }
      }
      if (
        props.todo.startDatetimeScheduled != undefined &&
        props.todo.timeInfoExisted
      ) {
        return `${props.todo.startDatetimeScheduled.getFullYear()}-${`0${
          props.todo.startDatetimeScheduled.getMonth() + 1
        }`.slice(-2)}-${`0${props.todo.startDatetimeScheduled.getDate()}`.slice(
          -2
        )}T${`0${props.todo.startDatetimeScheduled.getHours()}`.slice(
          -2
        )}:${`0${props.todo.startDatetimeScheduled.getMinutes()}`.slice(-2)}`
      }
      return ""
    })(),
    end: (() => {
      if (
        props.todo != undefined &&
        props.todo.archived &&
        appDataManager.archives != undefined
      ) {
        const archived = appDataManager.archives.find(
          (value) =>
            value.refInfo.refType == "ToDo" &&
            value.refInfo.ref.id == props.todo!.id
        )
        if (archived != undefined && archived.refInfo.refType == "ToDo") {
          const endDatetime = new Date(
            archived.refInfo.startDateTime.getTime() +
              archived.refInfo.processingTime * 60 * 1000
          )
          return `${endDatetime.getFullYear()}-${`0${
            endDatetime.getMonth() + 1
          }`.slice(-2)}-${`0${endDatetime.getDate()}`.slice(
            -2
          )}T${`0${endDatetime.getHours()}`.slice(
            -2
          )}:${`0${endDatetime.getMinutes()}`.slice(-2)}`
        }
      }
      if (
        props.todo.startDatetimeScheduled != undefined &&
        props.todo.timeInfoExisted &&
        props.todo.processingTimeScheduled != undefined
      ) {
        // ????????????????????????????????????
        if (
          props.todo.startDatetimeScheduled.getMinutes() +
            props.todo.processingTimeScheduled >=
          60
        ) {
          const endDatetime = new Date(
            props.todo.startDatetimeScheduled.getTime() +
              props.todo.processingTimeScheduled * 60 * 1000
          )
          return `${endDatetime.getFullYear()}-${`0${
            endDatetime.getMonth() + 1
          }`.slice(-2)}-${`0${endDatetime.getDate()}`.slice(
            -2
          )}T${`0${endDatetime.getHours()}`.slice(
            -2
          )}:${`0${endDatetime.getMinutes()}`.slice(-2)}`
        } else {
          return `${props.todo.startDatetimeScheduled.getFullYear()}-${`0${
            props.todo.startDatetimeScheduled.getMonth() + 1
          }`.slice(
            -2
          )}-${`0${props.todo.startDatetimeScheduled.getDate()}`.slice(
            -2
          )}T${`0${props.todo.startDatetimeScheduled.getHours()}`.slice(
            -2
          )}:${`0${
            props.todo.startDatetimeScheduled.getMinutes() +
            props.todo.processingTimeScheduled
          }`.slice(-2)}`
        }
      }
      return ""
    })(),
  }

  // ???
  const [resultDatetimeStart, setResultDatetimeStart] = React.useState<string>(
    defaultResultDatetime.start
  )
  const [resultDatetimeEnd, setResultDatetimeEnd] = React.useState<string>(
    defaultResultDatetime.end
  )

  // ??????????????????
  const resetResultDatetime = () => {
    setResultDatetimeStart(defaultResultDatetime.start)
    setResultDatetimeEnd(defaultResultDatetime.end)
  }

  /**
   * ??????
   */

  // ??????????????????????????????
  const defaultResultOutcomes = (() => {
    if (props.todo.targetList == undefined) {
      return []
    }
    const filtered = props.todo.targetList.filter(
      (target) => target.outcomeSchemes != undefined
    )
    if (filtered.length == 0) {
      return []
    }
    return filtered
      .map((target) => target.outcomeSchemes!)
      .reduce((previous, current) => previous.concat(current))
  })().map((scheme) => {
    return {
      scheme: scheme,
      value: (() => {
        var defaultValue = scheme.defaultValue
        if (
          props.todo != undefined &&
          props.todo.archived &&
          appDataManager.archives != undefined
        ) {
          const archivedOutcomes = appDataManager.archives.find(
            (value) =>
              value.refInfo.refType == "ToDo" &&
              value.refInfo.ref.id == props.todo!.id
          )?.outcomes
          if (archivedOutcomes != undefined) {
            const archivedOutcome = archivedOutcomes.find(
              (outcome) => outcome.scheme.id == scheme.id
            )
            if (archivedOutcome != undefined) {
              defaultValue = archivedOutcome.value
            }
          }
        }
        if (scheme.statisticsRule == "String") {
          return defaultValue != undefined ? (defaultValue as string) : ""
        }
        return defaultValue != undefined ? (defaultValue as number) : 0
      })(),
    }
  })

  const defaultOutcomesGroupedInTargets = (() => {
    if (
      props.todo.targetList == undefined ||
      props.todo.targetList.filter(
        (target) => target.outcomeSchemes != undefined
      ).length == 0
    ) {
      return []
    }
    return props.todo.targetList.map((target) => {
      return {
        targetId: target.id,
        name: target.name,
        themeColor: target.themeColor,
        outcomes:
          target.outcomeSchemes == undefined
            ? []
            : target.outcomeSchemes.map((scheme) => {
                return {
                  scheme: scheme,
                  enable: false,
                  value: (() => {
                    // ??????????????????????????????
                    var defaultValue = scheme.defaultValue
                    // ??????????????????????????????????????????????????????????????????????????????
                    if (
                      props.todo != undefined &&
                      props.todo.archived &&
                      appDataManager.archives != undefined
                    ) {
                      const archivedOutcomes = appDataManager.archives.find(
                        (value) =>
                          value.refInfo.refType == "ToDo" &&
                          value.refInfo.ref.id == props.todo!.id
                      )?.outcomes
                      if (archivedOutcomes != undefined) {
                        const archivedOutcome = archivedOutcomes.find(
                          (outcome) => outcome.scheme.id == scheme.id
                        )
                        if (archivedOutcome != undefined) {
                          defaultValue = archivedOutcome.value
                        }
                      }
                    }
                    if (scheme.statisticsRule == "String") {
                      return defaultValue != undefined
                        ? (defaultValue as string)
                        : ""
                    }
                    return defaultValue != undefined
                      ? (defaultValue as number)
                      : 0
                  })(),
                }
              }),
      }
    })
  })()

  const [resultOutcomes, setResultOutcomes] = React.useState(
    defaultResultOutcomes
  )

  const [outcomesGroupedInTargets, setOutcomesGroupedInTargets] =
    React.useState(defaultOutcomesGroupedInTargets)

  // OutcomeScheme??????Menu???Anchor
  const [selectOutcomeSchemeMenuAnchorEl, setSelectOutcomeSchemeMenuAnchorEl] =
    React.useState<HTMLElement | null>(null)

  // ??????????????????
  const resetResultOutcomes = () => {
    setResultOutcomes(defaultResultOutcomes)
  }

  /**
   * ??????
   */

  const defaultFeels = (() => {
    if (props.todo.archived && appDataManager.archives != undefined) {
      const feels = appDataManager.archives.find(
        (value) =>
          value.refInfo.refType == "ToDo" &&
          value.refInfo.ref.id == props.todo!.id
      )?.feelingList
      return feels != undefined ? feels : []
    }
    return []
  })()

  // ?????????
  const feels = defaultFeeingTypes.map((value) => {
    var defaultSelected = false
    var defaultPositivePercent = value.defaultPositivePercent
    var defaultNegativePercent = value.defaultNegativePercent
    const selected = defaultFeels.find((feel) => feel.feeling.id == value.id)
    if (selected != undefined) {
      defaultSelected = true
      defaultPositivePercent = selected.positivePercent
      defaultNegativePercent = selected.negativePercent
    }
    const [selectedState, setSelectedState] =
      React.useState<boolean>(defaultSelected)
    const [positivePercent, setPositivePercent] = React.useState<Percentage>(
      defaultPositivePercent
    )
    const [negativePercent, setNegativePercent] = React.useState<Percentage>(
      defaultNegativePercent
    )
    return {
      feel: value,
      selectedState: {
        value: selectedState,
        toggle: () => setSelectedState((current) => !current),
      },
      positivePercentState: {
        value: positivePercent,
        set: setPositivePercent,
      },
      negativePercentState: {
        value: negativePercent,
        set: setNegativePercent,
      },
    }
  })

  // ??????????????????
  const resetFeelSelectStates = () => {
    feels.forEach((value) => {
      if (
        value.selectedState.value !=
        defaultFeels.some((feel) => feel.feeling.id == value.feel.id)
      ) {
        value.selectedState.toggle()
        const defaultFeel = defaultFeels.find(
          (feel) => feel.feeling.id == value.feel.id
        )
        if (defaultFeel != undefined) {
          value.positivePercentState.set(defaultFeel.positivePercent)
          value.negativePercentState.set(defaultFeel.negativePercent)
        }
      }
    })
  }

  /**
   * ??????????????????
   */

  const defaultMemoValue = (() => {
    var text: string | undefined
    if (props.todo.archived && appDataManager.archives != undefined) {
      text = appDataManager.archives.find(
        (value) =>
          value.refInfo.refType == "ToDo" &&
          value.refInfo.ref.id == props.todo!.id
      )?.text
    }
    return text != undefined ? text : ""
  })()

  // ???
  const [memo, setMemo] = React.useState<string>(defaultMemoValue)

  // ??????????????????
  const resetMemo = () => {
    setMemo(defaultMemoValue)
  }

  return (
    <div className={classes.root}>
      {/* ???????????????ToDo??????, Target????????? */}
      <div className={classes.titleDiv}>
        <h1>{props.todo.name}</h1>
        <div className={classes.targetListDiv}>
          {props.todo.targetList?.map((target) => {
            const classChipColorClasses = makeStyles((_: Theme) =>
              createStyles({
                chipColor: {
                  backgroundColor: `rgba(${target.themeColor.r},${target.themeColor.g},${target.themeColor.b},0.5)`,
                },
              })
            )()
            return (
              <Chip
                className={classChipColorClasses.chipColor}
                key={target.id}
                label={target.name}
              />
            )
          })}
        </div>
      </div>
      {/* ???????????????????????? */}
      <div className={classes.shelfDiv}>
        {/* ????????????????????? */}
        <div>
          <div className={classes.shelfBlockTitleDiv}>
            <div>Result</div>
            {(resultDatetimeStart != defaultResultDatetime.start ||
              resultDatetimeEnd != defaultResultDatetime.end ||
              resultOutcomes.some(
                (resultOutcome) =>
                  resultOutcome.value !=
                  defaultResultOutcomes.find(
                    (value) => value.scheme.id == resultOutcome.scheme.id
                  )!.value
              )) && (
              <div className={classes.shelfBlockClearButtonDiv}>
                <SettingsBackupRestore
                  onClick={() => {
                    resetResultDatetime()
                    resetResultOutcomes()
                  }}
                />
              </div>
            )}
          </div>
          {/* ???????????? */}
          <TextField
            className={classes.resultDatetimeInputDiv}
            label="Start"
            type="datetime-local"
            value={resultDatetimeStart}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setResultDatetimeStart(e.target.value)
              // ??????????????????????????????
              if (e.target.value > resultDatetimeEnd) {
                setResultDatetimeEnd(e.target.value)
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          {/* ???????????? */}
          <TextField
            className={classes.resultDatetimeInputDiv}
            label="End"
            type="datetime-local"
            value={resultDatetimeEnd}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setResultDatetimeEnd(e.target.value)
              // ??????????????????????????????
              if (resultDatetimeStart > e.target.value) {
                setResultDatetimeStart(e.target.value)
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          {/* ?????? */}
          <div className={classes.outcomeListDiv}>
            <InputLabel>Outcomes</InputLabel>
            {outcomesGroupedInTargets.map((target) => {
              return target.outcomes
                .filter((outcome) => outcome.enable)
                .map((outcome) => {
                  if (outcome.scheme.statisticsRule == "String") {
                    return (
                      <div
                        className={classes.outcomeItemDiv}
                        key={`${props.todo?.id}${outcome.scheme.id}`}
                      >
                        <div>{outcome.scheme.name}</div>
                        <Input
                          value={outcome.value}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOutcomesGroupedInTargets((current) =>
                              current.map((target) => {
                                target.outcomes = target.outcomes.map(
                                  (currentOutcome) => {
                                    if (
                                      currentOutcome.scheme.id !=
                                      outcome.scheme.id
                                    ) {
                                      return currentOutcome
                                    }
                                    currentOutcome.value = e.target.value
                                    return currentOutcome
                                  }
                                )
                                return target
                              })
                            )
                          }}
                        />
                      </div>
                    )
                  }
                  return (
                    <div
                      className={classes.outcomeItemDiv}
                      key={`${props.todo?.id}${outcome.scheme.id}`}
                    >
                      <div>{outcome.scheme.name}</div>
                      <Input
                        type="number"
                        value={outcome.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setOutcomesGroupedInTargets((current) =>
                            current.map((target) => {
                              target.outcomes = target.outcomes.map(
                                (currentOutcome) => {
                                  if (
                                    currentOutcome.scheme.id !=
                                    outcome.scheme.id
                                  ) {
                                    return currentOutcome
                                  }
                                  currentOutcome.value = e.target.value
                                  return currentOutcome
                                }
                              )
                              return target
                            })
                          )
                        }}
                        className={clsx(
                          classes.outcomeItemInputNumValue,
                          classes.outcomeInput
                        )}
                      />
                      <div>
                        {outcome.scheme.unitName != undefined
                          ? outcome.scheme.unitName
                          : ""}
                      </div>
                    </div>
                  )
                })
            })}
            <div
              className={clsx(
                classes.outcomeItemDiv,
                classes.addOutcomeSchemeDiv
              )}
            >
              <div
                className={classes.addOutcomeSchemeButtonDiv}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  setSelectOutcomeSchemeMenuAnchorEl(e.currentTarget)
                }
              >
                <Add />
              </div>
            </div>
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        {/* ???????????? */}
        <div>
          <div className={classes.shelfBlockTitleDiv}>
            <div>Feelings</div>
            {feels.some(
              (value) =>
                value.selectedState.value !=
                defaultFeels.some((feel) => feel.feeling.id == value.feel.id)
            ) && (
              <div className={classes.shelfBlockClearButtonDiv}>
                <SettingsBackupRestore onClick={resetFeelSelectStates} />
              </div>
            )}
          </div>
          <div className={classes.feelingListDiv}>
            {feels
              .sort((a, b) => {
                return 100 -
                  a.feel.defaultPositivePercent +
                  a.feel.defaultNegativePercent >
                  100 -
                    b.feel.defaultPositivePercent +
                    b.feel.defaultNegativePercent
                  ? 1
                  : -1
              })
              .map((value) => {
                // RBG: (255, 255, 0) -> (0, 255, 0) -> (0, 255, 255) -> (0, 0, 255)
                // Emotion: (100, 0) -> (0, 100)
                var r = 255
                var g = 255
                var b = 0
                if (
                  (100 -
                    value.feel.defaultPositivePercent +
                    value.feel.defaultNegativePercent) /
                    2 <=
                  33
                ) {
                  r = Math.round(
                    255 *
                      (1 -
                        (100 -
                          value.feel.defaultPositivePercent +
                          value.feel.defaultNegativePercent) /
                          2 /
                          33)
                  )
                  g = 255
                  b = 0
                } else if (
                  (100 -
                    value.feel.defaultPositivePercent +
                    value.feel.defaultNegativePercent) /
                    2 <=
                  67
                ) {
                  r = 0
                  g = 255
                  b = Math.round(
                    255 *
                      (((100 -
                        value.feel.defaultPositivePercent +
                        value.feel.defaultNegativePercent) /
                        2 -
                        33) /
                        34)
                  )
                } else {
                  r = 0
                  g = Math.round(
                    255 *
                      (1 -
                        ((100 -
                          value.feel.defaultPositivePercent +
                          value.feel.defaultNegativePercent) /
                          2 -
                          67) /
                          33)
                  )
                  b = 255
                }
                // style?????????
                const emotionColorClasses = makeStyles((theme: Theme) =>
                  createStyles({
                    emotionColorDiv: {
                      backgroundColor: `rgba(${r},${g},${b},0.8)`,
                    },
                    selectedEmotionItemDiv: {
                      "&:before, &:after": {
                        content: '""',
                        width: theme.spacing(2),
                        height: theme.spacing(3),
                        position: "relative",
                        display: "inline-block",
                      },
                      "&:before": {
                        borderLeft: "solid 1px #5767bf",
                        borderTop: "solid 1px #5767bf",
                      },
                      "&:after": {
                        borderRight: "solid 1px #5767bf",
                        borderBottom: "solid 1px #5767bf",
                        marginTop: "auto",
                        marginLeft: "auto",
                      },
                    },
                    greyScale: {
                      filter: "grayscale(0.9)",
                    },
                  })
                )()
                return (
                  <div
                    key={value.feel.id}
                    className={clsx(
                      classes.feelingListItemDiv,
                      emotionColorClasses.emotionColorDiv,
                      {
                        [emotionColorClasses.selectedEmotionItemDiv]:
                          value.selectedState.value,
                      },
                      {
                        [emotionColorClasses.greyScale]:
                          feels.filter((value) => value.selectedState.value)
                            .length == 3 && !value.selectedState.value,
                      }
                    )}
                    onClick={() => {
                      if (value.selectedState.value) {
                        value.selectedState.toggle()
                      } else if (
                        feels.filter((value) => value.selectedState.value)
                          .length < 3
                      ) {
                        value.selectedState.toggle()
                      }
                    }}
                  >
                    <div>{value.feel.name}</div>
                  </div>
                )
              })}
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        {/* ?????????????????? */}
        <div>
          <div className={classes.shelfBlockTitleDiv}>
            <div>Memo</div>
            {memo != defaultMemoValue && (
              <div className={classes.shelfBlockClearButtonDiv}>
                <SettingsBackupRestore onClick={resetMemo} />
              </div>
            )}
          </div>
          <TextField
            className={classes.memoTextField}
            value={memo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMemo(e.target.value)
            }}
            multiline
            variant="outlined"
          />
        </div>
      </div>
      {/* ??????????????? */}
      <div className={classes.bottomDiv}>
        {/* ??????????????? */}
        <Button color="secondary" onClick={() => props.close()}>
          Cancel
        </Button>
        {/* ?????? */}
        <Button
          color="primary"
          onClick={() => {
            if (props.todo?.archived) {
              props.close()
              return
            }
            appDataManager.registerArchive(
              props.todo?.targetList,
              (() => {
                let outcomes: {
                  scheme: OutcomeScheme
                  value: string | number
                }[] = []
                outcomesGroupedInTargets
                  .filter((target) =>
                    target.outcomes.some((outcome) => outcome.enable)
                  )
                  .forEach((target) => {
                    target.outcomes
                      .filter((outcome) => outcome.enable)
                      .forEach((outcome) => {
                        outcomes.push({
                          scheme: outcome.scheme,
                          value: outcome.value,
                        })
                      })
                  })
                return outcomes
              })(),
              memo,
              feels.filter((feel) => feel.selectedState.value).length > 0
                ? feels
                    .filter((feel) => feel.selectedState.value)
                    .map((feel) => {
                      return {
                        feeling: feel.feel,
                        positivePercent: feel.positivePercentState.value,
                        negativePercent: feel.negativePercentState.value,
                      }
                    })
                : undefined,
              {
                refType: "ToDo",
                ref: props.todo!,
                startDateTime: new Date(resultDatetimeStart),
                processingTime:
                  (new Date(resultDatetimeEnd).getTime() -
                    new Date(resultDatetimeStart).getTime()) /
                  1000 /
                  60,
              }
            )
            props.close()
          }}
        >
          Archive
        </Button>
      </div>
      {/* ??????????????????????????????????????? */}
      <SelectOutcomeSchemesMenu
        anchorEl={selectOutcomeSchemeMenuAnchorEl}
        onClose={() => setSelectOutcomeSchemeMenuAnchorEl(null)}
        outcomesState={outcomesGroupedInTargets}
        outcomesStateSetter={setOutcomesGroupedInTargets}
      />
    </div>
  )
}
