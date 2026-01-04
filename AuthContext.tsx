import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './types';

// Função para carregar usuários do AsyncStorage
const loadUsersFromStorage = async (): Promise<User[]> => {
  try {
    const stored = await AsyncStorage.getItem('mockUsers');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users from storage:', error);
  }
  return [
    { id: '123-abc-456', name: 'Maria Silva', email: 'maria.silva@example.com', password: '123', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  ];
};

// Função para salvar usuários no AsyncStorage
const saveUsersToStorage = async (users: User[]) => {
  try {
    await AsyncStorage.setItem('mockUsers', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

// Simulação de um banco de dados de usuários em memória
let MOCK_USERS: User[] = [];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    const initializeUsers = async () => {
      MOCK_USERS = await loadUsersFromStorage();
      console.log('Loaded users from storage:', MOCK_USERS);
      setUsersLoaded(true);
    };
    initializeUsers();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!usersLoaded) {
      Alert.alert('Erro', 'Sistema ainda carregando. Tente novamente.');
      return false;
    }

    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    } else {
      Alert.alert('Erro de Login', 'Email ou senha inválidos.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!usersLoaded) {
      Alert.alert('Erro', 'Sistema ainda carregando. Tente novamente.');
      return false;
    }

    if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      Alert.alert('Erro de Cadastro', 'Este email já está em uso.');
      return false;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // Em um app real, NUNCA armazene senhas em texto plano.
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    MOCK_USERS.push(newUser);
    await saveUsersToStorage(MOCK_USERS); // Salva no AsyncStorage
    setUser(newUser); // Loga o usuário automaticamente após o cadastro
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;

    // Atualiza o usuário no estado global
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    // Atualiza o usuário no nosso "banco de dados" mockado
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updatedData };
      await saveUsersToStorage(MOCK_USERS); // Salva no AsyncStorage
    }

    Alert.alert('Sucesso', 'Seu perfil foi atualizado.');
  };

  return <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};