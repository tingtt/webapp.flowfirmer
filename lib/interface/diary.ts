export type Diary = {
    id: number
    user_id: number

    // 日記の文章
    text: string
    // 感情リスト
    feelings: []
}