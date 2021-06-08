import { Target } from "./target";

export type Document = {
    id: number
    user_id: number

    name: string
    url: URL

    targetList: Target[]
}