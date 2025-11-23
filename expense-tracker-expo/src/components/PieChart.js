import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart as ChartKitPie } from 'react-native-chart-kit';
import { textColor, primaryColor } from '../utils/GlobalStyle';
import { windowWidth } from '../utils/Dimentions';

const PieChart = ({ categories, total }) => {
  const rupeesSymbol = '\u20B9';
  const gaugeText = `${total} ${rupeesSymbol}`;

  let data = [];
  if (categories !== null) {
    data = categories.map(item => {
      return {
        name: item.name,
        population: item.percentage,
        color: item.color,
        legendFontColor: textColor,
        legendFontSize: 12,
      };
    });
  }

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <ChartKitPie
        data={data}
        width={windowWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[10, 0]}
        absolute
      />
      <View style={styles.gauge}>
        <Text style={styles.gaugeText}>{gaugeText}</Text>
      </View>
    </View>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gauge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 90, // Adjusted for center
    left: 0,
    right: 0,
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: textColor,
    fontSize: 20,
    fontWeight: '500',
  },
});
