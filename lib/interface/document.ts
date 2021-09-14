import { Target } from "./target";

export type Document = {
    id: string

    name: string
    url: URL

    targetList: Target[]
}