import { Target } from "../interface";

export type NavigationState = {
    name: 'Today'
    hidden?: true
} | {
    name: 'All'
    hidden?: true
} | {
    name: 'Weekly'
    hidden?: true
} | {
    name: 'Target',
    target: Target
} | {
    name: 'Dashboard'
    hidden?: true
}