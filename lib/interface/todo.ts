import { Document } from "./document";
import { Target } from "./target"
import { Term } from "./term";

export type ToDo = {
    id: string
    user_id: number

    name: string
    description?: string

    startDatetimeScheduled?: Date

    // 開始時間情報が登録されているかどうか
    timeInfoExisted: boolean

    processingTimeScheduled?: number

    // 繰り返し周期
    repeatPattern?: 'Daily' | 'Weekly' | 'Monthly'
    // 毎週の繰り返す曜日情報
    repeatDayForWeekly?: number[]

    targetList?: Target[]
    term?: Term

    documentList?: Document[]

    completed: boolean

    archived: boolean
}