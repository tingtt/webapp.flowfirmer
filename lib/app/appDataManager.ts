import axios from "axios";
import { sampleArchives } from "../../utils/sample-data";
import { Percentage } from "../interface/archive";
import { Archive, FeelingType, HabitRemind, OutcomeScheme, Target, Term, ToDo } from "../interface/index";

export default class AppDataManager {

    private static _instance: AppDataManager

    public static generateInstance(): AppDataManager {
        // インスタンスが既に生成されている場合にエラー
        if (this._instance) {
            throw new Error("AppDataManager instance already exists.");
        }

        console.log("Generating 'AppDataManager' instance.");
        this._instance = new AppDataManager();

        return this._instance;
    }

    public static getInstance(): AppDataManager {
        if (!this._instance) {
            throw new Error("'AppDataManager' instance doesn't exist.");
        }
        return this._instance;
    }

    public targets?: Target[];
    public todos?: ToDo[];
    public terms?: Term[];
    public habitReminds?: HabitRemind[];
    public archives?: Archive[];

    private async getTargets() {
        var targets: Target[] = []
        await axios.post(`/api/getTarget`)
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    targets = targets.concat(ary.map((value: {
                        _id: string;
                        name: string;
                        outcomes: {
                            _id: string,
                            name: string,
                            unitName: string | null,
                            statisticsRule: "String" | "Sum" | "Max" | "Min",
                            targetValue: number | null,
                            defaultValue: string | number | null
                        }[];
                        pinnedAtNavigationList: boolean | null;
                        hiddenAtNavigationList: boolean | null;
                        themeColor: { r: number; g: number; b: number; };
                    }) => {
                        const target: Target = {
                            id: value._id,
                            name: value.name,
                            outcomeSchemes: value.outcomes.map(outcomeScheme => {
                                const res: OutcomeScheme = {
                                    id: outcomeScheme._id,
                                    target_id: value._id,
                                    name: outcomeScheme.name,
                                    unitName: outcomeScheme.unitName != null ? outcomeScheme.unitName : "",
                                    statisticsRule: outcomeScheme.statisticsRule,
                                    targetValue: outcomeScheme.targetValue != null ? outcomeScheme.targetValue : undefined,
                                    defaultValue: outcomeScheme.defaultValue != null ? outcomeScheme.defaultValue : undefined,
                                };
                                return res;
                            }),
                            pinnedAtNavigationList: value.pinnedAtNavigationList ? true : undefined,
                            hiddenAtNavigationList: value.hiddenAtNavigationList ? true : undefined,
                            themeColor: {
                                r: value.themeColor.r,
                                g: value.themeColor.g,
                                b: value.themeColor.b
                            }
                        };
                        return target;
                    }))
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return targets;
    }

    private async getToDos() {
        var todos: ToDo[] = [];
        await axios.post(`/api/getTodoByUserId`)
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    todos = todos.concat(ary.map((value: {
                        _id: string;
                        name: string;
                        description: string;
                        startDatetimeScheduled: Date | null;
                        timeInfoExisted: boolean;
                        processingTimeScheduled: number | null;
                        repeatPattern: "Daily" | "Weekly" | "Monthly" | null;
                        repeatDayForWeekly: number[] | null;
                        targetList: string[] | null;
                        term: string | null,
                        completed: boolean;
                        checkInDatetime: Date;
                        archived: boolean;
                    }) => {
                        const todo:ToDo = {
                            id: value._id,
                            name: value.name,
                            description: value.description,

                            startDatetimeScheduled: value.startDatetimeScheduled != null ? new Date(value.startDatetimeScheduled) : undefined,
                            timeInfoExisted: value.timeInfoExisted,

                            processingTimeScheduled: value.processingTimeScheduled != null ? value.processingTimeScheduled : undefined,

                            repeatPattern: value.repeatPattern != null ? value.repeatPattern : undefined,
                            repeatDayForWeekly: value.repeatDayForWeekly != null ? value.repeatDayForWeekly : undefined,

                            targetList: value.targetList != null && this.targets != undefined ? value.targetList.map((targetId: string) => this.targets!.find(target => target.id == targetId)).filter((target): target is Target => target != undefined) : undefined,

                            term: value.term != null ? this.terms?.find(term => term.id == value.term) : undefined,

                            completed: value.completed,

                            checkInDatetime: new Date(value.checkInDatetime),

                            archived: value.archived
                        }
                        return todo;
                    }))
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return todos;
    }

