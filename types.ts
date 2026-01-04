// Define a estrutura do objeto User
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password?: string; // Opcional e apenas para simulação. NUNCA use em produção.
};

// Define a estrutura do objeto Debt
export interface Debt {
  id: string;
  description: string;
  amount: number;
  dueDate: string; // Formato YYYY-MM-DD
  status: 'Pendente' | 'Pago';
}

// Define a estrutura do objeto Transaction
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string; // Formato YYYY-MM-DD
  description: string;
  linkedDebtId?: string; // Opcional, para vincular despesa a uma dívida
}

// Define a estrutura do objeto Appointment
export interface Appointment {
  id: string;
  serviceName: string;
  date: string; // ISO string
  status: 'Confirmado' | 'Concluído';
}

// Define a estrutura do objeto Service
export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

// Define os parâmetros para cada rota no stack de navegação
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  DebtList: undefined;
  AddDebt: undefined;
  TransactionList: undefined;
  AddTransaction: undefined;
  EditProfile: { user: User };
  Settings: undefined;
  AppointmentList: undefined;
  Appointment: undefined;
};
