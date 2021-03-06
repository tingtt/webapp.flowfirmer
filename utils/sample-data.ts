import {
  Target,
  OutcomeScheme,
  ToDo,
  Term,
  HabitRemind,
  Document,
  Archive,
  FeelingType,
} from "../lib/interface/index"

export const sampleOutcomeSchemes: OutcomeScheme[] = [
  {
    id: "0",

    target_id: "0",

    name: "スクワット",
    unitName: "回",

    statisticsRule: "Max",
    targetValue: undefined,
    defaultValue: 20,
  },
  {
    id: "1",

    target_id: "0",

    name: "腹筋",
    unitName: "回",

    statisticsRule: "Max",
    targetValue: undefined,
    defaultValue: 20,
  },
  {
    id: "2",

    target_id: "0",

    name: "HIIT",
    unitName: "分",

    statisticsRule: "Sum",
    targetValue: undefined,
    defaultValue: 4,
  },
]

export const sampleTargets: Target[] = [
  {
    id: "0",

    name: "トレーニング",
    themeColor: {
      r: 26,
      g: 188,
      b: 156,
    },

    outcomeSchemes: [sampleOutcomeSchemes[0], sampleOutcomeSchemes[1]],

    childTargetList: undefined,
    parentTarget: undefined,
  },
  {
    id: "1",

    name: "Flowfirmer",
    themeColor: {
      r: 126,
      g: 214,
      b: 223,
    },

    pinnedAtNavigationList: true,
  },
  {
    id: "2",

    name: "IntelliBase",
    themeColor: {
      r: 246,
      g: 229,
      b: 141,
    },

    hiddenAtNavigationList: true,
  },
]

export const sampleDocument: Document[] = [
  {
    id: "0",

    name: "sample document",
    url: new URL(
      "https://www.notion.so/tingtt/API-0401a6a3f8904a5988c9661c04243c4f"
    ),

    targetList: [sampleTargets[1]],
  },
  {
    id: "1",

    name: "設計（UIワイヤーフレーム）",
    url: new URL(
      "https://www.notion.so/tingtt/UI-d0a121463f9e4302b4015197f9165f01"
    ),

    targetList: [sampleTargets[1]],
  },
  {
    id: "2",

    name: "設計（オブジェクトとシナリオ）",
    url: new URL(
      "https://www.notion.so/tingtt/d8466c9cc66745db909a068d58b76401"
    ),

    targetList: [sampleTargets[1]],
  },
  {
    id: "3",

    name: "設計（DB）",
    url: new URL(
      "https://www.notion.so/tingtt/DB-7ee6cf9fdeae4a7198aecb495c324fa2"
    ),

    targetList: [sampleTargets[1]],
  },
]

export const sampleTerms: Term[] = [
  {
    id: "0",

    name: "スクワットと腹筋の習慣化",
    description: "腹筋割るぞ−",

    targetList: [sampleTargets[0]],

    startDatetimeScheduled: new Date(2021, 6, 1),
    endDatetimeScheduled: new Date(2021, 6, 1),

    startDatetime: new Date(2021, 6, 1),
    endDatetime: undefined,

    toDoList: undefined,

    documentList: undefined,
  },
  {
    id: "1",

    name: "ToDay画面",

    targetList: [sampleTargets[1]],

    startDatetimeScheduled: new Date(2021, 6, 14),
    endDatetimeScheduled: new Date(2021, 6, 18),

    startDatetime: new Date(2021, 6, 14),
    endDatetime: new Date(2021, 6, 20),

    toDoList: undefined,

    documentList: [sampleDocument[1]],
  },
  {
    id: "2",

    name: "Weekly画面",

    targetList: [sampleTargets[1]],

    startDatetimeScheduled: new Date(2021, 6, 21),
    endDatetimeScheduled: new Date(2021, 6, 25),

    startDatetime: new Date(2021, 6, 21),
    endDatetime: undefined,

    toDoList: undefined,

    documentList: [sampleDocument[1]],
  },
  {
    id: "3",

    name: "データ管理クラス",

    targetList: [sampleTargets[1]],

    startDatetimeScheduled: new Date(2021, 6, 21),
    endDatetimeScheduled: new Date(2021, 6, 25),

    startDatetime: new Date(2021, 6, 21),
    endDatetime: undefined,

    toDoList: undefined,

    documentList: [sampleDocument[2], sampleDocument[3]],
  },
  {
    id: "4",

    name: "プロパティ更新実装",

    targetList: [sampleTargets[1]],

    startDatetimeScheduled: new Date(2021, 6, 28),
    endDatetimeScheduled: new Date(2021, 7, 2),

    startDatetime: undefined,
    endDatetime: undefined,

    toDoList: undefined,

    documentList: [sampleDocument[2], sampleDocument[3]],
  },
  {
    id: "5",

    name: "ToDo, Term詳細モーダル",

    targetList: [sampleTargets[1]],

    startDatetimeScheduled: new Date(2021, 6, 28),
    endDatetimeScheduled: new Date(2021, 7, 2),

    startDatetime: undefined,
    endDatetime: undefined,

    toDoList: undefined,

    documentList: [sampleDocument[1]],
  },
]

