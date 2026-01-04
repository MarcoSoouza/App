import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  time: string;
  isSelected: boolean;
  onPress: () => void;
}

export const TimeSlot: React.FC<Props> = ({ time, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.timeButton, isSelected && styles.timeButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeButtonSelected: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343A40',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
});