# Pocket Calculator

A minimal iOS-style calculator built with React Native + Expo.

## Features
- Addition, subtraction, multiplication, and division
- Decimal input
- Clear / reset
- Positive / negative toggle
- Percent
- Repeated calculations
- Division-by-zero handling

## Intended workflow
ChatGPT -> GitHub -> Expo/EAS -> TestFlight/App Store.

## Run with Expo Go
Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

## EAS build
After linking the project to your Expo account:

```bash
npx eas-cli@latest build --platform ios --profile production
```
