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

    private getArchives() {
        return sampleArchives.filter(value => value.user_id == this.user_id);
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