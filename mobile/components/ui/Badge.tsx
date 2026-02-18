import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: '#F3F4F6', text: '#374151' },
  success: { bg: 'rgba(0, 212, 170, 0.1)', text: '#00D4AA' },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  destructive: { bg: '#FEE2E2', text: '#DC2626' },
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors = variantStyles[variant];
  
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
