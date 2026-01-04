import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Service } from './types';
 
interface Props {
  service: Service;
  isSelected: boolean;
  onPress: () => void;
}

export const ServiceItem: React.FC<Props> = ({ service, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.serviceButton, isSelected && styles.serviceButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.serviceText, isSelected && styles.serviceTextSelected]}>{service.name}</Text>
      <Text style={[styles.serviceDetail, isSelected && styles.serviceDetailSelected]}>{service.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceButtonSelected: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343A40',
  },
  serviceTextSelected: {
    color: '#FFFFFF',
  },
  serviceDetail: {
    fontSize: 14,
    color: '#6C757D',
  },
  serviceDetailSelected: {
    color: '#FFFFFF',
  },
});