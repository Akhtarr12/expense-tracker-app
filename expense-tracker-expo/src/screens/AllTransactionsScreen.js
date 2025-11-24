import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  primaryColor,
  backgroundColor,
  surfaceColor,
  textColor,
  gradientColors,
  secondaryColor,
} from '../utils/GlobalStyle';
import { dateFormat } from '../utils/HelperFunctions';
import ExportToExcel from '../utils/ExportToExcel';

const AllTransactionsScreen = ({ route, navigation }) => {
  const { transactions } = route.params;
  const [data, setData] = useState(transactions);
  const [searchText, setSearchText] = useState('');

  const handleSearch = text => {
    setSearchText(text);
    if (text.trim() === '') {
      setData(transactions);
      return;
    }
    const filtered = transactions.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(text.toLowerCase())
    );
    setData(filtered);
  };

  useEffect(() => {
    setData(transactions);
  }, [transactions]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {dateFormat(item.date)}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.categoryText}>{item.categoryName}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            {item.currency} {item.amount}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color={primaryColor} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <ExportToExcel data={data} />
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default AllTransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surfaceColor,
    borderRadius: 25,
    paddingHorizontal: 12,
    marginRight: 10,
    height: 45,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: textColor,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: surfaceColor,
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: secondaryColor, // Gold accent
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    marginRight: 16,
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textColor,
  },
  categoryText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  amountContainer: {
    marginLeft: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: textColor,
    fontSize: 16,
  },
});
