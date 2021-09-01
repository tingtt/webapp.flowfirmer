export type Target = {
    id: string
    user_id: number

    name: string
    themeColor: {
        r: number
        g: number
        b: number
    }

    outcomeSchemes?: OutcomeScheme[]

    childTargetList?: Target[]
    parentTarget?: Target

    pinnedAtNavigationList?: true
    hiddenAtNavigationList?: true
}

// 成果記録の型
export type OutcomeScheme = {
    id: number
    user_id: number

    target_id: number

    name: string
    //単位
    unitName?: string

    // 記録の計算法
    statisticsRule: 'String' | 'Sum' | 'Max' | 'Min'
    // 目標値（記録のデータ型がstringの場合はnull）
    targetValue?: number
    // 入力デフォルト値
    defaultValue?: string | number
}