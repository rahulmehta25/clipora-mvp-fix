import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Card } from '@/components/ui/Card';

export default function ProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => router.replace(`/projects/${id}`), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (progress > 25) setStep(2);
    if (progress > 50) setStep(3);
    if (progress > 75) setStep(4);
    if (progress > 90) setStep(5);
  }, [progress]);

  const getStatusText = () => {
    if (progress <= 25) return 'Uploading video...';
    if (progress <= 50) return 'Transcribing audio...';
    if (progress <= 75) return 'Analyzing content...';
    if (progress <= 90) return 'Finding viral moments...';
    return 'Finalizing clips...';
  };

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.projectName}>Processing Video</Text>

          {/* Progress Circle */}
          <View style={styles.progressContainer}>
            <Svg width={128} height={128} style={styles.svg}>
              {/* Background Circle */}
              <Circle
                cx={64}
                cy={64}
                r={60}
                stroke="#F3F4F6"
                strokeWidth={8}
                fill="none"
              />
              {/* Progress Circle */}
              <Circle
                cx={64}
                cy={64}
                r={60}
                stroke="#00D4AA"
                strokeWidth={8}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90, 64, 64)"
              />
            </Svg>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <Text style={styles.stepText}>Step {step} of 5</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.cancelText}>Cancel Processing</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 32,
    alignItems: 'center',
    padding: 40,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 32,
  },
  progressContainer: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  svg: {
    position: 'absolute',
  },
  progressTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AEAEB2',
  },
});
