# Run Clipora mobile app in Expo Go (Priority 1)

## Prerequisites

- **Expo Go** installed on your phone (App Store / Play Store), version **54.x** to match the project.
- **Node** and **npm** available; dependencies installed (`npm install` in `mobile/`).

## Steps

### 1. Same Wi‑Fi (simplest)

1. Put **phone and Mac on the same Wi‑Fi**.
2. In a terminal:
   ```bash
   cd ~/Desktop/Projects/Clipora/mobile
   npx expo start
   ```
3. When Metro is ready, **scan the QR code** with:
   - **iOS:** Camera app or Expo Go.
   - **Android:** Expo Go.
4. The app should load: **Splash → Onboarding → Tabs (Home, Upload, Co-Pilot, Settings)**.

### 2. Different network or “project not loading”

If the project doesn’t load (e.g. phone on cellular or different Wi‑Fi), use **tunnel** so the phone can reach your Mac:

```bash
cd ~/Desktop/Projects/Clipora/mobile
npx expo start --tunnel
```

Wait for **“Tunnel ready”**, then scan the **new** QR code with Expo Go. You can also use:

```bash
npm run start:tunnel
```

### 3. If the app crashes or stays blank

- **Update Expo Go** on the phone to the latest (54.x).
- **Clear Metro cache and restart:**
  ```bash
  npx expo start --clear
  ```
- **Reload in Expo Go:** shake device → “Reload”, or press `r` in the terminal.

## What was fixed for Expo Go

- **Root layout:** Wrapped app in `GestureHandlerRootView` and `SafeAreaProvider` so gestures and safe areas work in Expo Go.
- **Assets:** Placeholder `icon.png`, `splash.png`, `adaptive-icon.png`, and `favicon.png` added under `mobile/assets/` so the app can start without missing-asset errors.
- **Tunnel script:** `npm run start:tunnel` for when phone and Mac are on different networks.

## Quick reference

| Command                | Use when                          |
|------------------------|-----------------------------------|
| `npx expo start`       | Phone and Mac on same Wi‑Fi       |
| `npx expo start --tunnel` | Different network / more reliable |
| `npx expo start --clear` | After dependency or config changes |
