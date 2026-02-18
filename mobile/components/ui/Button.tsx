import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[`${variant}Bg`],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#00D4AA'} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  primaryBg: {
    backgroundColor: '#00D4AA',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryBg: {
    backgroundColor: '#F3F4F6',
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  ghostBg: {
    backgroundColor: 'transparent',
  },
  // Sizes
  smSize: {
    height: 36,
    paddingHorizontal: 16,
  },
  mdSize: {
    height: 44,
    paddingHorizontal: 24,
  },
  lgSize: {
    height: 56,
    paddingHorizontal: 32,
  },
  // Text
  text: {
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#1C1C1E',
  },
  outlineText: {
    color: '#1C1C1E',
  },
  ghostText: {
    color: '#8E8E93',
  },
  smText: {
    fontSize: 13,
  },
  mdText: {
    fontSize: 15,
  },
  lgText: {
    fontSize: 17,
  },
});
