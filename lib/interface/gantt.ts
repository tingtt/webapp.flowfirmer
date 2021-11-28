export type Gantt =
  | {
      name: "week"
      num?: 1 | 2 | 3 | 4 | 5 | 6
      numSelecter: [1, 2, 3, 4, 5, 6]
    }
  | {
      name: "month"
      num?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
      numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  | {
      name: "year"
      num?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
      numSelecter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
