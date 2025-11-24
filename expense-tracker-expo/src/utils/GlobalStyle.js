import { StyleSheet } from 'react-native';

// Premium Wine & Gold Theme
export const primaryColor = '#722F37'; // Wine / Deep Burgundy
export const secondaryColor = '#D4AF37'; // Gold
export const accentColor = '#501B1D'; // Darker Wine
export const backgroundColor = '#F9F5F6'; // Very soft pinkish white
export const surfaceColor = '#FFFFFF'; // White cards
export const textColor = '#2C0E10'; // Dark Wine/Black
export const errorColor = '#C0392B'; // Strong Red

export const gradientColors = ['#722F37', '#501B1D']; // Wine Gradient

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
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#722F37', // Wine shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(114, 47, 55, 0.1)', // Subtle wine border
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#7F8C8D', // Grey
  },
});

// Premium Category Colors (Muted/Elegant)
export const categoryColors = [
  '#722F37', // Wine
  '#D4AF37', // Gold
  '#2C3E50', // Navy
  '#E67E22', // Bronze
  '#27AE60', // Emerald
  '#8E44AD', // Plum
  '#C0392B', // Rust
  '#16A085', // Teal
  '#7F8C8D', // Slate
  '#F1C40F', // Yellow Gold
];
