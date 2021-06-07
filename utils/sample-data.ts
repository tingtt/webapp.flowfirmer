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
]

export const sampleTarget: Target[] = [
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