export const sampleToDos: ToDo[] = [
  {
    id: "0",

    name: "1セット",

    startDatetimeScheduled: new Date(2021, 6, 7, 17),
    timeInfoExisted: true,
    processingTimeScheduled: 25,

    repeatPattern: "Weekly",
    repeatDayForWeekly: [1],

    targetList: [sampleTargets[0]],
    term: sampleTerms[0],

    completed: true,

    archived: true,
  },
  {
    id: "1",

    name: "1セット",

    startDatetimeScheduled: new Date(2021, 6, 10, 17),
    timeInfoExisted: true,
    processingTimeScheduled: 70,

    repeatPattern: "Weekly",
    repeatDayForWeekly: [4],

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: false,

    archived: false,
  },
  {
    id: "2",

    name: "1セット",
    description: "スクワットと腹筋",

    startDatetimeScheduled: new Date(2021, 6, 14, 17),
    timeInfoExisted: true,
    processingTimeScheduled: 25,

    repeatPattern: "Weekly",
    repeatDayForWeekly: [1],

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: false,

    archived: false,
  },
  {
    id: "3",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 14, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "4",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 15, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "5",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 16, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "6",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 17, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "7",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 18, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "8",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 19, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "9",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 20, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "10",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 22, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: true,

    archived: true,
  },
  {
    id: "11",

    name: "朝HIIT",
    description:
      "バーピー, マウンテンクライマー, スクワットスラスト, ジャンピングジャック",

    startDatetimeScheduled: new Date(2021, 6, 23, 5, 30),
    timeInfoExisted: true,
    processingTimeScheduled: 4,

    repeatPattern: "Daily",

    targetList: [sampleTargets[0]],
    term: undefined,

    completed: false,

    archived: false,
  },
]

export const sampleHabitReminds: HabitRemind[] = [
  {
    id: "0",

    name: "トレーニングが終わったら水分補給をする",

    target: sampleTargets[0],
  },
]

export const sampleFeelingTypes: FeelingType[] = [
  {
    id: 24,

    name: "スッキリ",

    defaultPositivePercent: 70,
    defaultNegativePercent: 0,
  },
]

export const sampleArchives: Archive[] = [
  {
    id: "0",

    refInfo: {
      startDateTime: sampleToDos[0].startDatetimeScheduled!,
      processingTime: sampleToDos[0].processingTimeScheduled!,
      refType: "ToDo",
      ref: sampleToDos[0],
    },

    // // checkInDateTime: new Date(2001, 6, 7, 17, 25),

    targets: [sampleTargets[0]],

    outcomes: [
      {
        scheme: sampleOutcomeSchemes[0],
        value: 20,
      },
      {
        scheme: sampleOutcomeSchemes[1],
        value: 20,
      },
    ],

    text: "きつかったけどスッキリした〜",
    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 70,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 7, 17),
  },
  {
    id: "1",

    refInfo: {
      refType: "HabitRemind",
      ref: sampleHabitReminds[0],
    },

    // // checkInDateTime: new Date(2001, 6, 7, 17, 30),

    targets: [sampleTargets[0]],

    outcomes: [
      {
        scheme: sampleOutcomeSchemes[0],
        value: 30,
      },
      {
        scheme: sampleOutcomeSchemes[1],
        value: 30,
      },
    ],

    text: "水飲んで生き返った〜",
    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 60,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 7, 17, 30),
  },
  {
    id: "2",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[3],
      startDateTime: sampleToDos[3].startDatetimeScheduled!,
      processingTime: sampleToDos[3].processingTimeScheduled!,
    },

    // // checkInDateTime: new Date(2001, 6, 14, 5, 34),

    targets: [sampleTargets[0]],

    outcomes: [
      {
        scheme: sampleOutcomeSchemes[0],
        value: 100,
      },
      {
        scheme: sampleOutcomeSchemes[1],
        value: 150,
      },
    ],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 70,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 14, 5, 35),
  },
  {
    id: "3",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[4],
      startDateTime: sampleToDos[4].startDatetimeScheduled!,
      processingTime: sampleToDos[4].processingTimeScheduled!,
    },

    // // checkInDateTime: new Date(2001, 6, 15, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 70,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 15, 5, 35),
  },
  {
    id: "4",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[5],
      startDateTime: sampleToDos[5].startDatetimeScheduled!,
      processingTime: sampleToDos[5].processingTimeScheduled!,
    },

    // // checkInDateTime: new Date(2001, 6, 16, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 70,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 16, 5, 35),
  },
  {
    id: "5",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[6],
      startDateTime: sampleToDos[6].startDatetimeScheduled!,
      processingTime: sampleToDos[6].processingTimeScheduled!,
    },

    // // checkInDateTime: new Date(2001, 6, 17, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 70,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 17, 5, 35),
  },
  {
    id: "6",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[7],
      startDateTime: sampleToDos[7].startDatetimeScheduled!,
      processingTime: sampleToDos[7].processingTimeScheduled!,
    },

    // checkInDateTime: new Date(2001, 6, 18, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 80,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 18, 5, 35),
  },
  {
    id: "7",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[8],
      startDateTime: new Date(2001, 6, 19, 6),
      processingTime: sampleToDos[8].processingTimeScheduled!,
    },

    // checkInDateTime: new Date(2001, 6, 19, 6, 4),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 40,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 19, 6, 10),
  },
  {
    id: "8",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[9],
      startDateTime: sampleToDos[9].startDatetimeScheduled!,
      processingTime: sampleToDos[9].processingTimeScheduled!,
    },

    // checkInDateTime: new Date(2001, 6, 20, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 50,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 20, 5, 35),
  },
  {
    id: "9",

    refInfo: {
      refType: "ToDo",
      ref: sampleToDos[10],
      startDateTime: sampleToDos[10].startDatetimeScheduled!,
      processingTime: sampleToDos[10].processingTimeScheduled!,
    },

    // checkInDateTime: new Date(2001, 6, 22, 5, 34),

    targets: [sampleTargets[0]],

    feelingList: [
      {
        feeling: sampleFeelingTypes[0],
        positivePercent: 60,
        negativePercent: 0,
      },
    ],

    recordingDateTime: new Date(2001, 6, 22, 5, 35),
  },
]
