export type Target = {
    id: number
    user_id: number

    name: string
    themeColor: string

    outcomeSchemes: [OutcomeScheme]

    childTargetList: [Target]
    parentTarget: Target
}

// 成果記録の型
export type OutcomeScheme = {
    id: number
    user_id: number

    target: Target

    name: string
    //単位
    unitName: string

    // 記録の計算法
    statisticsRule: StatisticsRule
    // 目標値（記録のデータ型がstringの場合はnull）
    targetValue: number | null
    // 入力デフォルト値
    defaultValue: string | number
}

// 統計用の計算方式
enum StatisticsRule {
    // 文字列で記録
    String,
    // 数値で記録（計算有）
    Sum,
    Sub,
    Max,
    Min
}