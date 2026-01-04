import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList, Service } from './types';
import { ServiceItem } from './ServiceItem';
import { TimeSlot } from './TimeSlot';
import { useAppointments } from './AppContext';

type AppointmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Appointment'>;

interface Props {
  navigation: AppointmentScreenNavigationProp;
}

// Mock data - In a real app, this would come from an API
const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Trança Nagô', duration: '2h', price: 'R$ 80' },
  { id: '2', name: 'Box Braids', duration: '5h', price: 'R$ 250' },
  { id: '3', name: 'Crochet Braids', duration: '3h', price: 'R$ 180' },
  { id: '4', name: 'Manutenção', duration: '1.5h', price: 'R$ 70' },
];

const MOCK_AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// Main Component
export default function AppointmentScreen({ navigation }: Props) {
  const { addAppointment } = useAppointments();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setSelectedTime(null); // Reseta a hora ao mudar a data
  };

  const handleBooking = () => {
    if (!selectedService || !selectedTime) {
      Alert.alert('Campos Incompletos', 'Por favor, selecione um serviço, data e horário.');
      return;
    }

    const serviceName = MOCK_SERVICES.find(s => s.id === selectedService)?.name;
    if (!serviceName) return; // Segurança extra

    // Combina a data selecionada com a hora selecionada
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    Alert.alert(
      'Confirmação de Agendamento',
      `Você está agendando: ${serviceName}\nData: ${date.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\n\nConfirmar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            addAppointment({
              serviceName,
              date: appointmentDate.toISOString(),
            });
            Alert.alert('Sucesso!', 'Seu horário foi agendado.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Agende seu Horário</Text>

      <Text style={styles.sectionTitle}>1. Escolha o Serviço</Text>
      <View style={styles.serviceContainer}>
        {MOCK_SERVICES.map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            isSelected={selectedService === service.id}
            onPress={() => setSelectedService(service.id)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>2. Escolha a Data</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Feather name="calendar" size={20} color="#495057" />
        <Text style={styles.datePickerText}>{date.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()} // Não permite agendar no passado
        />
      )}

      <Text style={styles.sectionTitle}>3. Escolha o Horário</Text>
      <View style={styles.timeContainer}>
        {MOCK_AVAILABLE_TIMES.map(time => (
          <TimeSlot
            key={time}
            time={time}
            isSelected={selectedTime === time}
            onPress={() => setSelectedTime(time)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 15,
  },
  serviceContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#343A40',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: '#FFA500',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});