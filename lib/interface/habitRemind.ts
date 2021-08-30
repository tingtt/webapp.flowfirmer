import { Target } from "./target";

export type HabitRemind = {
    id: string
    user_id: number

    name: string

    target?: Target
}