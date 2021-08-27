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

    private user_id: number;

    private token: string;

    public static async validateToken(token: string) {
        try {
            await axios.post(`/api/toOngoingData`, { token });
            return true;
        } catch (_) {
            return false;
        }
    }

    public targets?: Target[];
    public todos?: ToDo[];
    public terms?: Term[];
    public habitReminds?: HabitRemind[];
    public archives?: Archive[];

    // TODO: ユーザーの登録データを取得

    private getTargets() {
        axios.post(`/api/getTarget`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return sampleTargets.filter(value => value.user_id == this.user_id);
    }

    private getToDos() {
        axios.post(`/api/getTodoByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return sampleToDos.filter(value => value.user_id == this.user_id);
    }

    private getTerms() {
        axios.post(`/api/getTermByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return sampleTerms.filter(value => value.user_id == this.user_id);
    }

    private getHabitReminds() {
        axios.post(`/api/getHabitByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return sampleHabitReminds.filter(value => value.user_id == this.user_id);
    }

    private getArchives() {
        axios.post(`/api/getTodoArchiveByUserId`, { token: this.token })
            .then((res) => {
                if (res.data.status == 200) {
                    const ary = res.data.data;
                    console.log(ary);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        return sampleArchives.filter(value => value.user_id == this.user_id);
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
     * @returns ToDo
     */
    public registerTodo(
        name: string,
        datetime?: { date: Date, timeSetted: boolean},
        processingTime?: number,
        targetIds?: number[],
        termId?: number,
        repeatPattern?: { interval: 'Daily' | 'Monthly' } | { interval: 'Weekly', repeatDay: number[] },
        description = "",
        completed = false
    ) {
        // TODO: APIを叩いてToDoを登録し、IDを取得
        const todoHasLastId = this.todos != undefined ? this.todos.sort((a, b) => {
            // Idで昇順
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        })[this.todos.length - 1] : undefined;
        const id: number = this.todos != undefined && todoHasLastId != undefined ? todoHasLastId.id + 1 : 0;


        const newTodo: ToDo = {
            id: id,
            user_id: this.user_id,

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
        }

        // 新規Targetを追加
        this.todos = this.todos != undefined ? [...this.todos, newTodo] : [newTodo];

        axios.post('/api/saveTodo', {
            "token": this.token,
            "data": {
                "name": name,
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
                // TODO: AppDataManager内でToDoを追加
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
        });

        return newTodo;
    }

    /**
     *
     * @param updatedValue ToDo
     * @returns ToDo[]
     */
    public updateTodo(updatedValue: ToDo) {
        // TODO: API叩く処理?
        // 更新
        this.todos = this.todos != undefined ?
            // 値の更新(IDが一致するものを更新する)
            this.todos.map(value => {
                if (value.id == updatedValue.id) {
                    return updatedValue
                }
                return value
            })
            :
            // 値の追加
            [updatedValue];

        return this.todos;
    }

    private todoCompletionStateToggledTodoIds: number[] = [];

    /**
     * / toggleTodoCompletionState
     */
    public toggleTodoCompletionState(id: number) {
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
            var targetList: number[] = [];
            var termId: number | undefined;
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
     * @param id number
     */
    public deleteTodo(id: number) {
        if (this.todos != undefined) {
            const poppedTodo = this.todos.filter(value => value.id == id).pop();
            if (poppedTodo != undefined) {
                this.deletedToDos.push(poppedTodo);
            }
            this.todos = this.todos.filter(value => value.id != id);
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
                this.todos.push(poppedTodo);
            }
        }
    }

    /**
     *
     * @param name string
     * @param themeColor string
     * @returns Target
     */
    public registerTarget(name: string, themeColor?: {
        r: number
        g: number
        b: number
    }): Target {
        // TODO: APIを叩いてTargetを登録し、IDを取得
        const id: number = this.targets != undefined ? this.targets.length : 0;

        const newTarget: Target = {
            id: id,
            user_id: this.user_id,

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

        axios.post('/api/saveTarget', {
            "token": this.token,
            "data": {
                "name" : "name",
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
                // TODO: AppDataManager内でTargetを追加
            } else {
                console.log(res.data.message._message);
            }
        }).catch((err) => {
            console.log(err);
        })

        return newTarget;
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
        } else {
            // register
            // TODO: APIを叩いてArchiveを登録し、IDを取得
            const id: number = this.archives != undefined ? this.archives.length : 0;

            // Archiveデータを作成
            const newArchive: Archive = {
                id: id,
                user_id: this.user_id,
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

            //
            if (refInfo.refType == 'ToDo') {
                var todo = this.todos?.find(value => value.id == refInfo.ref.id);
                if (todo != undefined) {
                    todo.archived = true;
                    this.updateTodo(todo);
                }
            }
        }

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
                    // TODO: appDataManager内でArchiveの追加
                } else {
                    console.log(res.data.message);
                }
            })
            .catch((err) => { console.log(err) });
        }
    }

    private constructor(token: string) {
        this.user_id = 0;
        this.token = token;

        this.targets = this.getTargets();
        this.todos = this.getToDos();
        this.terms = this.getTerms();
        this.habitReminds = this.getHabitReminds();
        this.archives = this.getArchives();
    }
}