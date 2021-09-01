import axios from "axios";
import { sampleArchives, sampleHabitReminds, sampleTargets, sampleTerms, sampleToDos } from "../../utils/sample-data";
import { Percentage } from "../interface/archive";
import { Archive, FeelingType, HabitRemind, OutcomeScheme, Target, Term, ToDo } from "../interface/index";

export default class AppDataManager {

    private static _instance: AppDataManager

    public static generateInstance(token: string): AppDataManager {
        // インスタンスが既に生成されている場合にエラー
        if (this._instance) {
            throw new Error("AppDataManager instance already exists.");
        }

        console.log("Generating 'AppDataManager' instance.");
        this._instance = new AppDataManager(token);

        return this._instance;
    }

    public static getInstance(): AppDataManager {
        if (!this._instance) {
            throw new Error("'AppDataManager' instance doesn't exist.");
        }
        return this._instance;
    }

    private token: string;

    public targets?: Target[];
    public todos?: ToDo[];
    public terms?: Term[];
    public habitReminds?: HabitRemind[];
    public archives?: Archive[];

    // TODO: ユーザーの登録データを取得

    private async getTargets() {
        var targets: Target[] = []
        await axios.post(`/api/getTarget`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
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
        await axios.post(`/api/getTodoByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
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

                            targetList: value.targetList != null ? value.targetList.map((targetId: string) => this.targets!.find(target => target.id == targetId)!) : undefined,
                            // TODO: Targetが不一致時の処理？

                            term: value.term != null ? this.terms?.find(term => term.id == value.term) : undefined,

                            completed: value.completed,
                            archived: value.archived
                        }
                        return todo;
                    }))
                    console.log(todos);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return todos;
    }

    private async getTerms() {
        var terms: Term[] = [];
        await axios.post(`/api/getTermByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
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
                            targetList : value.targetList != null ? value.targetList.map(targetId => this.targets!.find(target => target.id == targetId)!) : undefined,
                            // TODO: Targetが不一致時の処理？
                            startDatetimeScheduled: value.startDatetimeScheduled,
                            endDatetimeScheduled: value.endDatetimeScheduled,
                            startDatetime: value.startDateTime != null ? value.startDateTime : undefined
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
        await axios.post(`/api/getHabitByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
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
        // axios.post(`/api/getTodoArchiveByUserId`, { token: this.token })
        //     .then((res) => {
        //         if (res.data.status == 200) {
        //             const ary = res.data.data;
        //             console.log(ary);
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
     * @returns ToDo | false
     */
    public registerTodo(
        name: string,
        datetime?: { date: Date, timeSetted: boolean},
        processingTime?: number,
        targetIds?: string[],
        termId?: string,
        repeatPattern?: { interval: 'Daily' | 'Monthly' } | { interval: 'Weekly', repeatDay: number[] },
        description = "",
        completed = false
    ) {
        // APIを叩いてToDoを登録し、IDを取得
        axios.post('/api/saveTodo', {
            "token": this.token,
            "data": {
                "name": name,
                "description": description,
                "startDatetimeScheduled": datetime != undefined ? datetime.date : undefined,
                "timeInfoExisted": datetime != undefined ? datetime.timeSetted : false,
                "processingTimeScheduled": processingTime,
                "repeatPattern": repeatPattern != undefined ? repeatPattern.interval : undefined,
                "repeatDayForWeekly": repeatPattern != undefined && repeatPattern.interval == 'Weekly' ? repeatPattern.repeatDay : undefined,
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
                    targetList: targetIds != undefined && this.targets != undefined ? this.targets.filter(target => targetIds.some(id => id == target.id)) : undefined,
                    term: termId != undefined && this.terms != undefined ? this.terms.find(term => term.id == termId) : undefined,
                    completed: completed,
                    archived: false,
                };
                // 新規Targetを追加
                this.todos = this.todos != undefined ? [...this.todos, newTodo] : [newTodo];
                return newTodo;
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
        });

        return false;
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
                        "token": this.token,
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
    public toggleTodoCompletionState(id: string) {
        // TODO: API叩く処理?
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
            var targetList: string[] = [];
            var termId: string | undefined;
            // 新規ToDoを追加するかどうかのフラグ
            var flg = false;

            this.todos = this.todos.map(value => {
                if (value.id == id) {
                    value.completed = !value.completed;
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
                                // 1ヶ月加算
                                // TODO: 月末時の日付のズレを修正（繰り返し情報に日付を追加する）
                                date.setMonth( date.getMonth() + 1 );
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
                        flg = true;

                        // このToDoの繰り返し情報の削除
                        value.repeatPattern = undefined;
                        value.repeatDayForWeekly = undefined;
                    }

                    // call api
                    axios.post('/api/updateTodoByObjectId', {
                        "token": this.token,
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
                this.registerTodo(
                    newName,
                    {date, timeSetted},
                    processingTime,
                    targetList,
                    termId,
                    interval == 'Weekly' ? {interval, repeatDay} : {interval},
                    description,
                    false
                );
            }
        }
    }

    /**
     * / undoToggleTodoCompletionState
     */
    public undoToggleTodoCompletionState() {
        if (this.todos != undefined && this.todoCompletionStateToggledTodoIds.length > 0) {
            const todo = this.todos.find(value => value.id == this.todoCompletionStateToggledTodoIds[this.todoCompletionStateToggledTodoIds.length - 1])
            if (todo != undefined) {
                todo.completed = !todo.completed;
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
                "token": this.token,
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
                    "token": this.token,
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
     *
     * @param name string
     * @param themeColor string
     * @returns Target | false
     */
    public registerTarget(name: string, themeColor?: {
        r: number
        g: number
        b: number
    }): Target | false {
        // APIを叩いてTargetを登録し、IDを取得
        var id: string;
        var newTarget: Target | undefined;
        axios.post('/api/saveTarget', {
            "token": this.token,
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
                "outcomes" : []
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
        // 既にArchiveされているToDoの場合
        if (refInfo.refType == 'ToDo' && this.archives?.some(value => value.refInfo.refType == 'ToDo' && value.refInfo.ref.id == refInfo.ref.id)) {
            // update
            this.archives = this.archives.map(value => {
                if (value.refInfo.refType == 'ToDo' && value.refInfo.ref.id == refInfo.ref.id) {
                    var newArchive = value;
                    newArchive.refInfo = refInfo;
                    newArchive.checkInDateTime = new Date();
                    newArchive.targets = targets;
                    newArchive.outcomes = outcomes;
                    newArchive.text = text;
                    newArchive.feelingList = feelingList;
                    newArchive.recordingDateTime = new Date();
                    console.log(newArchive);
                    return newArchive;
                }
                return value;
            })

            // call api
            if (refInfo.refType == 'ToDo') {
                const date = new Date();

                const [positivePercent, negativePercent] = (() => {
                    if (feelingList == undefined) return [0,0];
                    return feelingList.reduce((prev, curr) => {
                        return [prev[0] + curr.positivePercent, prev[1]+ curr.negativePercent];
                    }, [0,0]).map(val => val / feelingList.length)
                })();

                var statistics: {[key: string]: any} = {}
                outcomes?.filter(val => val.scheme.statisticsRule != "String").forEach(val => {
                    statistics[val.scheme.id.toString()] = [{
                        "targetId": val.scheme.target_id,
                        "name": val.scheme.name,
                        "unitname": val.scheme.unitName,
                        "statisticsRule": val.scheme.statisticsRule,
                        "defaultValue": val.scheme.defaultValue,
                        "value": val.value,
                        "feelingText": text,
                        "feelingName": undefined,
                        "positivePercent": positivePercent,
                        "negativePercent": negativePercent,
                        "recordingDateTime": date
                    }]
                })

                axios.post('/api/saveTodoArchive', {
                    "token": this.token,
                    "data": {
                        "todoId": refInfo.ref.id,
                        "checkInDateTime": date,
                        "targets": targets?.map(target => target.id),
                        "statistics": statistics
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
                const date = new Date();

                const [positivePercent, negativePercent] = (() => {
                    if (feelingList == undefined) return [0,0];
                    return feelingList.reduce((prev, curr) => {
                        return [prev[0] + curr.positivePercent, prev[1]+ curr.negativePercent];
                    }, [0,0]).map(val => val / feelingList.length)
                })();

                var statistics: {[key: string]: any} = {}
                outcomes?.filter(val => val.scheme.statisticsRule != "String").forEach(val => {
                    statistics[val.scheme.id.toString()] = [{
                        "targetId": val.scheme.target_id,
                        "name": val.scheme.name,
                        "unitname": val.scheme.unitName,
                        "statisticsRule": val.scheme.statisticsRule,
                        "defaultValue": val.scheme.defaultValue,
                        "value": val.value,
                        "feelingText": text,
                        "feelingName": undefined,
                        "positivePercent": positivePercent,
                        "negativePercent": negativePercent,
                        "recordingDateTime": date
                    }]
                })

                axios.post('/api/saveTodoArchive', {
                    "token": this.token,
                    "data": {
                        "todoId": refInfo.ref.id,
                        "checkInDateTime": date,
                        "targets": targets?.map(target => target.id),
                        "statistics": statistics
                    }
                }).then((res) => {
                    if (res.data.status == 200) {
                        console.log(res.data.objectId);
                        // Archiveデータを作成
                        const newArchive: Archive = {
                            id: res.data.objectId,
                            refInfo: refInfo,
                            checkInDateTime: new Date(),
                            targets: targets,
                            outcomes: outcomes,
                            text: text,
                            feelingList: feelingList,
                            recordingDateTime: new Date()
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

    private constructor(token: string) {
        this.token = token;

        this.getTargets().then((value) => this.targets = value);
        this.getTerms().then((value) => this.terms = value);
        this.getToDos().then((value) => this.todos = value);
        this.getHabitReminds().then((value) => this.habitReminds = value);
        this.archives = this.getArchives();
    }
}