    private async getTerms() {
        var terms: Term[] = [];
        await axios.post(`/api/getTermByUserId`)
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    terms = terms.concat(ary.map((value: {
                        _id: string;
                        name: string;
                        description: string | null;
                        targetList: string[] | null;
                        startDatetimeScheduled: Date;
                        endDatetimeScheduled: Date;
                        startDateTime: Date | null;
                    }) =>{
                        const term: Term = {
                            id: value._id,
                            name : value.name,
                            description : value.description != null ? value.description : undefined,
                            targetList : value.targetList != null && this.targets != undefined ? value.targetList.map(targetId => this.targets!.find(target => target.id == targetId)).filter((target): target is Target => target != undefined) : undefined,
                            startDatetimeScheduled: new Date(value.startDatetimeScheduled),
                            endDatetimeScheduled: new Date(value.endDatetimeScheduled),
                            startDatetime: value.startDateTime != null ? new Date(value.startDateTime) : undefined
                        };
                        return term;
                    }))
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return terms;
    }

    private async getHabitReminds() {
        var habits: HabitRemind[] = [];
        await axios.post(`/api/getHabitByUserId`)
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    habits = habits.concat(ary.map((value: {
                        _id: string;
                        name: string;
                        target: string | null;
                    }) => {
                        const habit: HabitRemind = {
                            id: value._id,
                            name: value.name,
                            target: value.target != null ? this.targets!.find(target => target.id == value.target) : undefined
                        }
                        return habit;
                    }))
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return habits;
    }

    private getArchives() {
        // axios.post(`/api/getTodoArchiveByUserId`)
        //     .then((res) => {
        //         if (res.data.status == 200) {
        //             const ary = res.data.data;
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        return sampleArchives;
    }

