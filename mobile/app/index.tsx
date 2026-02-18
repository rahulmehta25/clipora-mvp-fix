import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding' as any);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Clipora</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>CLIPORA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  footer: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
