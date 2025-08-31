import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, User, Bell, Shield, HelpCircle, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Settings size={28} color="#ffffff" />
            <Text style={styles.heading}>Settings</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <TouchableOpacity style={styles.settingItem}>
                <User size={20} color="#ffffff" />
                <Text style={styles.settingText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Bell size={20} color="#ffffff" />
                <Text style={styles.settingText}>Notifications</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App</Text>
              <TouchableOpacity style={styles.settingItem}>
                <Shield size={20} color="#ffffff" />
                <Text style={styles.settingText}>Privacy & Security</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <HelpCircle size={20} color="#ffffff" />
                <Text style={styles.settingText}>Help & Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Info size={20} color="#ffffff" />
                <Text style={styles.settingText}>About</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 12,
  },
});
