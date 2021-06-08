import { Target, OutcomeScheme, ToDo, Term, HabitRemind, Document, Diary, Archive} from "../lib/interface/index";

export const sampleOutcomeSchemes: OutcomeScheme[] = [
    {
        id: 0,
        user_id: 0,

        target_id: 0,

        name: "スクワット",
        unitName: "回",

        statisticsRule: 'Max',
        targetValue: undefined,
        defaultValue: 20
    },
    {
        id: 1,
        user_id: 0,

        target_id: 0,

        name: "腹筋",
        unitName: "回",

        statisticsRule: "Max",
        targetValue: undefined,
        defaultValue: 20
    }
]

export const sampleTargets: Target[] = [
    {
        id: 0,
        user_id: 0,

        name: "トレーニング",
        themeColor: "",

        outcomeSchemes: [sampleOutcomeSchemes[0], sampleOutcomeSchemes[1]],

        childTargetList: undefined,
        parentTarget: undefined
    }
]

export const sampleToDos: ToDo[] = [
    {
        id: 0,
        user_id: 0,

        name: "1セット",
        description: "スクワットと腹筋",

        startDatetimeScheduled: new Date(2001, 6, 7, 17),
        timeInfoExisted: true,
        processingTimeScheduled: 25,

        repeatPattern: 'Weekly',
        repeatDayForWeekly: ['Mon.', 'Thu.'],

        targetList: [sampleTargets[0]],
        term: undefined,

        completed: true
    },
    {
        id: 1,
        user_id: 0,

        name: "1セット",
        description: "スクワットと腹筋",

        startDatetimeScheduled: new Date(2001, 6, 10, 17),
        timeInfoExisted: true,
        processingTimeScheduled: 25,

        repeatPattern: 'Weekly',
        repeatDayForWeekly: ['Mon.', 'Thu.'],

        targetList: [sampleTargets[0]],
        term: undefined,

        completed: false
    },
]

export const sampleTerms: Term[] = [
    {
        id: 0,
        user_id: 0,

        name: "スクワットと腹筋の習慣化",
        description: "腹筋割るぞ−",

        targetList: [sampleTargets[0]],

        startDatetimeScheduled: new Date(2001, 6, 1),
        endDatetimeScheduled: new Date(2001, 6, 1),

        startDatetime: new Date(2001, 6, 1),
        endDatetime: undefined,

        toDoList: [sampleToDos[0], sampleToDos[1]],

        documentList: undefined
    },
]

export const smapleHabitReminds: HabitRemind[] = [
    {
        id: 0,
        user_id: 0,

        name: "トレーニングが終わったら水分補給をする",

        target: sampleTargets[0]
    }
]