import { NavigationState } from "../state/navigationState"

export default class AppNavigatoinListManager {
  private static _instance: AppNavigatoinListManager

  public static generateInstance(): AppNavigatoinListManager {
    // インスタンスが既に生成されている場合にエラー
    if (this._instance) {
      throw new Error("AppNavigationManager instance already exists.")
    }

    console.log("Generating 'AppNavigationManager' instance.")
    this._instance = new AppNavigatoinListManager()

    return this._instance
  }

  public static getInstance(): AppNavigatoinListManager {
    if (!this._instance) {
      throw new Error("'AppNavigationManager' instance doesn't exist.")
    }
    return this._instance
  }

  // ナビゲーションに表示するリスト
  public navigationListItems: NavigationState[] = [
    { name: "All" },
    { name: "Today" },
    { name: "Weekly" },
    { name: "Dashboard" },
  ]

  /**
   * インスタンス生成時に保持したユーザーIDからナビゲーション状態の初期値を取得
   * @returns NavigationState
   */
  public getInitNavigationState(): NavigationState {
    // TODO: ユーザーが保持しているナビゲーション状態を取得
    return { name: "All" }
  }

  /**
   * インスタンス生成時に保持したユーザーIDからナビゲーションドロワーの表示状態の初期値を取得
   * @returns boolean
   */
  public getInitNavigationDrawerOpenState(): boolean {
    // TODO: ユーザーが保持しているドロワー表示状態を取得
    return true
  }

  private getInitNavigationItemList(): NavigationState[] {
    // TODO: ユーザーが設定したナビゲーション項目の表示設定を取得
    return [
      { name: "All" },
      { name: "Today" },
      { name: "Weekly" },
      { name: "Dashboard" },
    ]
  }

  private constructor() {
    // ユーザーが設定したナビゲーション項目の表示設定を適応
    this.navigationListItems = this.getInitNavigationItemList()
  }
}
