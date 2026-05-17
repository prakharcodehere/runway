# FluxDev

## What We Are Building

FluxDev is a browser-based coding workspace for React and React Native. It is designed as a better alternative to Expo Snack for building, previewing, and sharing mobile app ideas without requiring a full local setup.

Users can write code in the browser, see instant updates in a live preview, and open the same project on a real phone through Expo. The product should feel fast, simple, and production-usable for prototyping, learning, collaboration, demos, and technical interviews.

FluxDev is not only an interview platform. It is a general-purpose online IDE for React and React Native, with interview use as one strong use case.

## Core Product Vision

FluxDev should let a developer:
- create or open a React / React Native project in the browser
- edit code with a modern IDE experience
- preview UI instantly in a mobile device frame
- run the app on a real phone with Expo
- inspect logs and runtime errors
- share projects with others
- eventually run the app in a cloud Android emulator for more accurate native testing

The main goal is to remove setup friction while still preserving a real app-building workflow.

## Positioning

FluxDev is:
- an online coding workspace for React and React Native
- a live preview and prototyping tool
- a better React Native browser workflow than Expo Snack
- usable for interviews, pair programming, learning, and product experiments

FluxDev is not initially:
- a full replacement for local native development on every edge case
- an in-browser iOS simulator platform in v1
- a heavy enterprise assessment-only product

## Main Use Cases

- React Native prototyping
- React component development
- quick mobile UI experiments
- interview coding sessions
- take-home assignments
- live collaboration or demos
- testing screens and flows on a real phone without local setup

## V1 Scope

### Editor and Workspace
- browser-based code editor
- file tree
- project templates
- save/load projects
- basic project settings

### Live Preview
- React Native Web preview in a device frame
- instant refresh on code changes
- responsive mobile viewport presets
- error overlay for failed renders

### Real Device Support
- Expo-based preview flow
- QR code to open the project on a real phone
- support for Expo Go first, with room for custom dev client later
- live reload on device

### Developer Feedback
- runtime logs
- bundler logs
- compilation errors
- reset/restart session actions

### Sharing and Sessions
- unique project/session links
- persistent project storage
- optional read-only shared view

## Phase 2 Scope

### Cloud Android Emulator
- remote Android emulator per session or pooled session
- streamed emulator view in the browser
- touch/click input forwarding
- install/run/reload from the IDE
- screenshots and logs

This phase is important for testing behavior that React Native Web cannot represent accurately.

## Why React Native Web First

React Native Web gives us:
- very fast preview updates
- simple browser rendering
- low infrastructure cost compared to full emulators
- a much better editing loop for most UI tasks

It does not fully replace a native runtime. It is the fast preview layer, not the full truth layer.

## Why Real Phone Support Matters

Some app behavior only becomes trustworthy on a real device. Expo support allows users to quickly validate:
- gestures
- navigation behavior
- device sizing differences
- runtime behavior closer to actual mobile execution
- some native integrations, depending on project setup

This is the practical middle ground before adding cloud emulators.

## Why Cloud Android Emulator Comes Later

Cloud Android support is valuable, but it is more expensive and operationally harder because it requires:
- long-running remote environments
- session orchestration
- video streaming
- low-latency input handling
- app install and restart controls
- stronger resource isolation

It should be added after the browser editor, web preview, and Expo device flow are stable.

## Product Principles

- fast startup
- low friction
- instant feedback
- minimal setup
- mobile-first preview experience
- predictable templates
- strong debugging visibility
- good enough for both prototyping and interviews

## High-Level Architecture

### Frontend
The frontend includes:
- code editor interface
- file explorer
- preview pane
- logs panel
- project/session controls
- share flow
- QR code device connection flow

Recommended tools:
- Next.js or React app shell
- Monaco Editor
- websocket or event stream for session updates

### Runtime and Build Layer
This layer is responsible for:
- creating isolated workspaces
- installing dependencies
- running bundlers
- rebuilding on file changes
- exposing preview endpoints
- collecting logs and errors

Possible building blocks:
- containerized workspace runner
- Node.js session orchestrator
- Metro / Expo tooling for React Native
- Vite or equivalent for web-based tooling where useful

### Preview Layer
The preview system includes two runtimes:

1. Fast preview runtime
- React Native Web rendering inside browser device frame
- used for instant UI updates

2. Real device runtime
- Expo bundle served for opening on a phone
- connected through QR code or deep link

### Storage Layer
- project metadata in database
- source files in object storage or database-backed file store
- optional snapshot/version history

### Session Layer
- user session creation
- workspace lifecycle management
- logs and process state
- cleanup policies
- template bootstrapping

## Suggested Monorepo Structure

```text
FluxDev/
  apps/
    web/                 # browser IDE frontend
    api/                 # backend/session API
    runner/              # workspace/session orchestration
  packages/
    editor-ui/           # shared editor components
    preview-frame/       # custom mobile preview shell
    templates/           # starter React/RN templates
    session-sdk/         # shared client/server session logic
    logging/             # log transport and formatting
  infra/
    docker/              # runner images
    emulator/            # future Android emulator infra
  docs/
    architecture/
    product/
```

## Candidate Interview Use Case

FluxDev can be used for interviews, but the product should not be constrained to only that.

For interview workflows, FluxDev should support:
- fixed coding templates
- timed sessions if needed
- shareable interview links
- observer/interviewer mode
- logs and code history
- stable environment without local setup

This should sit on top of the general-purpose coding workspace rather than define the entire product.

## MVP Milestones

### Milestone 1
- create browser IDE shell
- load starter React Native project template
- basic file editing

### Milestone 2
- React Native Web live preview in device frame
- live refresh on edits
- runtime error handling

### Milestone 3
- Expo integration
- QR code preview on real phone
- bundler logs and restart controls

### Milestone 4
- project persistence
- shareable links
- session lifecycle management

### Milestone 5
- cloud Android emulator
- streamed device view
- touch interaction and logs

## Technical Risks

- multi-tenant code execution security
- dependency installation speed
- Metro stability in isolated environments
- session cold-start time
- Expo integration edge cases
- React Native Web compatibility gaps
- emulator infrastructure cost and reliability

## Success Criteria

FluxDev is successful if a user can:
- open a browser
- start from a React Native template
- edit code immediately
- see the result instantly in a device-like preview
- open the same app on a real phone with minimal friction
- share the project with another person

Later, success expands to:
- opening the app inside a cloud Android emulator when native-accurate validation is needed

## Short Product Summary

FluxDev is a browser-based React and React Native IDE focused on fast mobile app building. It combines live editing, React Native Web preview, Expo-powered real phone support, and later cloud Android emulation to create a smoother, more capable alternative to Expo Snack.
