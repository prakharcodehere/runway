
function makeCheck(fn) { return fn; }

// Strips comments before running keyword checks so required terms can't be
// satisfied by stuffing them into a comment instead of real code.
export function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

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
        check: makeCheck((code) => /try\s*\{/.test(code) && /catch\s*\([^)]*\)\s*\{\s*[^}\s][^}]*\}/.test(code)),
      },
    ],
  },
  {
    id: "shopping-cart",
    title: "Shopping Cart",
    difficulty: "medium",
    timeLimit: 40,
    tag: "State · Derived totals",
    description:
      "Build a product list with an add-to-cart flow, a cart badge/summary that reflects quantity and total price, and the ability to increment, decrement, and remove items.",
    requirements: [
      "Render a list of products with name, price and an 'Add to Cart' button",
      "Cart state tracks quantity per product",
      "Cart badge/summary shows total item count and total price",
      "Increment / decrement quantity per cart item",
      "Remove an item from the cart",
      "Empty-cart state message when cart has no items",
    ],
    testCases: [
      {
        id: "t1",
        label: "FlatList used for product list",
        points: 15,
        check: makeCheck((code) => /FlatList/.test(code)),
      },
      {
        id: "t2",
        label: "Cart state tracked (useState with quantity/cart)",
        points: 20,
        check: makeCheck((code) => /useState/.test(code) && /(cart|quantity|qty)/i.test(code)),
      },
      {
        id: "t3",
        label: "Total price is calculated (reduce / sum over price*qty)",
        points: 20,
        check: makeCheck((code) => /reduce\s*\(/.test(code) && /(total|sum)/i.test(code)),
      },
      {
        id: "t4",
        label: "Increment / decrement handlers present",
        points: 15,
        check: makeCheck((code) => /(increment|decrement|\+\+|\-\-|\+\s*1|\-\s*1)/i.test(code)),
      },
      {
        id: "t5",
        label: "Remove-from-cart handler present",
        points: 15,
        check: makeCheck((code) => /remove/i.test(code) && /(cart|item)/i.test(code)),
      },
      {
        id: "t6",
        label: "Empty-cart state message",
        points: 15,
        check: makeCheck((code) => /empty/i.test(code) && /cart/i.test(code)),
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
        label: "useCallback used for handlers",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /useCallback/.test(code)),
      },
      {
        id: "bp4",
        label: "No console.log left in code",
        points: 5,
        group: "practice",
        check: makeCheck((code) => !/console\.log/.test(code)),
      },
      {
        id: "bp5",
        label: "Price formatted (toFixed / Intl / currency symbol)",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /toFixed|Intl\.NumberFormat|\$\{/.test(code)),
      },
    ],
  },
  {
    id: "todo-persist",
    title: "Persistent Todo List",
    difficulty: "easy",
    timeLimit: 30,
    tag: "AsyncStorage · CRUD",
    description:
      "Build a todo list where items can be added, toggled complete, and deleted, with the list persisted across app reloads using AsyncStorage.",
    requirements: [
      "Add a new todo via a text input + button",
      "Toggle a todo's completed state (e.g. tap or checkbox)",
      "Delete a todo",
      "Persist todos to AsyncStorage on change",
      "Load persisted todos on mount",
      "Show a count of remaining (incomplete) todos",
    ],
    testCases: [
      {
        id: "t1",
        label: "FlatList used for rendering todos",
        points: 15,
        check: makeCheck((code) => /FlatList/.test(code)),
      },
      {
        id: "t2",
        label: "AsyncStorage imported and used to persist",
        points: 25,
        check: makeCheck((code) => /AsyncStorage/.test(code) && /setItem/.test(code)),
      },
      {
        id: "t3",
        label: "AsyncStorage read on mount (getItem inside useEffect)",
        points: 20,
        check: makeCheck((code) => /getItem/.test(code) && /useEffect/.test(code)),
      },
      {
        id: "t4",
        label: "Toggle-complete handler present",
        points: 15,
        check: makeCheck((code) => /(toggle|complete)/i.test(code)),
      },
      {
        id: "t5",
        label: "Delete handler present",
        points: 15,
        check: makeCheck((code) => /delete|remove/i.test(code)),
      },
      {
        id: "t6",
        label: "Remaining/incomplete count shown",
        points: 10,
        check: makeCheck((code) => /remaining|left|incomplete/i.test(code)),
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
        label: "try / catch around AsyncStorage calls",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /try\s*\{/.test(code) && /catch\s*\([^)]*\)\s*\{\s*[^}\s][^}]*\}/.test(code)),
      },
      {
        id: "bp4",
        label: "No console.log left in code",
        points: 5,
        group: "practice",
        check: makeCheck((code) => !/console\.log/.test(code)),
      },
      {
        id: "bp5",
        label: "useCallback used for handlers",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /useCallback/.test(code)),
      },
    ],
  },
  {
    id: "chat-ui",
    title: "Chat Screen",
    difficulty: "hard",
    timeLimit: 50,
    tag: "Inverted list · Keyboard",
    description:
      "Build a chat screen with a message list (own vs. other messages styled differently), a text input with a send button, and correct behavior when the keyboard opens.",
    requirements: [
      "Render messages in an inverted FlatList (newest at bottom)",
      "Own messages and other messages are styled/aligned differently",
      "Text input + Send button appends a new message",
      "Input clears after sending",
      "KeyboardAvoidingView (or equivalent) so the input isn't covered by the keyboard",
      "Timestamp shown per message",
    ],
    testCases: [
      {
        id: "t1",
        label: "FlatList used, inverted for chat order",
        points: 20,
        check: makeCheck((code) => /FlatList/.test(code) && /inverted/.test(code)),
      },
      {
        id: "t2",
        label: "Own vs. other message styling differs (conditional style)",
        points: 20,
        check: makeCheck((code) => /(isOwn|sender|fromMe|self)/i.test(code) && /\?/.test(code)),
      },
      {
        id: "t3",
        label: "Send handler appends a new message to state",
        points: 20,
        check: makeCheck((code) => /send/i.test(code) && /(setMessages|messages\s*\.\s*(push|concat)|\[\s*\.\.\.)/.test(code)),
      },
      {
        id: "t4",
        label: "Input cleared after send (setText/setInput to empty string)",
        points: 10,
        check: makeCheck((code) => /(setText|setInput|setMessage)\s*\(\s*["'`]{2}\s*\)/.test(code)),
      },
      {
        id: "t5",
        label: "KeyboardAvoidingView used",
        points: 20,
        check: makeCheck((code) => /KeyboardAvoidingView/.test(code)),
      },
      {
        id: "t6",
        label: "Timestamp rendered per message",
        points: 10,
        check: makeCheck((code) => /(timestamp|time|Date)/i.test(code)),
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
        label: "useCallback used for handlers",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /useCallback/.test(code)),
      },
      {
        id: "bp4",
        label: "No console.log left in code",
        points: 5,
        group: "practice",
        check: makeCheck((code) => !/console\.log/.test(code)),
      },
      {
        id: "bp5",
        label: "SafeAreaView used for screen root",
        points: 5,
        group: "practice",
        check: makeCheck((code) => /SafeAreaView/.test(code)),
      },
    ],
  },
];
