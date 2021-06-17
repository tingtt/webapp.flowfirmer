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
    },
    {
        id: 1,
        user_id: 0,

        name: "Flowfirmer",
        themeColor: "",

        pinnedAtNavigationList: true
    },
    {
        id: 2,
        user_id: 0,

        name: "IntelliBase",
        themeColor: "",

        hiddenAtNavigationList: true
    }
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

        toDoList: undefined,

        documentList: undefined
    },
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
        repeatDayForWeekly: ['Mon.'],

        targetList: [sampleTargets[0]],
        term: sampleTerms[0],

        completed: true
    },
    {
        id: 1,
        user_id: 0,

        name: "1セット",

        startDatetimeScheduled: new Date(2001, 6, 10, 17),
        timeInfoExisted: true,
        processingTimeScheduled: 70,

        repeatPattern: 'Weekly',
        repeatDayForWeekly: ['Thu.'],

        targetList: [sampleTargets[0]],
        term: undefined,

        completed: false
    },
    {
        id: 2,
        user_id: 0,

        name: "1セット",
        description: "スクワットと腹筋",

        startDatetimeScheduled: new Date(2001, 6, 14, 17),
        timeInfoExisted: true,
        processingTimeScheduled: 25,

        repeatPattern: 'Weekly',
        repeatDayForWeekly: ['Mon.'],

        targetList: [sampleTargets[0]],
        term: undefined,

        completed: false
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

export const sampleHabitReminds: HabitRemind[] = [
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

export const sampleArchives: Archive[] = [
    {
        id: 0,
        user_id: 0,

        refType: 'ToDo',
        ref: sampleToDos[0],

        targets: [sampleTargets[0]],

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

        text: "きつかったけどスッキリした〜",
        feelingList: [
            {
                feeling: sampleFeelingTypes[0],
                positivePercent: 70,
                negativePercent: 0,
            }
        ],

        datetime: new Date(2001, 6, 7, 17)
    },
    {
        id: 1,
        user_id: 0,

        refType: 'HabitRemind',
        ref: sampleHabitReminds[0],

        targets: [sampleTargets[0]],

        text: "水飲んで生き返った〜",
        feelingList: [
            {
                feeling: sampleFeelingTypes[0],
                positivePercent: 60,
                negativePercent: 0,
            }
        ],

        datetime: new Date(2001, 6, 7, 17, 30)
    }
]