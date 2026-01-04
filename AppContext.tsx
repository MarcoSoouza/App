import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Debt, Transaction, Appointment } from './types';
import { useAuth } from './AuthContext';

// Dados iniciais para simulação
const MOCK_DEBTS: Debt[] = [
  { id: '1', description: 'Empréstimo Banco', amount: 5000, dueDate: '2024-12-01', status: 'Pendente' },
  { id: '2', description: 'Cartão de Crédito', amount: 1200, dueDate: '2024-09-15', status: 'Pendente' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 3000, date: '2024-08-01', description: 'Salário' },
  { id: '2', type: 'expense', amount: 500, date: '2024-08-05', description: 'Aluguel', linkedDebtId: '1' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', serviceName: 'Trança Nagô', date: '2024-08-25T14:00:00.000Z', status: 'Confirmado' },
];

// 1. Definir a estrutura do Contexto
interface FinanceContextType {
  debts: Debt[];
  transactions: Transaction[];
  appointments: Appointment[];
  addDebt: (newDebt: Omit<Debt, 'id' | 'status'>) => void;
  addTransaction: (newTransaction: Omit<Transaction, 'id'>) => void;
  addAppointment: (newAppointment: Omit<Appointment, 'id' | 'status'>) => void;
  deleteDebt: (id: string) => void;
  deleteTransaction: (id: string) => void;
  clearDebts: () => void;
  clearTransactions: () => void;
  clearAppointments: () => void;
}

// 2. Criar o Contexto
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Funções para carregar/salvar dados do usuário
const loadUserData = async (userId: string) => {
  try {
    const stored = await AsyncStorage.getItem(`userData_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  // Dados iniciais para novos usuários
  return {
    debts: MOCK_DEBTS,
    transactions: MOCK_TRANSACTIONS,
    appointments: MOCK_APPOINTMENTS
  };
};

const saveUserData = async (userId: string, data: { debts: Debt[], transactions: Transaction[], appointments: Appointment[] }) => {
  try {
    await AsyncStorage.setItem(`userData_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// 3. Criar o Provedor do Contexto
export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Carregar dados quando o usuário muda
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const userData = await loadUserData(user.id);
        setDebts(userData.debts || []);
        setTransactions(userData.transactions || []);
        setAppointments(userData.appointments || []);
        setDataLoaded(true);
      } else {
        // Limpar dados quando não há usuário logado
        setDebts([]);
        setTransactions([]);
        setAppointments([]);
        setDataLoaded(false);
      }
    };
    loadData();
  }, [user]);

  // Salvar dados automaticamente quando mudam
  useEffect(() => {
    if (user && dataLoaded) {
      saveUserData(user.id, { debts, transactions, appointments });
    }
  }, [debts, transactions, appointments, user, dataLoaded]);

  const addDebt = (newDebtData: Omit<Debt, 'id' | 'status'>) => {
    const newDebt: Debt = {
      ...newDebtData,
      id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
      status: 'Pendente',
    };
    setDebts(prev => [newDebt, ...prev]);
  };

  const addTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Se a transação for uma despesa vinculada a uma dívida, reduzir o valor da dívida
    if (newTransaction.type === 'expense' && newTransaction.linkedDebtId) {
      setDebts(prevDebts =>
        prevDebts.map(debt =>
          debt.id === newTransaction.linkedDebtId
            ? { ...debt, amount: Math.max(0, debt.amount - newTransaction.amount) }
            : debt
        )
      );
    }
  };

  const addAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Confirmado',
    };
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const clearDebts = () => {
    setDebts([]);
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  const clearAppointments = () => {
    setAppointments([]);
  };

  return (
    <FinanceContext.Provider value={{
      debts, transactions, appointments,
      addDebt, addTransaction, addAppointment, deleteDebt, deleteTransaction,
      clearDebts, clearTransactions, clearAppointments
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

// 4. Criar um Hook customizado para usar o contexto facilmente
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const useAppointments = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within a FinanceProvider');
  }
  return context;
};
