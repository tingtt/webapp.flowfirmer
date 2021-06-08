import { Target, OutcomeScheme, ToDo, Term, HabitRemind, Document, Archive, FeelingType} from "../lib/interface/index";

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

export const sampleDocument: Document[] = [
    {
        id: 0,
        user_id: 0,

        name: "sample document",
        url: new URL("https://www.notion.so/tingtt/API-0401a6a3f8904a5988c9661c04243c4f"),

        targetList: [sampleTargets[0]]
    }
]

export const smapleHabitReminds: HabitRemind[] = [
    {
        id: 0,
        user_id: 0,

        name: "トレーニングが終わったら水分補給をする",

        target: sampleTargets[0]
    }
]

export const sampleFeelingTypes: FeelingType[] = [
    {
        id: 0,
        user_id: 0,

        name: "スッキリ",

        defaultPositivePercent: 70,
        defaultNegativePercent: 0
    },
]

export const smapleArchives: Archive[] = [
    {
        id: 0,
        user_id: 0,

        refType: 'ToDo',
        ref: sampleToDos[0],

        targets: [sampleTargets[0]],

        // 成果リスト
        outcomes: [
            {
                scheme: sampleOutcomeSchemes[0],
                value: 20
            },
            {
                scheme: sampleOutcomeSchemes[1],
                value: 20
            }
        ],

        text: "",
        feelingList: [
            {
                feeling: sampleFeelingTypes[0],
                positivePercent: 70,
                negativePercent: 0,
            }
        ],

        datetime: new Date(2001, 6, 7, 17)
    },
]