import { Button, createStyles, FormControl, InputLabel, makeStyles, Menu, MenuItem, Select, TextField, Theme } from "@material-ui/core";
import React from "react";
import AppDataManager from "../../../../lib/app/appDataManager";
import { OutcomeScheme } from "../../../../lib/interface";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        outcomeSchemeTargetSelectMenu: {
            "& .MuiPopover-paper": {
                width: theme.spacing(48),
                "& > .MuiList-root": {
                    textAlign: 'center',
                }
            }
        },
        formControlDiv: {
            width: '85%',
            margin: "0 auto",
            marginBottom: theme.spacing(2),
            textAlign: 'start',
        },
        newOutcomeInputDiv: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: theme.spacing(2),
        },
        targetSelector: {
            width: '100%',
        },
        newOutcomeInput: {
            width: '85%',
        },
        outcomeSchemeMenuActionsDiv: {
            marginTop: theme.spacing(1),
            display: 'flex',
            justifyContent: 'space-evenly',
        },
        outcomeSchemeMenuActionButton: {
            width: '45%',
        },
    })
)

type Props = {
    anchorEl: HTMLElement | null
    onClose: () => void
    outcomesState: {
        targetId: string;
        name: string;
        themeColor: {
            r: number;
            g: number;
            b: number;
        };
        outcomes: {
            scheme: OutcomeScheme;
            enable: boolean;
            value: string | number;
        }[];
    }[]
    outcomesStateSetter: React.Dispatch<React.SetStateAction<{
        targetId: string;
        name: string;
        themeColor: {
            r: number;
            g: number;
            b: number;
        };
        outcomes: {
            scheme: OutcomeScheme;
            enable: boolean;
            value: string | number;
        }[];
    }[]>>
}

export default function RegisterOutcomeSchemeMenu(props: Props) {

    const classes = useStyles();

    const appDataManager = (() => {
        try {
            return  AppDataManager.generateInstance();
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();

    const [name, setName] = React.useState("");
    const [defaultValue, setDefaultValue] = React.useState<number | undefined>(undefined);
    const [targetId, setTargetId] = React.useState("");

    return (
        <Menu
            className={classes.outcomeSchemeTargetSelectMenu}
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            getContentAnchorEl={null}
            open={Boolean(props.anchorEl)}
            onClose={props.onClose}
            id="menu-test"
        >
            <FormControl
                className={classes.formControlDiv}
            >
                <InputLabel
                    id="target-select-label"
                >
                    Target
                </InputLabel>
                <Select
                    className={classes.targetSelector}
                    labelId="target-select-label"
                    MenuProps={{
                        style: {
                            maxHeight: 250,
                        }
                    }}
                    value={targetId}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => setTargetId(`${e.target.value}`)}
                >
                    {appDataManager.targets != undefined && appDataManager.targets.map(target => {
                        return (
                            <MenuItem
                                value={target.id}
                                key={`newOutcomeTarget-${target.id}`}
                            >
                                {target.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            <li
                className={classes.newOutcomeInputDiv}
            >
                <TextField
                    className={classes.newOutcomeInput}
                    label="Title"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                    }}
                />
            </li>
            <li
                className={classes.newOutcomeInputDiv}
            >
                <TextField
                    className={classes.newOutcomeInput}
                    label="Default value"
                    type="number"
                    value={defaultValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setDefaultValue(+(e.target.value));
                    }}
                />
            </li>
            <li
                key={`sction-actions`}
                className={classes.outcomeSchemeMenuActionsDiv}
            >
                <Button
                    className={classes.outcomeSchemeMenuActionButton}
                    variant="outlined"
                    color="secondary"
                    onClick={() => props.onClose()}
                >
                    Cancel
                </Button>
                <Button
                    className={classes.outcomeSchemeMenuActionButton}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        if (targetId == "" || name == "" || defaultValue == undefined) {
                            return;
                        }
                        // call api.
                        appDataManager.registerOutcomeScheme(name, targetId, 'Sum', defaultValue).then(res => {
                            if (res == false) {
                                console.log('err: Failed to register \'OutcomeScheme\'.');
                                return;
                            }
                            // outcomeリストのStateを更新
                            props.outcomesStateSetter(current => {
                                return current.map(value => {
                                    if (value.targetId != targetId) {
                                        // store current value.
                                        return value;
                                    }

                                    // update.
                                    value.outcomes.push({
                                        scheme: res,
                                        enable: true,
                                        value: defaultValue
                                    })
                                    return value;
                                })
                            });
                            props.onClose();
                        })
                    }}
                >
                    Register
                </Button>
            </li>
        </Menu>
    )
}