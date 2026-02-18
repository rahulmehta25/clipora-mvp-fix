import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#000000', '#1a1a2e']}
        style={styles.gradient}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCard, styles.floatingCard1]}>
            <Ionicons name="play" size={32} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={[styles.floatingCard, styles.floatingCard2]}>
            <View style={styles.chatBubble}>
              <View style={styles.aiIcon}>
                <Ionicons name="sparkles" size={14} color="#fff" />
              </View>
              <View style={styles.chatLine} />
            </View>
          </View>
        </View>

        {/* Award Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>#1 Product of the Week</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.cardContainer}>
          <Card style={styles.authCard}>
            <View style={styles.cardContent}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  Create viral clips{'\n'}
                  <Text style={styles.titleAccent}>in seconds</Text>
                </Text>
                <Text style={styles.subtitle}>
                  AI-powered editing for content creators.
                </Text>
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.appleButton} onPress={handleContinue}>
                  <Ionicons name="logo-apple" size={20} color="#fff" />
                  <Text style={styles.appleButtonText}>Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleButton} onPress={handleContinue}>
                  <Ionicons name="logo-google" size={18} color="#333" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.emailButton} onPress={handleContinue}>
                  <Ionicons name="mail-outline" size={20} color="#333" />
                  <Text style={styles.emailButtonText}>Continue with Email</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.terms}>
                By continuing, you agree to our Terms & Privacy Policy.
              </Text>
            </View>
          </Card>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  floatingElements: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingCard: {
    position: 'absolute',
    backgroundColor: 'rgba(50,50,70,0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCard1: {
    top: 80,
    left: 30,
    width: 100,
    height: 140,
    transform: [{ rotate: '-12deg' }],
    opacity: 0.4,
  },
  floatingCard2: {
    top: 140,
    right: 30,
    width: 160,
    padding: 12,
    transform: [{ rotate: '6deg' }],
    opacity: 0.5,
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatLine: {
    height: 8,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D4AA',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  authCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 36,
  },
  titleAccent: {
    color: '#00D4AA',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 8,
  },
  buttons: {
    gap: 12,
  },
  appleButton: {
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  googleButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emailButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  terms: {
    fontSize: 12,
    color: '#AEAEB2',
    textAlign: 'center',
    marginTop: 24,
  },
});
