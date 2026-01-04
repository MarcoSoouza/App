import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Appointment, RootStackParamList } from './types';
import { useAppointments } from './AppContext';

type AppointmentListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentList'>;

interface Props {
  navigation: AppointmentListScreenNavigationProp;
}

const AppointmentItem = ({ item }: { item: Appointment }) => (
  <View style={styles.itemContainer}>
    <View style={styles.iconContainer}>
      <Feather name="calendar" size={24} color="#FFA500" />
    </View>
    <View style={styles.detailsContainer}>
      <Text style={styles.serviceName}>{item.serviceName}</Text>
      <Text style={styles.dateTime}>
        {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
    <Text style={[styles.status, item.status === 'Confirmado' ? styles.statusConfirmed : styles.statusDone]}>{item.status}</Text>
  </View>
);

export default function AppointmentListScreen({ navigation }: Props) {
  const { appointments, clearAppointments } = useAppointments();

  const handleClearAppointments = () => {
    Alert.alert(
      "Limpar Agendamentos",
      "Você tem certeza que deseja remover todos os seus agendamentos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Limpar Tudo", style: "destructive", onPress: clearAppointments }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Meus Agendamentos</Text>
            {appointments.length > 0 && (
              <TouchableOpacity onPress={handleClearAppointments}>
                <Text style={styles.clearButtonText}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={40} color="#ADB5BD" />
            <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
            <Text style={styles.emptySubText}>Que tal marcar um novo horário?</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Appointment')}
      >
        <Text style={styles.addButtonText}>Novo Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  listContainer: { padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: { fontSize: 28, fontWeight: 'bold', color: '#343A40', marginBottom: 20 },
  clearButtonText: {
    color: '#FFA500',
    fontWeight: '600',
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
    backgroundColor: '#FFF7E6',
    padding: 12,
    borderRadius: 25,
  },
  detailsContainer: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#343A40' },
  dateTime: { fontSize: 14, color: '#6C757D', marginTop: 4 },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  statusConfirmed: { color: '#FFA500', backgroundColor: '#FFF7E6' },
  statusDone: { color: '#28A745', backgroundColor: '#E9F7EC' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C757D',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: '#ADB5BD',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});