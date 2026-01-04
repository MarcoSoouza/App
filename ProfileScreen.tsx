import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList, User } from './types';
import { useAuth } from './AuthContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

// It's a good practice to centralize theme values like colors and spacing.
const theme = {
  colors: {
    primaryGradient: ['#FFD700', '#FFA500'],
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textPrimary: '#343A40',
    textSecondary: '#495057',
    textLight: '#FFFFFF',
    icon: '#495057',
    iconMuted: '#ADB5BD',
    danger: '#FF6347',
    dangerBg: '#FFF',
    dangerBorder: '#FFE0E0',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 20,
    xl: 40,
  },
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primaryGradient[1]} />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={theme.colors.primaryGradient} style={styles.header}>
        {user && <Image source={{ uri: user.avatar }} style={styles.avatar} />}
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </LinearGradient>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="calendar"
          text="Meus Agendamentos"
          onPress={() => navigation.navigate('AppointmentList')}
        />
        <MenuItem
          icon="edit-2"
          text="Editar Perfil"
          onPress={() => {
            if (user) {
              navigation.navigate('EditProfile', { user });
            }
          }}
        />
        <MenuItem
          icon="settings"
          text="Configurações"
          onPress={() => navigation.navigate('Settings')} // Example navigation
        />
        <MenuItem
          icon="help-circle"
          text="Ajuda e Suporte"
          onPress={() => console.log('Navegar para Ajuda')}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Feather name="log-out" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  onPress: () => void;
}

const MenuItem = ({ icon, text, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <Feather name={icon} size={22} color={theme.colors.icon} />
      <Text style={styles.menuItemText}>{text}</Text>
    </View>
    <Feather name="chevron-right" size={22} color={theme.colors.iconMuted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.surface,
    marginBottom: theme.spacing.m,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textLight,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textLight,
    opacity: 0.9,
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: theme.spacing.l,
  },
  menuItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: theme.spacing.l,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: theme.spacing.l,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: theme.colors.dangerBg,
    borderRadius: 12,
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.dangerBorder,
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});