import { sampleArchives, sampleHabitReminds, sampleTargets, sampleTerms, sampleToDos } from "../../utils/sample-data";
import { Archive, HabitRemind, Target, Term, ToDo } from "../interface/index";

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

    private constructor(user_id: number) {
        this.user_id = user_id;

        this.targets = this.getTargets();
        this.todos = this.getToDos();
        this.terms = this.getTerms();
        this.habitReminds = this.getHabitReminds();
        this.archives = this.getArchives();
    }
}