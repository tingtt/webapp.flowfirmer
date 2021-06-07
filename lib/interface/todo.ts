import { Target } from "./target"
import { Term } from "./term";

export type ToDo = {
    id: number
    user_id: number

    name: string
    description: string

    startDatetimeScheduled: Date
    processingTimeScheduled: number

    targetList: Target[]
    term: Term | null

    status: Boolean
}