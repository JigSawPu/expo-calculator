import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Operator = '+' | '−' | '×' | '÷';
type ButtonKind = 'number' | 'utility' | 'operator';
type Key = { label: string; kind: ButtonKind; wide?: boolean };

const KEYS: Key[][] = [
  [
    { label: 'AC', kind: 'utility' },
    { label: '±', kind: 'utility' },
    { label: '%', kind: 'utility' },
    { label: '÷', kind: 'operator' },
  ],
  [
    { label: '7', kind: 'number' },
    { label: '8', kind: 'number' },
    { label: '9', kind: 'number' },
    { label: '×', kind: 'operator' },
  ],
  [
    { label: '4', kind: 'number' },
    { label: '5', kind: 'number' },
    { label: '6', kind: 'number' },
    { label: '−', kind: 'operator' },
  ],
  [
    { label: '1', kind: 'number' },
    { label: '2', kind: 'number' },
    { label: '3', kind: 'number' },
    { label: '+', kind: 'operator' },
  ],
  [
    { label: '0', kind: 'number', wide: true },
    { label: '.', kind: 'number' },
    { label: '=', kind: 'operator' },
  ],
];

function calculate(left: number, right: number, operator: Operator): number {
  switch (operator) {
    case '+': return left + right;
    case '−': return left - right;
    case '×': return left * right;
    case '÷': return right === 0 ? Number.NaN : left / right;
  }
}

function normalizeNumber(value: number): string {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearLabel = useMemo(
    () => (display === '0' && storedValue === null ? 'AC' : 'C'),
    [display, storedValue]
  );

  const reset = () => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    if (display === '0') {
      setDisplay(digit);
      return;
    }
    if (display.replace('-', '').replace('.', '').length < 10) {
      setDisplay(display + digit);
    }
  };

  const inputDecimal = () => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const toggleSign = () => {
    if (display === '0' || display === 'Error') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);
  };

  const percent = () => {
    if (display === 'Error') return;
    setDisplay(normalizeNumber(Number(display) / 100));
  };

  const chooseOperator = (nextOperator: Operator) => {
    if (display === 'Error') {
      reset();
      return;
    }

    const inputValue = Number(display);
    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(storedValue, inputValue, operator);
      const nextDisplay = normalizeNumber(result);
      setDisplay(nextDisplay);
      if (nextDisplay === 'Error') {
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setStoredValue(result);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const equals = () => {
    if (display === 'Error' || storedValue === null || operator === null || waitingForOperand) return;
    const result = calculate(storedValue, Number(display), operator);
    setDisplay(normalizeNumber(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handlePress = (label: string) => {
    if (/^\d$/.test(label)) return inputDigit(label);
    if (label === '.') return inputDecimal();
    if (label === 'AC' || label === 'C') return reset();
    if (label === '±') return toggleSign();
    if (label === '%') return percent();
    if (label === '=') return equals();
    return chooseOperator(label as Operator);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.displayWrap}>
          <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.45}>
            {display}
          </Text>
        </View>

        <View style={styles.keypad}>
          {KEYS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((key) => {
                const label = key.label === 'AC' && clearLabel === 'C' ? 'C' : key.label;
                return (
                  <TouchableOpacity
                    key={key.label}
                    activeOpacity={0.72}
                    onPress={() => handlePress(label)}
                    style={[
                      styles.key,
                      key.kind === 'utility' && styles.utilityKey,
                      key.kind === 'operator' && styles.operatorKey,
                      key.wide && styles.wideKey,
                    ]}
                  >
                    <Text style={[styles.keyText, key.kind === 'utility' && styles.utilityText]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const GAP = 12;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: 18 },
  displayWrap: { minHeight: 150, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 10, paddingBottom: 22 },
  display: { color: '#fff', fontSize: 82, fontWeight: '300', textAlign: 'right' },
  keypad: { gap: GAP },
  row: { flexDirection: 'row', gap: GAP },
  key: { flex: 1, aspectRatio: 1, borderRadius: 999, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  wideKey: { flex: 2.1, aspectRatio: 2.1, alignItems: 'flex-start', paddingLeft: 30 },
  utilityKey: { backgroundColor: '#A5A5A5' },
  operatorKey: { backgroundColor: '#FF9F0A' },
  keyText: { color: '#fff', fontSize: 32, fontWeight: '500' },
  utilityText: { color: '#000' },
});
