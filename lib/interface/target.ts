export type Target = {
  id: string

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
  id: string

  target_id: string

  name: string
  //単位
  unitName?: string

  // 記録の計算法
  statisticsRule: "String" | "Sum" | "Max" | "Min"
  // 目標値（記録のデータ型がstringの場合はnull）
  targetValue?: number
  // 入力デフォルト値
  defaultValue?: string | number
}
