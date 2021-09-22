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
    targetId: string
} | {
    name: 'Dashboard'
    hidden?: true
}