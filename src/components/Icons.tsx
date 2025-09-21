import React from 'react';
import {Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
}

const iconMap: {[key: string]: string} = {
  // Navigation
  'arrow-back': '←',
  'arrow-forward': '→',
  'chevron-right': '›',
  'chevron-left': '‹',
  'keyboard-arrow-up': '▲',
  'keyboard-arrow-down': '▼',

  // Actions
  'add': '+',
  'close': '×',
  'check': '✓',
  'delete': '🗑',
  'edit': '✏',
  'more': '⋯',

  // Education
  'school': '🎓',
  'book': '📚',
  'trending-up': '📈',
  'analytics': '📊',
  'timer': '⏱',
  'flag': '🚩',
  'target': '🎯',

  // User
  'person': '👤',
  'group': '👥',
  'account': '👤',

  // Communication
  'email': '✉',
  'notification': '🔔',
  'message': '💬',

  // Settings
  'settings': '⚙',
  'logout': '↗',
  'login': '↙',
  'visibility': '👁',
  'visibility-off': '🙈',
  'lock': '🔒',
  'unlock': '🔓',

  // Subject icons
  'functions': '🔢',
  'balance': '⚖',
  'language': '🌐',
  'science': '🔬',
  'history': '📜',
  'geography': '🌍',
  'literature': '📝',
  'philosophy': '🤔',
  'physics': '⚛',
  'chemistry': '🧪',
  'biology': '🧬',
  'mathematics': '📐',

  // Status
  'success': '✅',
  'error': '❌',
  'warning': '⚠',
  'info': 'ℹ',
  'help': '❓',
  'remove': '−',

  // Misc
  'home': '🏠',
  'star': '⭐',
  'heart': '❤',
  'emoji-events': '🏆',
  'construction': '🚧',
  'calendar-today': '📅',
  'category': '📂',
};

const Icon: React.FC<IconProps> = ({name, size = 24, color = '#000000', style}) => {
  const iconSymbol = iconMap[name] || '❓';

  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color: color,
          lineHeight: size + 2,
        },
        style,
      ]}>
      {iconSymbol}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default Icon;
