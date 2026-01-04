import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useFinance } from './AppContext';

type DebtListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DebtList'>;

interface Props {
  navigation: DebtListScreenNavigationProp;
}

export default function DebtListScreen({ navigation }: Props) {
  const { debts, clearDebts, deleteDebt } = useFinance();

  const handleClearDebts = () => {
    clearDebts();
  };

  const handleDeleteDebt = (id: string) => {
    deleteDebt(id);
  };

  const renderDebtItem = ({ item }: { item: any }) => (
    <View style={styles.debtItem}>
      <View style={styles.debtItemHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.debtDescription}>{item.description}</Text>
          <Text style={styles.debtAmount}>R$ {item.amount.toFixed(2)}</Text>
          <Text style={styles.debtDate}>Vencimento: {new Date(item.dueDate).toLocaleDateString('pt-BR')}</Text>
          <Text style={[styles.debtStatus, item.status === 'Pago' ? styles.paid : styles.pending]}>
            {item.status}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDebt(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Minhas Dívidas</Text>
        {debts.length > 0 && (
          <TouchableOpacity onPress={handleClearDebts}>
            <Text style={styles.clearButtonText}>Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={debts}
        renderItem={renderDebtItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma dívida cadastrada.</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDebt')}
      >
        <Text style={styles.addButtonText}>Adicionar Dívida</Text>
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
  debtItem: {
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
  debtItemHeader: {
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
  debtDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    flex: 1,
  },
  debtAmount: {
    fontSize: 20,
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  debtDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  debtStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
    minWidth: 80,
  },
  paid: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  pending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
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
