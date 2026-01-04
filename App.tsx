import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './AuthContext';
import { FinanceProvider } from './AppContext';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import RegisterScreen from './RegisterScreen';
import DebtListScreen from './DebtListScreen';
import AddDebtScreen from './AddDebtScreen';
import TransactionListScreen from './TransactionListScreen';
import AddTransactionScreen from './AddTransactionScreen';
import EditProfileScreen from './EditProfileScreen';
import SettingsScreen from './SettingsScreen';
import AppointmentListScreen from './AppointmentListScreen';
import AppointmentScreen from './AppointmentScreen';
import LoginScreen from './LoginScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['https://myapp.com', 'myapp://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile',
      DebtList: 'debts',
      AddDebt: 'add-debt',
      TransactionList: 'transactions',
      AddTransaction: 'add-transaction',
      EditProfile: 'edit-profile',
      Settings: 'settings',
      AppointmentList: 'appointments',
      Appointment: 'book-appointment',
      Login: 'login',
      Register: 'register',
    },
  },
};

function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DebtList" component={DebtListScreen} options={{ title: 'Minhas Dívidas' }} />
          <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Adicionar Dívida' }} />
          <Stack.Screen name="TransactionList" component={TransactionListScreen} options={{ title: 'Transações' }} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Adicionar Transação' }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
          <Stack.Screen name="AppointmentList" component={AppointmentListScreen} options={{ title: 'Meus Agendamentos' }} />
          <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Agendar Horário' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </FinanceProvider>
    </AuthProvider>
  );
}
