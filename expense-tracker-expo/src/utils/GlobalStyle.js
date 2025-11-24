import { StyleSheet } from 'react-native';

// Elegant Theme Palette
export const primaryColor = '#2A9D8F'; // Teal
export const secondaryColor = '#264653'; // Dark Charcoal
export const accentColor = '#E9C46A'; // Muted Gold
export const backgroundColor = '#F4F4F9'; // Off-white background
export const surfaceColor = '#FFFFFF'; // White cards
export const textColor = '#264653'; // Dark text
export const errorColor = '#E76F51'; // Burnt Orange

export const globalStyle = StyleSheet.create({
  error: {
    color: errorColor,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: 'Roboto', // Assuming default font for now, can be changed
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#6B7280', // Grey
  },
});

// Modern Category Colors
export const categoryColors = [
  '#2A9D8F', // Teal
  '#E9C46A', // Gold
  '#F4A261', // Orange
  '#E76F51', // Burnt Orange
  '#264653', // Dark Blue
  '#8AB17D', // Green
  '#B5838D', // Pinkish
  '#6D597A', // Purple
  '#E5989B', // Soft Red
  '#B56576', // Rose
];
