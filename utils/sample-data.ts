import { Target, OutcomeScheme, ToDo, Term, HabitRemind, Document, Diary, Archive} from "../lib/interface/index";

export const sampleOutcomeSchemes: OutcomeScheme[] = [
    {
        id: 0,
        user_id: 0,

        target_id: 0,

        name: "スクワット",
        unitName: "回",

        statisticsRule: 'Max',
        targetValue: null,
        defaultValue: 20
    },
    {
        id: 1,
        user_id: 0,

        target_id: 0,

        name: "腹筋",
        unitName: "回",

        statisticsRule: "Max",
        targetValue: null,
        defaultValue: 20
    }
]

export const sampleTargets: Target[] = [
    {
        id: 0,
        user_id: 0,

        name: "トレーニング",
        themeColor: "",

        outcomeSchemes: sampleOutcomeSchemes,

        childTargetList: null,
        parentTarget: null
    }
]

export const sampleToDos: ToDo[] = [
    {
        id: 0,
        user_id: 0,

        name: "1セット",
        description: "スクワットと腹筋",

        startDatetimeScheduled: new Date,
        timeInfoExisted: false,
        processingTimeScheduled: 25,

        repeatPattern: null,
        repeatWeeklyCondition: null,

        targetList: sampleTargets,
        term: null,

        status: false
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