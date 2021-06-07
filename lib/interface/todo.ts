import { Target } from "./target"
import { Term } from "./term";

export type ToDo = {
    id: number
    user_id: number

    name: string
    description: string

    startDatetimeScheduled: Date

    // 開始時間情報が登録されているかどうか
    timeInfoExisted: Boolean

    processingTimeScheduled: number

    // to-doの繰り返し情報
    repeatPattern: null | 'Daily' | 'Weekly' | 'Monthly'
    // 毎週の繰り返す曜日情報
    repeatWeeklyCondition: null | number[]

    targetList: Target[]
    term: Term | null

    status: Boolean
}