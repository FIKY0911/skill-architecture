# Mobile UI Engineering & Framework Integration Guide

This guide establishes the architectural standards, performance constraints, and component mapping for native and cross-platform mobile application development within `architect-skill`.

---

## 1. Supported Mobile UI Frameworks

| Mobile Framework | Target Ecosystem | Styling Engine | Touch & Gesture Engine | Offline & Local Cache | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **React Native (Expo)** | iOS & Android | **NativeWind (Tailwind v4)** or **Tamagui** | `react-native-gesture-handler` + Reanimated 3 | MMKV / WatermelonDB | Universal Cross-Platform App, Fast Iteration, Web+Mobile Code Sharing |
| **Flutter** | iOS, Android, Desktop | Widget Tree + Custom ThemeData | `GestureDetector` / RawGestureDetector | Hive / Isar / SQLite | High-Fidelity Custom Animation, Pixel-Perfect Multi-Platform, Neumorphic/3D Canvas |
| **SwiftUI (Native iOS)** | iOS, iPadOS, macOS | Declarative Views + ViewModifiers | Gesture Modifiers (`DragGesture`, `TapGesture`) | SwiftData / CoreData | Pure Apple Native Experience, Hardware Sensor Integration, WidgetKit |
| **Jetpack Compose (Android)**| Android, WearOS | Declarative Composable Functions | `Modifier.pointerInput` | Room Database / Datastore | Pure Android Modern Architecture, Material 3 Theming, Enterprise Android |

---

## 2. React Native + NativeWind & Tamagui Architecture

For teams utilizing React/Next.js on the web, React Native with **NativeWind** provides seamless design token sharing:

### 2.1 NativeWind Component Scaffold (Tailwind for Mobile)
```tsx
import { Text, View, Pressable } from 'react-native';

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-black dark:bg-white active:scale-95 transition-transform px-6 py-3.5 rounded-xl items-center justify-center shadow-md active:bg-zinc-800"
    >
      <Text className="text-white dark:text-black font-semibold text-base">{label}</Text>
    </Pressable>
  );
}
```

---

## 3. Mobile Aesthetics Mapping

The 8 curated frontend visual aesthetics map directly onto mobile touch interfaces:

1. **Mobile Neubrutalism**:
   - 3px solid black borders, hard offset drop shadows (`elevation: 4` + border styling), high-contrast touch targets (minimum $48 \times 48\text{ dp}$ per Apple HIG & Material guidelines).
2. **Bento Grid / Mobile Dashboard**:
   - Rounded corner cards (`rounded-2xl`), subtle dark borders (`rgba(255,255,255,0.08)`), haptic feedback on touch.
3. **Glassmorphism / iOS Frosted Glass**:
   - `BlurView` (`expo-blur` or SwiftUI `.ultraThinMaterial`) over dynamic ambient background gradients.
4. **Clean Mobile SaaS**:
   - Minimalist neutral surfaces, sticky bottom action bar, thumb-friendly navigation rail.

---

## 4. Mobile Architectural Guardrails

1. **Safe Area & Dynamic Island / Notches**:
   - Mandatory wrapping with `SafeAreaProvider` and `useSafeAreaInsets()`.
2. **Keyboard Avoiding & Sheet Modals**:
   - Use `KeyboardAvoidingView` or `@gorhom/bottom-sheet` for seamless keyboard avoidance and contextual drawers.
3. **Touch Target Dimensions**:
   - All interactive touch elements must provide a minimum clickable area of $44 \times 44\text{ pt}$ (iOS) or $48 \times 48\text{ dp}$ (Android).
