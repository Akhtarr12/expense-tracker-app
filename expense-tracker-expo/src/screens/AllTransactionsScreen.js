import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDeviceOrientation } from '@react-native-community/hooks';
import Loading from '../components/Loading';
import { primaryColor, textColor, backgroundColor, surfaceColor } from '../utils/GlobalStyle';
import ExportToExcel from '../utils/ExportToExcel';
import TransactionModal from '../components/TransactionModal';
import DateTypeSelection from '../components/DateTypeSelection';

const AllTransactionsScreen = ({
  route,
  navigation,
  allTransactions,
  deleteTransaction,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [tempTransactions, setTempTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateAndType, setdateAndType] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [date, setDate] = useState(new Date());

  const { landscape } = useDeviceOrientation();

  const hideModal = () => {
    setModalItem(null);
  };

  const handleDateFilter = (type, value) => {
    setdateAndType([type, value]);
    switch (type) {
      case 'Day':
        setTransactions(
          tempTransactions.filter(
            item =>
              new Date(item.transactionDate).toLocaleDateString() ===
              value.toLocaleDateString(),
          ),
        );
        break;
      case 'Month':
        setTransactions(
          tempTransactions.filter(item => {
            let date = new Date(item.transactionDate);
            return (
              date.getMonth() === value.getMonth() &&
              date.getFullYear() === value.getFullYear()
            );
          }),
        );
        break;
      case 'Year':
        setTransactions(
          tempTransactions.filter(
            item => new Date(item.transactionDate).getFullYear() === value,
          ),
        );
        break;
    }
  };

  const sortTransactions = property => {
    const sortedData = [...transactions].sort(
      (a, b) => b[property] - a[property],
    );
    setTransactions(sortedData);
  };

  const handleExport = async () => {
    setIsLoading(true);

    //Covert transactionDate, rename key names and remove unnecessary fields
    let data = JSON.parse(JSON.stringify(transactions));
    for (let item of data) {
      item.date = moment(new Date(item.transactionDate)).format('DD-MMM-YYYY');
      if (item.note.trim() === '') item.note = 'null';
      item.category = item.categoryName;
      delete item.transactionDate;
      delete item.id;
      delete item.color;
      delete item.remind;
      delete item.categoryId;
      delete item.categoryName;
    }

    await ExportToExcel(dateAndType[0], dateAndType[1], data);
    setIsLoading(false);
  };

  const handleDelete = async transaction => {
    setIsLoading(true);
    const isDeleted = await deleteTransaction(
      transaction.categoryId,
      transaction.id,
    );
    if (isDeleted) {
      setTransactions(transactions.filter(item => item.id !== transaction.id));
    } else {
      Alert.alert(
        'Error!',
        'Problem deleting transaction. Please try again later.',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: true },
      );
    }
    setModalItem(null);
    setIsLoading(false);
  };

  const handleUpdate = transaction => {
    setModalItem(null);
    navigation.navigate('AddTransactionScreen', {
      name: 'Add Transaction',
      transaction: transaction,
      showFutureDates: false,
    });
  };

  const showDialog = () => {
    if (transactions.length < 1) {
      Alert.alert('Error!', 'No data found', [{ text: 'Cancel' }]);
      return;
    }
    let dateValue = dateAndType[1];
    if (dateAndType[0] === 'Day') dateValue = dateValue.toLocaleDateString();
    else if (dateAndType[0] === 'Year') dateValue = 'year ' + dateValue;
    else dateValue = moment(dateValue).format('MMMM, YYYY');
    Alert.alert('Confirmation!', 'Export data of ' + dateValue, [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => handleExport() },
    ]);
  };

  useEffect(() => {
    if (route.params === undefined) setTempTransactions(allTransactions);
    else setTransactions(route.params.transactions);
  }, [route.params === undefined ? allTransactions : transactions]);

  useEffect(() => {
    handleDateFilter('Month', new Date());
  }, [tempTransactions]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => showDialog()}>
          <Icon name="file-export-outline" size={30} color={primaryColor} />
        </TouchableOpacity>
      ),
    });
  }, [transactions]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setModalItem(item)} style={styles.card}>
      <View style={styles.cardDate}>
        <View>
          <Text style={styles.text}>
            {moment(new Date(item.transactionDate)).format('DD')}
          </Text>
          <Text style={styles.text}>
            {moment(new Date(item.transactionDate)).format('MMM')}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.text}>{item.categoryName}</Text>
        <Text style={{ color: 'grey' }}>
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
});
