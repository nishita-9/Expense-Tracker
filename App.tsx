import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  icon: string;
};

const initialTransactions: Transaction[] = [
  { id: '1', title: 'Groceries', category: 'Food', amount: 850, icon: '🛒' },
  { id: '2', title: 'College Travel', category: 'Transport', amount: 300, icon: '🚌' },
  { id: '3', title: 'Coffee', category: 'Food', amount: 150, icon: '☕' },
  { id: '4', title: 'Movie', category: 'Entertainment', amount: 400, icon: '🎬' },
];

const STORAGE_KEY = '@expense_tracker_transactions';
const BUDGET_KEY = '@expense_tracker_budget';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budget, setBudget] = useState(10000);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('10000');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTransactions = await AsyncStorage.getItem(STORAGE_KEY);
        const savedBudget = await AsyncStorage.getItem(BUDGET_KEY);

        if (savedTransactions !== null) {
          setTransactions(JSON.parse(savedTransactions));
        }
        if (savedBudget !== null) {
          const parsedBudget = Number(savedBudget);
          if (Number.isFinite(parsedBudget) && parsedBudget > 0) {
            setBudget(parsedBudget);
            setBudgetInput(String(parsedBudget));
          }
        }
      } catch {
        Alert.alert('Storage error', 'Could not load saved expenses.');
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch(() => {
      Alert.alert('Storage error', 'Could not save your expenses.');
    });
  }, [transactions, loaded]);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(BUDGET_KEY, String(budget)).catch(() => {
      Alert.alert('Storage error', 'Could not save your budget.');
    });
  }, [budget, loaded]);

  const totalSpent = transactions.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - totalSpent;
  const progress = Math.min(totalSpent / budget, 1);

  const addExpense = () => {
    const value = Number(amount);

    if (!title.trim() || !amount.trim() || !Number.isFinite(value) || value <= 0) {
      Alert.alert('Invalid expense', 'Enter a title and a valid amount.');
      return;
    }

    const icons: Record<string, string> = {
      Food: '🍔',
      Transport: '🚌',
      Education: '📚',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Bills: '🧾',
      Other: '💸',
    };

    const newExpense: Transaction = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      amount: value,
      icon: icons[category] || '💸',
    };

    setTransactions(previous => [newExpense, ...previous]);
    setTitle('');
    setAmount('');
    setCategory('Other');
    setShowForm(false);
  };

  const deleteExpense = (id: string, expenseTitle: string) => {
    Alert.alert('Delete expense', `Delete "${expenseTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTransactions(previous => previous.filter(item => item.id !== id));
        },
      },
    ]);
  };

  const saveBudget = () => {
    const value = Number(budgetInput);
    if (!budgetInput.trim() || !Number.isFinite(value) || value <= 0) {
      Alert.alert('Invalid budget', 'Enter a valid budget greater than zero.');
      return;
    }
    setBudget(value);
    setEditingBudget(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>YOUR FINANCES</Text>
            <Text style={styles.heading}>Expense Tracker</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>₹</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>TOTAL SPENT THIS MONTH</Text>
          <Text style={styles.total}>₹{totalSpent.toLocaleString('en-IN')}</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetText}>
              Monthly budget: ₹{budget.toLocaleString('en-IN')}
            </Text>
            <TouchableOpacity onPress={() => {
              setBudgetInput(String(budget));
              setEditingBudget(!editingBudget);
            }}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {editingBudget && (
            <View style={styles.budgetEditor}>
              <TextInput
                style={styles.budgetInput}
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                placeholder="Enter monthly budget"
                placeholderTextColor="#8993A4"
              />
              <TouchableOpacity style={styles.budgetSave} onPress={saveBudget}>
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.remaining}>
            ₹{remaining.toLocaleString('en-IN')} remaining
          </Text>
          {remaining < 0 && (
            <Text style={styles.overBudget}>You have exceeded your budget!</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📉</Text>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{transactions.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>Average expense</Text>
            <Text style={styles.statValue}>
              ₹{transactions.length
                ? Math.round(totalSpent / transactions.length).toLocaleString('en-IN')
                : 0}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <Text style={styles.sectionSubtitle}>Tap an expense to delete it</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧾</Text>
            <Text style={styles.transactionTitle}>No expenses yet</Text>
            <Text style={styles.transactionCategory}>Add your first expense below.</Text>
          </View>
        ) : (
          transactions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.transaction}
              onPress={() => deleteExpense(item.id, item.title)}
              activeOpacity={0.75}
            >
              <View style={styles.transactionIcon}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                - ₹{item.amount.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))
        )}

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Add an Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Expense title"
              placeholderTextColor="#8993A4"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount in ₹"
              placeholderTextColor="#8993A4"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.formLabel}>Choose category</Text>
            <View style={styles.categoryRow}>
              {['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Other'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.categoryChip,
                    category === item && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    category === item && styles.categoryChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addExpense}>
              <Text style={styles.addButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.floatingButtonText}>
            {showForm ? '−  Cancel' : '+  Add Expense'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Spend wisely. Save consistently.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { padding: 20, paddingBottom: 35 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 },
  greeting: { color: '#64748B', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  heading: { fontSize: 25, fontWeight: '800', color: '#172554', marginTop: 5 },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#DCEAFE', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, color: '#2563EB', fontWeight: '800' },
  balanceCard: { backgroundColor: '#2457D6', borderRadius: 24, padding: 23, marginBottom: 18 },
  cardLabel: { color: '#D9E5FF', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  total: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginTop: 12 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 23, marginBottom: 10 },
  budgetText: { color: '#E0E9FF', fontSize: 12 },
  editText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', padding: 4 },
  budgetEditor: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  budgetInput: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 10, color: '#172554' },
  budgetSave: { backgroundColor: '#172554', paddingHorizontal: 15, justifyContent: 'center', borderRadius: 10 },
  progressBackground: { height: 7, backgroundColor: '#5279DC', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: 7, backgroundColor: '#FFFFFF', borderRadius: 10 },
  remaining: { color: '#FFFFFF', marginTop: 12, fontSize: 13, fontWeight: '600' },
  overBudget: { color: '#FFE1E1', fontWeight: '700', marginTop: 7 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E8EDF5' },
  statIcon: { fontSize: 22, marginBottom: 10 },
  statLabel: { color: '#64748B', fontSize: 12 },
  statValue: { color: '#172554', fontSize: 20, fontWeight: '800', marginTop: 7 },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 19, color: '#172554', fontWeight: '800' },
  sectionSubtitle: { fontSize: 12, color: '#8490A5', marginTop: 5 },
  transaction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 13, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8EDF5' },
  transactionIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#EFF4FF', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 21 },
  transactionInfo: { flex: 1, marginLeft: 12 },
  transactionTitle: { color: '#172554', fontSize: 14, fontWeight: '700' },
  transactionCategory: { color: '#8490A5', fontSize: 12, marginTop: 5 },
  transactionAmount: { color: '#E05252', fontWeight: '700', fontSize: 13 },
  form: { backgroundColor: '#FFFFFF', padding: 17, borderRadius: 18, marginTop: 12, borderWidth: 1, borderColor: '#E8EDF5' },
  input: { backgroundColor: '#F5F7FB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#172554', marginTop: 12 },
  formLabel: { color: '#64748B', fontSize: 12, fontWeight: '700', marginTop: 15, marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { borderWidth: 1, borderColor: '#DCE3EF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 11, backgroundColor: '#FFFFFF' },
  categoryChipSelected: { backgroundColor: '#2457D6', borderColor: '#2457D6' },
  categoryChipText: { color: '#475569', fontSize: 12 },
  categoryChipTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  addButton: { backgroundColor: '#2457D6', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 14 },
  addButtonText: { color: '#FFFFFF', fontWeight: '700' },
  floatingButton: { backgroundColor: '#172554', borderRadius: 15, padding: 17, alignItems: 'center', marginTop: 12 },
  floatingButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  emptyState: { alignItems: 'center', padding: 25, backgroundColor: '#FFFFFF', borderRadius: 18 },
  emptyEmoji: { fontSize: 32, marginBottom: 10 },
  footer: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 22 },
});
