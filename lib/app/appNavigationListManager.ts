import { NavigationState } from "../state/navigationState";
import { Target } from "../interface/index";

//sampleData
import { sampleTargets } from "../../utils/sample-data"

export default class AppNavigatoinListManager {

    private static _instance: AppNavigatoinListManager;

    public static generateInstance(user_id?: number): AppNavigatoinListManager {
        if (!this._instance) {
            if (user_id != undefined) {
                console.log("Generating 'AppStateManager' instance.");
                this._instance = new AppNavigatoinListManager(user_id);
            } else {
                // インスタンス未生成時にユーザーIDが引数に存在しないときにエラー
                throw new Error("AppStateManager needs 'user_id' to generate instance.");
            }
        }
        return this._instance;
    }

    public static getInstance(): AppNavigatoinListManager {
        if (!this._instance) {
            throw new Error("'AppNavigationManager' instance doesn't exist.");
        }
        return this._instance;
    }

    // ユーザーID
    private user_id: number

    // ナビゲーションに表示するリスト
    public navigationListItems = {
        originalItems: [
            { name: 'All' },
            { name: 'Today' },
            { name: 'Weekly' },
            { name: 'Dashboard'}
        ] as NavigationState[],
        pinnedTargets: [

        ] as NavigationState[],
        otherTargets: [

        ] as NavigationState[],
    }

    /**
     * インスタンス生成時に保持したユーザーIDからナビゲーション状態の初期値を取得
     * @returns NavigationState
     */
    public getInitNavigationState(): NavigationState {
        // TODO: ユーザーが保持しているナビゲーション状態を取得
        return {name: 'All'};
    }

    /**
     * インスタンス生成時に保持したユーザーIDからナビゲーションドロワーの表示状態の初期値を取得
     * @returns boolean
     */
    public getInitNavigationDrawerOpenState(): boolean {
        // TODO: ユーザーが保持しているドロワー表示状態を取得
        return true;
    }

    private getInitNavigationItemList(): NavigationState[] {
        // TODO: ユーザーが設定したナビゲーション項目の表示設定を取得
        return [
            { name: 'All' },
            { name: 'Today' },
            { name: 'Weekly' },
            { name: 'Dashboard'}
        ];
    }

    /**
     * インスタンス生成時に保持したユーザーIDからTargetを取得
     * @returns Target[]
     */
    private getTargets(): Target[] {
        return sampleTargets.filter(value => value.user_id == this.user_id);
    }

    private constructor(user_id: number) {

        // インスタンスが既に生成されている場合にエラー
        if (AppNavigatoinListManager._instance) {
            throw new Error("AppStateManager instance already exists.");
        }

        // ユーザーIDを保持
        this.user_id = user_id;

        // ユーザーが設定したナビゲーション項目の表示設定を適応
        this.navigationListItems.originalItems = this.getInitNavigationItemList()

        // ユーザーのTargetを取得
        const targets = this.getTargets();

        // ユーザーがピン留めいている且つ表示するTargetを抽出し、NavigationStateに変換してナビゲーションリストに追加
        this.navigationListItems.pinnedTargets = this.navigationListItems.pinnedTargets.concat(
            targets.filter(value => !value.hiddenAtNavigationList && value.pinnedAtNavigationList).map(value => ({name: 'Target', target: value} as NavigationState))
        );

        // ユーザーがピン留めしていない且つ表示するTargetを抽出し、NavigationStateに変換してナビゲーションリストに追加
        this.navigationListItems.otherTargets = this.navigationListItems.otherTargets.concat(
            targets.filter(value => !value.hiddenAtNavigationList && !value.pinnedAtNavigationList).map(value => ({name: 'Target', target: value} as NavigationState))
        );
    }
}