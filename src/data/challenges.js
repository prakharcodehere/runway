const JOBS_STARTER = [
  {
    name: "App.tsx",
    accent: "aurora",
    label: "challenge",
    previewTitle: "Job Listings",
    previewCopy: "",
    code: `import { useState } from "react";
import {
  View, Text, FlatList, TextInput,
  ActivityIndicator, Pressable, StyleSheet, SafeAreaView,
} from "react-native";
import { JobCard } from "./components/JobCard";
import { useJobs } from "./hooks/useJobs";

export default function App() {
  const [search, setSearch] = useState("");
  const { jobs, loading, error, loadMore, retry } = useJobs();

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // TODO: Render a search TextInput that updates 'search' state
  // TODO: Show an ActivityIndicator when loading === true
  // TODO: Show an error message + Retry button when error !== null
  // TODO: Render a FlatList of filtered jobs using JobCard
  // TODO: Add onEndReached={loadMore} for infinite scroll

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Job Openings</Text>

      {/* 1. Search input */}

      {/* 2. Loading state */}

      {/* 3. Error + Retry */}

      {/* 4. Job list */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", color: "#f1f5f9", marginBottom: 14 },
});
`,
  },
  {
    name: "components/JobCard.tsx",
    accent: "aurora",
    label: "challenge",
    previewTitle: "",
    previewCopy: "",
    code: `import { View, Text, StyleSheet } from "react-native";

export function JobCard({ job }) {
  // TODO: Display job.title, job.salary, job.phone, job.location
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      {/* Add salary, phone, location here */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#f1f5f9" },
});
`,
  },
  {
    name: "hooks/useJobs.ts",
    accent: "cobalt",
    label: "challenge",
    previewTitle: "",
    previewCopy: "",
    code: `import { useState, useEffect } from "react";

const API = "https://xyz.com/common/jobs";

// Mock data — replaces the real API in preview
const MOCK: any[] = [
  { id: 1, title: "React Native Developer", salary: "₹12–18 LPA", phone: "9876543210", location: "Bangalore" },
  { id: 2, title: "Frontend Engineer", salary: "₹8–14 LPA", phone: "9123456789", location: "Mumbai" },
  { id: 3, title: "Mobile App Developer", salary: "₹10–16 LPA", phone: "9988776655", location: "Delhi" },
  { id: 4, title: "Full Stack Engineer", salary: "₹15–22 LPA", phone: "9871234567", location: "Hyderabad" },
  { id: 5, title: "Android Developer", salary: "₹9–15 LPA", phone: "9765432100", location: "Pune" },
  { id: 6, title: "iOS Developer", salary: "₹11–17 LPA", phone: "9654321001", location: "Chennai" },
  { id: 7, title: "DevOps Engineer", salary: "₹14–20 LPA", phone: "9543210012", location: "Bangalore" },
  { id: 8, title: "UI/UX Designer", salary: "₹7–12 LPA", phone: "9432100123", location: "Mumbai" },
];

export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchJobs(p: number) {
    setLoading(true);
    setError(null);
    try {
      // Real call (replace mock below when API is live):
      // const res = await fetch(\`\${API}?page=\${p}\`);
      // const data = await res.json();
      // setJobs((prev) => [...prev, ...data.results]);

      // Mock: simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      const pageSize = 4;
      const slice = MOCK.slice((p - 1) * pageSize, p * pageSize);
      setJobs((prev) => (p === 1 ? slice : [...prev, ...slice]));
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(page); }, [page]);

  const loadMore = () => {
    // TODO: increment page to fetch next batch
    // setPage((p) => p + 1);
  };

  const retry = () => fetchJobs(page);

  return { jobs, loading, error, loadMore, retry };
}
`,
  },
];

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
    starterFiles: JOBS_STARTER,
  },
];
