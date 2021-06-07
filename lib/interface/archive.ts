import { Diary } from "./diary";
import { HabitRemind } from "./habitRemind";
import { OutcomeScheme, Target } from "./target";
import { ToDo } from "./todo";

// 感情日記と成果記録
export type Archive = {
    id: number
    user_id: number

    // to-doかリマインドを紐付け
    ref: { toDo: ToDo, habitRemind: null} | {toDo: null, habitRemind: HabitRemind}

    targets: Target[]

    // 成果リスト
    outcomes: [
        {
            scheme: OutcomeScheme,
            value: string | number
        }
    ]

    // 日記
    diary: Diary | null

    // 記録日時（ToDoなら実行時間の中間の時間を取る）
    datetime: Date
}