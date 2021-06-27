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

    private getArchives() {
        return sampleArchives.filter(value => value.user_id == this.user_id);
    }

    /**
     *
     * @param name string
     * @param themeColor string
     * @returns Target
     */
    public registerTarget(name: string, themeColor?: string): Target {
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
                "#" + ("000000" + (Math.random() * 0xFFFFFF | 0).toString(16)).slice(-6),
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