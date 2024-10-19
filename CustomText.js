import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ style, ...props }) => {
  return <Text {...props} style={[styles.customFont, style]} />;
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'CherryBomb', // Use the font name as defined in your font file
  },
});

export default CustomText;
