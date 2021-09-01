import { Document } from "./document";
import { Target } from "./target";
import { ToDo } from "./todo";

export type Term = {
    id: string
    user_id: number

    name: string
    description?: string

    targetList?: Target[]

    startDatetimeScheduled: Date
    endDatetimeScheduled: Date

    startDatetime?: Date
    endDatetime?: Date

    toDoList?: ToDo[]

    documentList?: Document[]
}