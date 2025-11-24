import React, { useState, useEffect } from 'react';
import {
  RefreshControl,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import { FAB } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTypeSelection from '../components/DateTypeSelection';
import {
  getAllTransactions,
  netExpense,
  dateFilterHelper,
} from '../utils/HelperFunctions';
import Card from '../components/Card';
import PieChart from '../components/PieChart';
import {
  primaryColor,
  backgroundColor,
  surfaceColor,
  textColor,
  accentColor,
  gradientColors,
  secondaryColor,
} from '../utils/GlobalStyle';

const HomeScreen = ({ reload, allCategories, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(new Date());

  const { portrait } = useDeviceOrientation();

  const onRefresh = () => {
    setRefreshing(true);
    reload();
    setRefreshing(false);
  };

  const handleDateFilter = (type, value) => {
    if (allCategories === null) {
      setCategories(null);
      return;
    }
    let tempCategories = JSON.parse(JSON.stringify(allCategories));
    let filteredCategories = dateFilterHelper(type, value, tempCategories);
    let total = netExpense(filteredCategories);
    filteredCategories = filteredCategories.map((item, index) => {
      item.percentage = Math.round((item.totalExpense / total) * 100);
      return item;
    });
    setCategories(filteredCategories);
    setTotal(total);
  };

  const handleCategoryPress = value => {
    let category = [value];
    let transactions = getAllTransactions(category);
    navigation.navigate('AllTransactionsScreen', {
      transactions: transactions,
    });
  };

  const handleButtonPress = () => {
    navigation.navigate('AddTransactionScreen', {
      name: 'Add Transaction',
      showFutureDates: false,
    });
  };

  useEffect(() => {
    setDate(new Date());
    handleDateFilter('Month', new Date());
  }, [allCategories]);

  const ListHeader = () => (
    <View>
      <View style={styles.dateContainer}>
        <DateTypeSelection date={date} sendDateToHome={handleDateFilter} />
      </View>
      <View style={styles.chartContainer}>
        <PieChart categories={categories} total={total} />
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Spending Breakdown</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={surfaceColor} />
        }
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <Card item={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={handleButtonPress}
      />
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glassmorphism
    margin: 16,
    borderRadius: 16,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor, // Blue text
    fontFamily: 'Roboto',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: secondaryColor, // Gold FAB
  },
});
