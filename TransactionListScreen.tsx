import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useFinance } from './AppContext';

type TransactionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TransactionList'>;

interface Props {
  navigation: TransactionListScreenNavigationProp;
}

export default function TransactionListScreen({ navigation }: Props) {
  const { transactions, clearTransactions, deleteTransaction } = useFinance();

  const handleClearTransactions = () => {
    clearTransactions();
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionItemHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={[styles.transactionAmount, item.type === 'income' ? styles.income : styles.expense]}>
            {item.type === 'income' ? '+' : '-'}R$ {item.amount.toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
          {item.linkedDebtId && <Text style={styles.linkedDebt}>Vinculado à dívida</Text>}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTransaction(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Transações</Text>
        {transactions.length > 0 && (
          <TouchableOpacity onPress={handleClearTransactions}>
            <Text style={styles.clearButtonText}>Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação cadastrada.</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.addButtonText}>Adicionar Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  transactionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  income: {
    color: '#10b981',
  },
  expense: {
    color: '#ef4444',
  },
  transactionDate: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  linkedDebt: {
    fontSize: 12,
    color: '#f59e0b',
    fontStyle: 'italic',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#64748b',
    marginTop: 60,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
