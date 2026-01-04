import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from './types';
import { useFinance } from './AppContext';
import { useAuth } from './AuthContext';

// Define o tipo da prop de navegação para esta tela
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { debts, transactions } = useFinance();
  const { logout } = useAuth();

  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Feather name="log-out" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Gestão Financeira</Text>
          <Text style={styles.subtitle}>Organize suas dívidas e transações</Text>
        </LinearGradient>
      </View>

      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="account-balance-wallet" size={32} color="#6366f1" />
          <Text style={styles.summaryLabel}>Total de Dívidas</Text>
          <Text style={styles.summaryValue}>R$ {totalDebts.toFixed(2)}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 name="balance-scale" size={32} color={netBalance >= 0 ? '#10b981' : '#ef4444'} />
          <Text style={styles.summaryLabel}>Saldo Líquido</Text>
          <Text style={[styles.summaryValue, netBalance >= 0 ? styles.positive : styles.negative]}>
            R$ {netBalance.toFixed(2)}
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DebtList')}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="list" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Ver Dívidas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('TransactionList')}
        >
          <View style={styles.buttonContent}>
            <FontAwesome5 name="exchange-alt" size={20} color="#6366f1" />
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Ver Transações</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddDebt')}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Adicionar Dívida</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <View style={styles.buttonContent}>
            <FontAwesome5 name="plus-circle" size={20} color="#6366f1" />
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Adicionar transações</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerGradient: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    textAlign: 'center',
    opacity: 0.9,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 30,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366f1',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonOutlineText: {
    color: '#6366f1',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
