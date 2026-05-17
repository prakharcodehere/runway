
function makeCheck(fn) { return fn; }

export const CHALLENGES = [
  {
    id: "jobs-listing",
    title: "Job Listings App",
    difficulty: "medium",
    timeLimit: 45,
    tag: "API · Infinite Scroll",
    description:
      "Build a job board that fetches listings from a REST API, supports infinite scroll and title search, and handles loading/error states gracefully.",
    endpoint: "https://xyz.com/common/jobs?page=1",
    requirements: [
      "Fetch and display jobs from the given endpoint",
      "Each card shows: title, salary, phone number & location",
      "Search by job title",
      "Infinite scroll — load more on reaching end of list",
      "Show ActivityIndicator while loading",
      "Show error message with a Retry button on failure",
    ],
    testCases: [
      {
        id: "t1",
        label: "FlatList used for rendering jobs",
        points: 15,
        check: makeCheck((code) => /FlatList/.test(code)),
      },
      {
        id: "t2",
        label: "API fetch called (fetch / useEffect present)",
        points: 15,
        check: makeCheck((code) => /fetch\s*\(/.test(code) && /useEffect/.test(code)),
      },
      {
        id: "t3",
        label: "JobCard shows salary, phone & location",
        points: 20,
        check: makeCheck((code) => /salary/i.test(code) && /phone/i.test(code) && /location/i.test(code)),
      },
      {
        id: "t4",
        label: "Search filters jobs by title",
        points: 15,
        check: makeCheck((code) => /(search|filter|query)/i.test(code) && /title/i.test(code)),
      },
      {
        id: "t5",
        label: "Loading state with ActivityIndicator",
        points: 15,
        check: makeCheck((code) => /ActivityIndicator/i.test(code) && /loading/i.test(code)),
      },
      {
        id: "t6",
        label: "Error state + Retry button",
        points: 10,
        check: makeCheck((code) => /error/i.test(code) && /retry/i.test(code)),
      },
      {
        id: "t7",
        label: "Infinite scroll — page increments on loadMore",
        points: 10,
        check: makeCheck((code) => /setPage|page\s*\+/.test(code) && /loadMore|onEndReached/.test(code)),
      },
      // Best practices
      {
        id: "bp1",
        label: "TypeScript types / interfaces defined",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /interface\s+\w+|type\s+\w+\s*=/.test(code)),
      },
      {
        id: "bp2",
        label: "keyExtractor defined on FlatList",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /keyExtractor/.test(code)),
      },
      {
        id: "bp3",
        label: "API URL stored as a constant",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /const\s+[A-Z_]+\s*=\s*['"`]https?:\/\//.test(code)),
      },
      {
        id: "bp4",
        label: "useCallback used for handlers",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /useCallback/.test(code)),
      },
      {
        id: "bp5",
        label: "No console.log left in code",
        points: 5,
        group: "practice",
        check: makeCheck((code) => !/console\.log/.test(code)),
      },
      {
        id: "bp6",
        label: "try / catch used in async fetch",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /try\s*\{/.test(code) && /catch\s*\(/.test(code)),
      },
    ],
  },
];
