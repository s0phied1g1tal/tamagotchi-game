import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ style, ...props }) => {
  return <Text {...props} style={[styles.customFont, style]} />;
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'CherryBomb', file
  },
});

export default CustomText;
