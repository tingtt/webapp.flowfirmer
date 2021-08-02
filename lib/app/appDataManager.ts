import { sampleArchives, sampleHabitReminds, sampleTargets, sampleTerms, sampleToDos } from "../../utils/sample-data";
import { Percentage } from "../interface/archive";
import { Archive, FeelingType, HabitRemind, OutcomeScheme, Target, Term, ToDo } from "../interface/index";

export default class AppDataManager {

    private static _instance: AppDataManager

    public static generateInstance(user_id: number): AppDataManager {
        // インスタンスが既に生成されている場合にエラー
        if (this._instance) {
            throw new Error("AppDataManager instance already exists.");
        }

        console.log("Generating 'AppDataManager' instance.");
        this._instance = new AppDataManager(user_id);

        return this._instance;
    }

    public static getInstance(): AppDataManager {
        if (!this._instance) {
            throw new Error("'AppDataManager' instance doesn't exist.");
        }
        return this._instance;
    }

    private user_id: number;

    public targets?: Target[];
    public todos?: ToDo[];
    public terms?: Term[];
    public habitReminds?: HabitRemind[];
    public archives?: Archive[];

    // TODO: ユーザーの登録データを取得

    private getTargets() {
        return sampleTargets.filter(value => value.user_id == this.user_id);
    }

    private getToDos() {
        return sampleToDos.filter(value => value.user_id == this.user_id);
    }

    private getTerms() {
        return sampleTerms.filter(value => value.user_id == this.user_id);
    }

    private getHabitReminds() {
        return sampleHabitReminds.filter(value => value.user_id == this.user_id);
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
            this.todos = this.todos.map(value => {
                if (value.id == id) {
                    value.completed = !value.completed;
                    // 完了状態更新ログ
                    this.todoCompletionStateToggledTodoIds.push(value.id);
                }
                return value;
            })
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

    private getArchives() {
        return sampleArchives.filter(value => value.user_id == this.user_id);
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
    }

    private constructor(user_id: number) {
        this.user_id = user_id;

        this.targets = this.getTargets();
        this.todos = this.getToDos();
        this.terms = this.getTerms();
        this.habitReminds = this.getHabitReminds();
        this.archives = this.getArchives();
    }
}