    /**
     * registerTodo
     * @param name string
     * @param datetime {date: Date, timeSetted: boolean} | undefined
     * @param processingTime number | undefined
     * @param targetIds number[] | undefined
     * @param termId number | undefined
     * @param repeatPattern { interval: 'Daily' | 'Monthly' } | { interval: 'Weekly', repeatDay?: number[] } | undefined
     * @param completed boolean
     * @returns ToDo[] | false
     */
    public async registerTodo(
        name: string,
        datetime?: { date: Date, timeSetted: boolean},
        processingTime?: number,
        targetIds?: string[],
        termId?: string,
        repeatPattern?: { interval: 'Daily' } | { interval: 'Weekly', repeatDay: number[] } | { interval: 'Monthly', repeatDate?: number },
        description = "",
        completed = false
    ): Promise<ToDo[] | false> {
        var ret: ToDo[] | false = false;
        // APIを叩いてToDoを登録し、IDを取得
        await axios.post('/api/saveTodo', {
            "data": {
                "name": name,
                "description": description,
                "startDatetimeScheduled": datetime != undefined ? datetime.date : undefined,
                "timeInfoExisted": datetime != undefined ? datetime.timeSetted : false,
                "processingTimeScheduled": processingTime,
                "repeatPattern": repeatPattern != undefined ? repeatPattern.interval : undefined,
                "repeatDayForWeekly": repeatPattern != undefined && repeatPattern.interval == 'Weekly' ? repeatPattern.repeatDay : undefined,
                "repeatDateForMonthly": repeatPattern != undefined && datetime != undefined && repeatPattern.interval == 'Monthly' ? repeatPattern.repeatDate != undefined ? repeatPattern.repeatDate : datetime.date.getDate() : undefined,
                "targetList": targetIds,
                "term": termId,
                "completed": completed,
                "archived": false,
            }
        }).then((res) => {
            if (res.data.status == 200) {
                console.log(res.data.objectId);
                const newTodo: ToDo = {
                    id: res.data.objectId,
                    name: name,
                    description: description,
                    startDatetimeScheduled: datetime != undefined ? datetime.date : undefined,
                    timeInfoExisted: datetime != undefined ? datetime.timeSetted : false,
                    processingTimeScheduled: processingTime,
                    repeatPattern: repeatPattern != undefined ? repeatPattern.interval : undefined,
                    repeatDayForWeekly: repeatPattern != undefined && repeatPattern.interval == 'Weekly' ? repeatPattern.repeatDay : undefined,
                    "repeatDateForMonthly": repeatPattern != undefined && repeatPattern.interval == 'Monthly' ? repeatPattern.repeatDate : undefined,
                    targetList: targetIds != undefined && this.targets != undefined ? this.targets.filter(target => targetIds.some(id => id == target.id)) : undefined,
                    term: termId != undefined && this.terms != undefined ? this.terms.find(term => term.id == termId) : undefined,
                    completed: completed,
                    checkInDatetime: undefined,
                    archived: false,
                };
                // 新規Targetを追加
                this.todos = this.todos != undefined ? [...this.todos, newTodo] : [newTodo];
                ret = this.todos;
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
        });

        return ret;
    }

    /**
     *
     * @param updatedValue ToDo
     * @returns ToDo[]
     */
    public updateTodo(updatedValue: ToDo) {
        // 更新
        if (this.todos != undefined) {
            this.todos = this.todos.map(value => {
                if (value.id == updatedValue.id) {
                    // call api
                    axios.post('/api/updateTodoByObjectId', {
                        "data": {
                            "_id": updatedValue.id,
                            "name": updatedValue.name,
                            "description": updatedValue.description,
                            "startDatetimeScheduled": updatedValue.startDatetimeScheduled,
                            "timeInfoExisted": updatedValue.timeInfoExisted,
                            "processingTimeScheduled": updatedValue.processingTimeScheduled,
                            "repeatPattern": updatedValue.repeatPattern,
                            "repeatDayForWeekly": updatedValue.repeatDayForWeekly,
                            "targetList": updatedValue.targetList != undefined ? updatedValue.targetList.map(target => target.id) : [],
                            "term": updatedValue.term?.id,
                            "completed": updatedValue.completed,
                            "checkInDatetime": updatedValue.checkInDatetime,
                            "archived": updatedValue.archived,
                        }
                    }).then((res) => {
                        if (res.data.status == 200) {
                            console.log(res.data);
                        } else {
                            console.log(res.data.message);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                    return updatedValue
                }
                return value
            });
        }

        return this.todos;
    }

    private todoCompletionStateToggledTodoIds: string[] = [];

    /**
     * / toggleTodoCompletionState
     */
    public async toggleTodoCompletionState(id: string) {
        var ret: ToDo[] | false | undefined;
        // 更新
        if (this.todos != undefined) {
            // 新規ToDo用の値を保持するフィールド
            var newName = "";
            var description: string | undefined;
            var date = new Date();
            var timeSetted = false;
            var processingTime: number | undefined;
            var interval: "Daily" | "Weekly" | "Monthly" = "Daily";
            var repeatDay: number[] = [];
            var repeatDate: number | undefined;
            var targetList: string[] = [];
            var termId: string | undefined;
            // 新規ToDoを追加するかどうかのフラグ
            var flg = false;

            this.todos = this.todos.map(value => {
                if (value.id == id) {
                    value.completed = !value.completed;
                    // 完了日時情報
                    value.checkInDatetime = value.completed ? new Date() : undefined;

                    // 完了状態更新ログ
                    this.todoCompletionStateToggledTodoIds.push(value.id);
                    // リピート設定をしているToDoを完了にしたときに次のToDoを登録する
                    if (value.completed && value.startDatetimeScheduled != undefined && value.repeatPattern != undefined) {
                        date = new Date(value.startDatetimeScheduled);
                        // console.log(value.repeatPattern);
                        // console.log(value.repeatDayForWeekly);
                        // console.log(date);
                        // console.log("↓");
                        // 繰り返しパターンごとに処理
                        switch (value.repeatPattern) {
                            case 'Daily':
                                // 次の日に新規ToDo
                                // 1日加算
                                date.setDate( date.getDate() + 1 );
                                // 月の繰り上がり
                                if (date < value.startDatetimeScheduled) {
                                    date.setMonth( date.getMonth() + 2 );
                                }
                                break;
                            case 'Monthly':
                                // 翌月の同じ日に新規ToDo
                                const nextMonth = (date.getMonth() + 2) == 13 ? 1 : date.getMonth() + 2;
                                date = new Date(date.getFullYear(), nextMonth - 1, value.repeatDateForMonthly);
                                if (date.getMonth() + 1 != nextMonth) {
                                    date.setDate(0);
                                }
                                break;
                            case 'Weekly':
                                if (value.repeatDayForWeekly != undefined && value.repeatDayForWeekly.filter(dayNum => dayNum <= 6 && dayNum >= 0).length != 0) {
                                    // 次の指定曜日に新規ToDo
                                    do {
                                        // 指定している曜日になるまで日付を加算
                                        date.setDate(date.getDate() + 1);
                                        // 月の繰り上がり
                                        if (date < value.startDatetimeScheduled) {
                                            date.setMonth( date.getMonth() + 2 );
                                        }
                                    } while (!value.repeatDayForWeekly.includes(date.getDay()));
                                    break
                                }
                                // 翌週の同じ曜日に新規ToDo
                                date.setDate( date.getDate() + 7 );
                                // 月の繰り上がり
                                if (date < value.startDatetimeScheduled) {
                                    date.setMonth( date.getMonth() + 2 );
                                }
                                break;
                        }
                        // console.log(date);
                        // 新規ToDoの情報
                        newName = value.name;
                        description = value.description;
                        timeSetted = value.timeInfoExisted;
                        processingTime = value.processingTimeScheduled;
                        targetList = value.targetList != undefined ? value.targetList?.map(target => target.id) : [];
                        termId = value.term?.id;
                        interval = value.repeatPattern;
                        repeatDay = value.repeatDayForWeekly != undefined ? value.repeatDayForWeekly : [];
                        repeatDate = value.repeatDateForMonthly;
                        flg = true;

                        // このToDoの繰り返し情報の削除
                        value.repeatPattern = undefined;
                        value.repeatDayForWeekly = undefined;
                    }

                    // call api
                    axios.post('/api/updateTodoByObjectId', {
                        "data": {
                            "_id": value.id,
                            "name": value.name,
                            "description": value.description,
                            "startDatetimeScheduled": value.startDatetimeScheduled,
                            "timeInfoExisted": value.timeInfoExisted,
                            "processingTimeScheduled": value.processingTimeScheduled,
                            "repeatPattern": value.repeatPattern,
                            "repeatDayForWeekly": value.repeatDayForWeekly,
                            "targetList": value.targetList != undefined ? value.targetList.map(target => target.id) : [],
                            "term": value.term?.id,
                            "completed": value.completed,
                            "archived": value.archived,
                        }
                    }).then((res) => {
                        if (res.data.status == 200) {
                            console.log(res.data);
                        } else {
                            console.log(res.data.message);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                return value;
            })

            // 新規ToDoの追加
            if (flg) {
                await this.registerTodo(
                    newName,
                    {date, timeSetted},
                    processingTime,
                    targetList,
                    termId,
                    interval == 'Daily' ? {interval} : interval == 'Weekly' ? {interval, repeatDay} : {interval, repeatDate},
                    description,
                    false
                ).then((res) => ret = res);
            }
        }
        return ret;
    }

    /**
     * / undoToggleTodoCompletionState
     */
    public undoToggleTodoCompletionState() {
        if (this.todos != undefined && this.todoCompletionStateToggledTodoIds.length > 0) {
            const todo = this.todos.find(value => value.id == this.todoCompletionStateToggledTodoIds[this.todoCompletionStateToggledTodoIds.length - 1])
            if (todo != undefined) {
                todo.completed = !todo.completed;
                todo.checkInDatetime = todo.completed ? new Date() : undefined;
                this.updateTodo(todo);
            }
        }
    }

    private deletedToDos: ToDo[] = [];

    /**
     * deleteTodo
     * @param id string
     */
    public deleteTodo(id: string) {
        if (this.todos != undefined) {
            const poppedTodo = this.todos.filter(value => value.id == id).pop();
            if (poppedTodo != undefined) {
                this.deletedToDos.push(poppedTodo);
            }
            this.todos = this.todos.filter(value => value.id != id);

            // call api
            axios.post('/api/deleteTodoByObjectId', {
                "data": {
                    "_id": id
                }
            }).then((res) => {
                if (res.data.status == 200) {
                    console.log(res.data);
                } else {
                    console.log(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    /**
     * restoreTodo
     */
    public restoreTodo() {
        if (this.todos != undefined) {
            const poppedTodo = this.deletedToDos.pop();
            console.log(poppedTodo);
            if (poppedTodo != undefined) {
                // call api
                axios.post('/api/saveTodo', {
                    "data": {
                        "name": poppedTodo.name,
                        "description": poppedTodo.description,
                        "startDatetimeScheduled": poppedTodo.startDatetimeScheduled,
                        "timeInfoExisted": poppedTodo.timeInfoExisted,
                        "processingTimeScheduled": poppedTodo.processingTimeScheduled,
                        "repeatPattern": poppedTodo.repeatPattern,
                        "repeatDayForWeekly": poppedTodo.repeatDayForWeekly,
                        "targetList": poppedTodo.targetList?.map(target => target.id),
                        "term": poppedTodo.term?.id,
                        "completed": poppedTodo.completed,
                        "checkInDatetime": poppedTodo.checkInDatetime,
                        "archived": poppedTodo.archived,
                    }
                }).then((res) => {
                    if (res.data.status == 200) {
                        console.log(res.data.objectId);
                        // 新しいobjectIdを適応
                        poppedTodo.id = res.data.objectId;
                    } else {
                        console.log(res.data.message);
                    }
                }).catch((err) => {
                    console.log(err);
                });
                this.todos.push(poppedTodo);
            }
        }
    }

    /**
     * registerTerm
     *
     * @param name string
     * @param startDatetimeScheduled Date
     * @param endDatetimeScheduled Date
     * @param targetList string[]
     * @param description string
     * @param startDatetime Date
     * @param endDatetime Date
     * @returns Term[] | false
     */
    public async registerTerm(
        name: string,
        startDatetimeScheduled: Date,
        endDatetimeScheduled: Date,
        targetList: string[] = [],
        description: string = "",
        startDatetime: Date | undefined = undefined,
        endDatetime: Date | undefined = undefined
    ): Promise<Term[] | false> {
        var ret: Term[] | false = false;
        await axios.post('/api/saveTerm', {
            data : {
                name : name,
                description : description,
                targetList : targetList,
                startDatetimeScheduled: startDatetimeScheduled,
                endDatetimeScheduled: endDatetimeScheduled,
                startDatetime: startDatetime,
                endDatetime: endDatetime
            }
        }).then((res) => {
            if (res.data.status == 200) {
                console.log(res.data.objectId);
                const newTerm: Term = {
                    id: res.data.objectId,
                    name: name,
                    description: description,
                    targetList: targetList.map(id => this.targets?.find(target => target.id == id)).filter((target): target is Target => target != undefined),
                    startDatetimeScheduled: startDatetimeScheduled,
                    endDatetimeScheduled: endDatetimeScheduled,
                    startDatetime: startDatetime,
                    endDatetime: endDatetime
                };
                this.terms = this.terms != undefined ? this.terms.concat([newTerm]) : [newTerm];
                ret = this.terms;
            } else {
                console.log(res.data.message);
            }
        })
        return ret;
    }

    /**
     *
     * @param name string
     * @param themeColor string
     * @returns Promise<Target | false>
     */
    public async registerTarget(name: string, themeColor?: { r: number, g: number, b: number }, pinned?: true, hidden?: true): Promise<Target | false> {
        // APIを叩いてTargetを登録し、IDを取得
        var id: string;
        var newTarget: Target | undefined;
        await axios.post('/api/saveTarget', {
            "data": {
                "name" : name,
                "themeColor" : themeColor != undefined ?
                    themeColor
                    :
                    // テーマカラーが指定されていない場合にカラーコードを生成
                    {
                        r: (Math.random() * 0xFF | 0),
                        g: (Math.random() * 0xFF | 0),
                        b: (Math.random() * 0xFF | 0)
                    },
                "outcomes" : [],
                pinnedAtNavigationList: pinned,
                hiddenAtNavigationList: hidden,
            }
        }).then((res) => {
            if (res.data.status == 200) {
                console.log(res.data.objectId);
                // 取得したIDを保持
                id = res.data.objectId;

                newTarget = {
                    id: id,

                    name: name,
                    themeColor: themeColor != undefined ?
                        themeColor
                        :
                        // テーマカラーが指定されていない場合にカラーコードを生成
                        {
                            r: (Math.random() * 0xFF | 0),
                            g: (Math.random() * 0xFF | 0),
                            b: (Math.random() * 0xFF | 0)
                        },
                    pinnedAtNavigationList: pinned,
                    hiddenAtNavigationList: hidden,
                };

                // 新規Targetを追加
                this.targets = this.targets != undefined ? [...this.targets, newTarget] : [newTarget];
            } else {
                console.log(res.data.message._message);
            }
        }).catch((err) => {
            console.log(err);
        })

        return newTarget != undefined ? newTarget : false;
    }

    /**
     * @param name string
     * @param unitName string
     * @param statisticsRule 'String' | 'Sum' | 'Max' | 'Min'
     * @param defaultValue string | number
     * @param targetValue number
     * @param targetId string
     * @returns Promise<Target[] | false>
     */
    public async registerOutcomeScheme(
        name : string,
        targetId: string,
        statisticsRule : 'String' | 'Sum' | 'Max' | 'Min',
        defaultValue? : string | number,
        targetValue?: number,
        unitName? : string,
    ): Promise<OutcomeScheme | false> {
        if (this.targets == undefined || this.targets.length == 0) {
            console.log("Err: Target does not exist.");
            return false;
        }
        const targetIdx = this.targets.findIndex(target => target.id == targetId);
        const target = this.targets[targetIdx];

        const outcomeSchemes = target.outcomeSchemes == undefined ? [] : target.outcomeSchemes;

        let ret: OutcomeScheme | false = false;

        await axios.post('/api/saveOutcomeScheme', {
            targetId: target.id,
            outcome: {
                name: name,
                unitName: unitName,
                statisticsRule: statisticsRule,
                targetValue: targetValue,
                defaultValue: defaultValue
            }
        }).then(res => {
            if (this.targets == undefined || this.targets.length == 0) {
                console.log("Err: Target does not exist.");
                return;
            }
            if (res.data.status != 200) {
                console.log(res.data.message);
                return;
            }
            console.log(res);
            const newOutcomeScheme: OutcomeScheme = {
                id: res.data.objectId,
                target_id: targetId,
                name: name,
                unitName: unitName,
                statisticsRule: statisticsRule,
                targetValue: targetValue,
                defaultValue: defaultValue
            }
            outcomeSchemes.push(newOutcomeScheme)
            this.targets[targetIdx].outcomeSchemes = outcomeSchemes;
            console.log(newOutcomeScheme);
            ret = newOutcomeScheme;
        }).catch(err => {
            console.log(err);
        })

        return ret;
    }

    /**
     * registerArchive
     */
    public registerArchive(
        targets?: Target[],
        outcomes?: {
            scheme: OutcomeScheme,
            value: string | number
        }[],
        text?: string,
        feelingList?: {
            feeling: FeelingType,
            positivePercent: Percentage,
            negativePercent: Percentage,
        }[],
        refInfo: {
            refType: 'ToDo';
            ref: ToDo;
            startDateTime: Date;
            processingTime: number;
        } | {
            refType: 'HabitRemind';
            ref: HabitRemind;
        } | {
            refType: 'undefined';
        } = { refType: 'undefined' }
    ) {
        const date = new Date();

        // 既にArchiveされているToDoの場合
        if (refInfo.refType == 'ToDo' && this.archives?.some(value => value.refInfo.refType == 'ToDo' && value.refInfo.ref.id == refInfo.ref.id)) {
            // update
            this.archives = this.archives.map(value => {
                if (value.refInfo.refType == 'ToDo' && value.refInfo.ref.id == refInfo.ref.id) {
                    var newArchive = value;
                    newArchive.refInfo = refInfo;
                    newArchive.targets = targets;
                    newArchive.outcomes = outcomes;
                    newArchive.text = text;
                    newArchive.feelingList = feelingList;
                    newArchive.recordingDateTime = date;
                    console.log(newArchive);
                    return newArchive;
                }
                return value;
            })

            // call api
            if (refInfo.refType == 'ToDo') {
                const [positivePercent, negativePercent] = (() => {
                    if (feelingList == undefined) return [0,0];
                    return feelingList.reduce((prev, curr) => {
                        return [prev[0] + curr.positivePercent, prev[1]+ curr.negativePercent];
                    }, [0,0]).map(val => val / feelingList.length)
                })();

                axios.post('/api/saveArchive', {
                    "data": {
                        refType: refInfo.refType,
                        refId: refInfo.ref.id,
                        checkInDateTime: refInfo.refType == 'ToDo' ? refInfo.startDateTime : date,
                        feelingAndDiary: {
                            diaryFlag: text != undefined && text != "",
                            feelingFlag: feelingList != undefined && feelingList.length != 0,
                            textForDiary: text,
                            positiveValue: positivePercent,
                            negativeValue: -negativePercent
                        },
                        outcomes: outcomes?.filter(outcome => outcome.scheme.statisticsRule != "String").map(outcome => {
                            return {
                                outcomeId: outcome.scheme.id,
                                value: outcome.value
                            };
                        })
                    }
                }).then((res) => {
                    if (res.data.status == 200) {
                        console.log(res.data);
                    } else {
                        console.log(res.data.message);
                    }
                })
                .catch((err) => { console.log(err) });
            }
        } else {
            // register

            // call api
            if (refInfo.refType == 'ToDo') {
                const [positivePercent, negativePercent] = (() => {
                    if (feelingList == undefined) return [0,0];
                    return feelingList.reduce((prev, curr) => {
                        return [prev[0] + curr.positivePercent, prev[1]+ curr.negativePercent];
                    }, [0,0]).map(val => val / feelingList.length)
                })();

                axios.post('/api/saveArchive', {
                    "data": {
                        refType: refInfo.refType,
                        refId: refInfo.ref.id,
                        checkInDateTime: refInfo.refType == 'ToDo' ? refInfo.ref.checkInDatetime : date,
                        feelingAndDiary: {
                            diaryFlag: text != undefined && text != "",
                            feelingFlag: feelingList != undefined && feelingList.length != 0,
                            textForDiary: text,
                            positiveValue: positivePercent,
                            negativeValue: -negativePercent
                        },
                        outcomes: outcomes?.filter(outcome => outcome.scheme.statisticsRule != "String").map(outcome => {
                            return {
                                outcomeId: outcome.scheme.id,
                                value: outcome.value
                            };
                        })
                    }
                }).then((res) => {
                    if (res.data.status == 200) {
                        console.log(res.data.objectId);
                        // Archiveデータを作成
                        const newArchive: Archive = {
                            id: res.data.objectId,
                            refInfo: refInfo,
                            targets: targets,
                            outcomes: outcomes,
                            text: text,
                            feelingList: feelingList,
                            recordingDateTime: date
                        }

                        console.log(newArchive);

                        // データを追加
                        this.archives = this.archives != undefined ? [...this.archives, newArchive] : [newArchive];
                    } else {
                        console.log(res.data.message);
                    }
                })
                .catch((err) => { console.log(err) });
            }

            //
            if (refInfo.refType == 'ToDo') {
                var todo = this.todos?.find(value => value.id == refInfo.ref.id);
                if (todo != undefined) {
                    todo.archived = true;
                    this.updateTodo(todo);
                }
            }
        }
    }

    private constructor() {
        this.getTargets().then((value) => this.targets = value);
        this.getTerms().then((value) => this.terms = value);
        this.getToDos().then((value) => this.todos = value);
        this.getHabitReminds().then((value) => this.habitReminds = value);
        this.archives = this.getArchives();
    }
}