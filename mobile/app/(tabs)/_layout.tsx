import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.85)' }]} />
          )
        ),
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Co-Pilot',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 64,
    borderRadius: 32,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
  },
  tabBarItem: {
    paddingTop: 8,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
  },
});
