import { Target } from "./target";

export type Document = {
    id: string
    user_id: number

    name: string
    url: URL

    targetList: Target[]
}