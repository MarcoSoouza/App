import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useFinance } from './AppContext';

type AddTransactionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;

interface Props {
  navigation: AddTransactionScreenNavigationProp;
}

export default function AddTransactionScreen({ navigation }: Props) {
  const { addTransaction, debts } = useFinance();
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [linkedDebtId, setLinkedDebtId] = useState<string>('');

  const handleAddTransaction = () => {
    if (!amount || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      Alert.alert('Erro', 'Valor inválido.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    addTransaction({
      type,
      amount: transactionAmount,
      description,
      date: currentDate,
      linkedDebtId: type === 'expense' && linkedDebtId ? linkedDebtId : undefined,
    });

    Alert.alert('Sucesso', 'Transação adicionada com sucesso!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Transação</Text>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue: 'income' | 'expense') => setType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Receita" value="income" />
          <Picker.Item label="Despesa" value="expense" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Valor (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />

      {type === 'expense' && (
        <>
          <Text style={styles.label}>Vincular à dívida (opcional)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={linkedDebtId}
              onValueChange={(itemValue: string) => setLinkedDebtId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Nenhuma" value="" />
              {debts.map((debt) => (
                <Picker.Item key={debt.id} label={debt.description} value={debt.id} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
        <Text style={styles.buttonText}>Adicionar Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
