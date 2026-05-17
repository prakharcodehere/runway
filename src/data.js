export const FILES = [
  {
    name: "App.tsx",
    label: "entry",
    accent: "aurora",
    previewTitle: "Onboarding Pulse",
    previewCopy:
      "A kinetic mobile welcome flow with parallax cards, adaptive glow, and runtime-safe gradients.",
    code: `import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { CommandDeck } from "./components/CommandDeck";
import { SignalCard } from "./components/SignalCard";

const features = [
  "Instant React Native Web preview",
  "Expo phone handoff",
  "Live session telemetry",
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18 }}>
        <Text style={{ color: "#f4efe7", fontSize: 32, fontWeight: "700" }}>
          Runway
        </Text>
        <Text style={{ color: "#87a4c2", fontSize: 15, lineHeight: 24 }}>
          Build mobile ideas in-browser, then push them straight to Expo Go.
        </Text>
        <CommandDeck title="Session live" subtitle="Preview runtime synced" />
        {features.map((item) => (
          <SignalCard key={item} label={item} tone="cyan" />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}`,
  },
  {
    name: "components/CommandDeck.tsx",
    label: "ui",
    accent: "ember",
    previewTitle: "Command Deck",
    previewCopy:
      "The control surface keeps restart, share, logs, and device handoff visible without crowding the coding loop.",
    code: `import { Pressable, Text, View } from "react-native";

type CommandDeckProps = {
  title: string;
  subtitle: string;
};

const actions = [
  { label: "Preview", tone: "#7cf7c9" },
  { label: "Logs", tone: "#ff9b71" },
  { label: "Pair", tone: "#86a8ff" },
];

export function CommandDeck({ title, subtitle }: CommandDeckProps) {
  return (
    <View
      style={{
        borderRadius: 28,
        padding: 20,
        backgroundColor: "rgba(11, 25, 42, 0.96)",
        borderWidth: 1,
        borderColor: "rgba(124, 247, 201, 0.14)",
        gap: 16,
      }}
    >
      <Text style={{ color: "#f4efe7", fontSize: 22, fontWeight: "700" }}>
        {title}
      </Text>
      <Text style={{ color: "#93aac3", fontSize: 14 }}>{subtitle}</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.03)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: action.tone, fontWeight: "600", fontSize: 12 }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}`,
  },
  {
    name: "components/SignalCard.tsx",
    label: "ui",
    accent: "mint",
    previewTitle: "Signal Card",
    previewCopy:
      "A compact status card used to surface feature tags, live indicators, and session metadata.",
    code: `import { Pressable, Text, View } from "react-native";

type SignalCardProps = {
  label: string;
  tone?: "cyan" | "amber" | "blue";
};

const TONES = {
  cyan:  { bg: "rgba(124, 247, 201, 0.08)", text: "#7cf7c9", dot: "#7cf7c9" },
  amber: { bg: "rgba(255, 155, 113, 0.08)", text: "#ff9b71", dot: "#ff9b71" },
  blue:  { bg: "rgba(142, 165, 255, 0.08)", text: "#8ea5ff", dot: "#8ea5ff" },
};

export function SignalCard({ label, tone = "cyan" }: SignalCardProps) {
  const colors = TONES[tone];

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 16,
        borderRadius: 20,
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.dot + "33",
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.dot,
        }}
      />
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: "500" }}>
        {label}
      </Text>
    </Pressable>
  );
}`,
  },
  {
    name: "hooks/useSessionSignal.ts",
    label: "logic",
    accent: "cobalt",
    previewTitle: "Session Signal",
    previewCopy:
      "Session state rolls through warmup, hot reload, and device sync phases so the IDE always explains what is happening.",
    code: `import { useEffect, useMemo, useState } from "react";

const phases = [
  "Booting workspace",
  "Warming preview runtime",
  "Connected to Expo relay",
  "Hot reload stable",
];

export function useSessionSignal() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((current) => (current + 1) % phases.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return useMemo(
    () => ({
      phase: phases[phaseIndex],
      sessionId: "flux-rn-2048",
      deviceCount: 2,
      websocket: "stable",
    }),
    [phaseIndex]
  );
}`,
  },
  {
    name: "app.json",
    label: "config",
    accent: "mint",
    previewTitle: "Expo Bridge",
    previewCopy:
      "The Expo bridge is staged as a first-class feature, ready for QR handoff and future custom clients.",
    code: `{
  "expo": {
    "name": "Runway Prototype",
    "slug": "runway-prototype",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "runway",
    "plugins": [],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "sessionRuntime": "preview-web+expo",
      "cloudAndroid": "phase-2"
    }
  }
}`,
  },
];

export const BOOT_STEPS = [
  {
    label: "Pre-flight checks",
    copy: "Loading editor, signals, and workspace instruments.",
  },
  {
    label: "Engines spooling up",
    copy: "Warming the React Native Web preview runtime.",
  },
  {
    label: "Taxiing to runway",
    copy: "Establishing Expo device bridge for phone handoff.",
  },
  {
    label: "Cleared for takeoff",
    copy: "Runway is live — your mobile IDE is ready.",
  },
];

export const LOG_TEMPLATES = [
  "metro: compiled workspace bundle in 184 ms",
  "preview: react-native-web surface refreshed",
  "device: expo relay heartbeat stable",
  "session: observer link signed and ready",
  "runtime: hooks recalculated without warnings",
  "cloud-android: standby lane reserved for phase two",
];

export const PREVIEW_PRESETS = [
  { id: "mini", label: "Mini", className: "device-mini" },
  { id: "pro", label: "Pro", className: "device-pro" },
  { id: "fold", label: "Fold", className: "device-fold" },
];
