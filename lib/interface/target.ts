export type Target = {
    id: number
    user_id: number

    name: string
    themeColor: string

    outcomeSchemes: OutcomeScheme[] | null

    childTargetList: Target[] | null
    parentTarget: Target | null
}

// 成果記録の型
export type OutcomeScheme = {
    id: number
    user_id: number

    target_id: number

    name: string
    //単位
    unitName: string

    // 記録の計算法
    statisticsRule: 'String' | 'Sum' | 'Max' | 'Min'
    // 目標値（記録のデータ型がstringの場合はnull）
    targetValue: number | null
    // 入力デフォルト値
    defaultValue: string | number
}