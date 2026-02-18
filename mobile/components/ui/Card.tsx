import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  onPress?: () => void;
  selected?: boolean;
}

export function Card({ children, style, noPadding, onPress, selected }: CardProps) {
  const content = (
    <View style={[
      styles.card, 
      noPadding ? {} : styles.padding,
      selected && styles.selected,
      style
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  padding: {
    padding: 16,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
});
