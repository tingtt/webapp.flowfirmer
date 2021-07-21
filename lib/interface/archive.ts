import { HabitRemind } from "./habitRemind";
import { OutcomeScheme, Target } from "./target";
import { ToDo } from "./todo";

export type Percentage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100;

// 感情日記と成果記録
export type Archive = {
    id: number
    user_id: number

    // 紐付け
    refInfo: {
        refType: 'ToDo'
        ref: ToDo
        startDateTime: Date
        processingTime: number
    } | {
        refType: 'HabitRemind'
        ref: HabitRemind
    } | {
        refType: 'undefined'
    }

    // to-doを完了した日時
    checkInDateTime: Date

    targets?: Target[]

    // 成果リスト
    outcomes?: {
        scheme: OutcomeScheme,
        value: string | number
    }[]

    // 日記
    text?: String
    feelingList?: {
            feeling: FeelingType
            // 実際のポジティブ度・ネガティブ度（変更がない場合はFeelingTypeに登録したデフォルト値をコピー）
            positivePercent: Percentage
            negativePercent: Percentage
    }[]

    // 記録日時
    recordingDateTime: Date
}

export type FeelingType = {
    id: number

    //ユーザーが追加したものの場合に使用
    user_id?: number

    name: string

    // デフォルトのポシティブ・ネガティブ度
    defaultPositivePercent: Percentage
    defaultNegativePercent: Percentage
}