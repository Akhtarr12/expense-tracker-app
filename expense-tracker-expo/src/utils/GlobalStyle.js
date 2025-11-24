import { StyleSheet } from 'react-native';

// Light Blue & White Theme (High Visibility)
export const primaryColor = '#1E88E5'; // Blue
export const secondaryColor = '#FFC107'; // Amber/Gold
export const accentColor = '#1565C0'; // Darker Blue
export const backgroundColor = '#FFFFFF'; // White
export const surfaceColor = '#F5F5F5'; // Light Grey
export const textColor = '#000000'; // Black
export const errorColor = '#D32F2F'; // Red

export const gradientColors = ['#FFFFFF', '#FFFFFF']; // No gradient (White)

export const globalStyle = StyleSheet.create({
  error: {
    color: errorColor,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: surfaceColor,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#757575', // Grey
  },
});

// Standard Category Colors
export const categoryColors = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
];
