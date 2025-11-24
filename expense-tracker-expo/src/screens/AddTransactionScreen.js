import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import moment from 'moment';
import DatePicker from '../components/DatePicker';
import Loading from '../components/Loading';
import {
  globalStyle,
  primaryColor,
  secondaryColor,
  textColor,
  backgroundColor,
  surfaceColor,
  accentColor,
} from '../utils/GlobalStyle';

const AddTransactionScreen = ({
  navigation,
  route,
  categories,
  addTransaction,
  updateTransaction,
}) => {
  // showFutureDates === true, reminder txn, else regular txn
  const showFutureDates = route.params.showFutureDates;

  // Transaction which needs to be updated
  const oldTransaction = route.params.transaction;

  let initialState = {
    amount: 0,
    note: '',
    transactionDate: new Date().getTime(),
    remind: false,
  };

  const today = new Date();
  let yesterday = new Date();
  let tomorrow = new Date();
  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const [payload, setPayload] = useState(initialState);
  const [categoryId, setCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const prepopulateDataForUpdate = () => {
    setCategoryId(oldTransaction.categoryId);
    setSelectedDate(new Date(oldTransaction.transactionDate));
    setPayload({
      ...payload,
      amount: oldTransaction.amount,
      note: oldTransaction.note,
      transactionDate: oldTransaction.transactionDate,
    });
  };

  const handleChange = (key, value) => {
    setPayload({ ...payload, [key]: value });
  };

  const dateToString = date => {
    return moment(date).format('DD/MM');
  };

  const handleSelectDate = inDate => {
    setShowDatePicker(false);
    setSelectedDate(inDate);
    setPayload({ ...payload, transactionDate: inDate.getTime() });
  };

  const isSelectedDateVisible = () => {
    if (showFutureDates)
      return (
        selectedDate.toLocaleDateString() !== yesterday.toLocaleDateString() &&
        selectedDate.toLocaleDateString() !== tomorrow.toLocaleDateString()
      );
    return (
      selectedDate.toLocaleDateString() !== today.toLocaleDateString() &&
      selectedDate.toLocaleDateString() !== yesterday.toLocaleDateString() &&
      selectedDate.toLocaleDateString() !== tomorrow.toLocaleDateString()
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    //Validation
    if (validate() === false) {
      setIsLoading(false);
      return;
    }

    //To add a reminder txn
    let payloadToSend = { ...payload };
    if (showFutureDates) payloadToSend.remind = true;

    let isSuccessful;
    if (oldTransaction !== undefined)
      isSuccessful = await updateTransaction(
        payloadToSend,
        categoryId,
        oldTransaction.id,
      );
    else isSuccessful = await addTransaction(payloadToSend, categoryId);

    if (isSuccessful) {
      setCategoryId(null);
      setPayload(initialState);
      setErrMsg('');
      setIsLoading(false);
      navigation.goBack();
    } else {
      setErrMsg('Error adding/updating transaction. Please try again later.');
      setIsLoading(false);
    }
  };

  const validate = () => {
    if (payload.amount <= 0) {
      setErrMsg('Amount must be greater than 0');
      return false;
    }
    if (isNaN(payload.amount)) {
      setErrMsg('Amount must be a number');
      return false;
    }
    if (categoryId === null) {
      setErrMsg('Please select the category');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (oldTransaction !== undefined) prepopulateDataForUpdate();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <Loading />
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          {/* FlatList is used to prevent the following warning:
          VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.  */}
          <FlatList
            ListHeaderComponent={
              <>
                <View
                  style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    value={payload.amount.toString()}
                    style={styles.amountField}
                    autoFocus={true}
                    placeholder="INR"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    onChangeText={text => handleChange('amount', text)}
                  />
                </View>
                <Text style={[styles.heading, { marginTop: 10 }]}>
                  Categories
                </Text>
              </>
            }
            numColumns={4}
            data={categories}
            keyExtractor={item => item.id}
            columnWrapperStyle={{ flex: 1, justifyContent: 'space-evenly' }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setCategoryId(item.id)}
                style={[
                  styles.categoryBox,
                  { borderColor: item.color },
                  categoryId === item.id && { backgroundColor: item.color },
                ]}>
                {item.title.length > 10 ? (
                  <Text style={styles.categoryText}>
                    {item.title.slice(0, 8) + '...'}
                  </Text>
                ) : (
                  <Text style={styles.categoryText}>{item.title}</Text>
                )}
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <>
                {!showFutureDates && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CategoryScreen')}
                    style={
                      // styles.categoryBox,
                      styles.addCategoryBox
                    }>
                    <Text style={[styles.categoryText, { color: '#fff' }]}>
                      + Create
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.heading}>Date</Text>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateBoxes}>
                      {showFutureDates ? (
                        <TouchableOpacity
                          onPress={() => handleSelectDate(tomorrow)}
                          style={[
                            styles.dateBox,
                            { marginRight: 30 },
                            <LinearGradient colors={gradientColors} style={styles.container}>
                              <ScrollView contentContainerStyle={styles.scrollContent}>
                                <View style={styles.card}>
                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Amount</Text>
                                    <View style={styles.amountContainer}>
                                      <Text style={styles.currencySymbol}>₹</Text>
                                      <TextInput
                                        style={styles.amountInput}
                                        placeholder="0"
                                        placeholderTextColor="#ccc"
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                      />
                                    </View>
                                  </View>

                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Title</Text>
                                    <TextInput
                                      style={styles.input}
                                      placeholder="What is this for?"
                                      placeholderTextColor="#999"
                                      value={title}
                                      onChangeText={setTitle}
                                    />
                                  </View>

                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Category</Text>
                                    <TouchableOpacity
                                      style={styles.categorySelector}
                                      onPress={() => setModalVisible(true)}>
                                      <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                                      <Text style={styles.categoryText}>{category.title}</Text>
                                      <Icon name="chevron-down" size={24} color="#999" />
                                    </TouchableOpacity>
                                  </View>

                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Date</Text>
                                    <TouchableOpacity
                                      style={styles.dateSelector}
                                      onPress={() => setShowDatePicker(true)}>
                                      <Icon name="calendar" size={24} color={primaryColor} />
                                      <Text style={styles.dateText}>{dateFormat(date)}</Text>
                                    </TouchableOpacity>
                                  </View>

                                  {showDatePicker && (
                                    <DateTimePicker
                                      value={date}
                                      mode="date"
                                      display="default"
                                      onChange={onDateChange}
                                      maximumDate={showFutureDates ? undefined : new Date()}
                                    />
                                  )}

                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Note (Optional)</Text>
                                    <TextInput
                                      style={[styles.input, styles.textArea]}
                                      placeholder="Add a note..."
                                      placeholderTextColor="#999"
                                      value={note}
                                      onChangeText={setNote}
                                      multiline
                                    />
                                  </View>

                                  <Button
                                    mode="contained"
                                    onPress={handleSave}
                                    loading={loading}
                                    style={styles.saveButton}
                                    labelStyle={styles.saveButtonLabel}>
                                    Save Transaction
                                  </Button>
                                </View>
                              </ScrollView>

                              <CategoryModal
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                setCategory={setCategory}
                              />

                              <Snackbar
                                visible={snackbarVisible}
                                onDismiss={() => setSnackbarVisible(false)}
                                duration={2000}
                                style={{ backgroundColor: secondaryColor }}>
                                {snackbarMessage}
                              </Snackbar>
                            </LinearGradient>
  );
};

                      export default AddTransactionScreen;

                      const styles = StyleSheet.create({
                        container: {
                        flex: 1,
  },
                      scrollContent: {
                        padding: 16,
  },
                      card: {
                        backgroundColor: surfaceColor,
                      borderRadius: 20,
                      padding: 20,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
  },
                      inputGroup: {
                        marginBottom: 20,
  },
                      label: {
                        fontSize: 14,
                      color: '#777',
                      marginBottom: 8,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
  },
                      amountContainer: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      paddingBottom: 5,
  },
                      currencySymbol: {
                        fontSize: 32,
                      color: primaryColor,
                      fontWeight: 'bold',
                      marginRight: 5,
  },
                      amountInput: {
                        fontSize: 32,
                      color: primaryColor,
                      fontWeight: 'bold',
                      flex: 1,
  },
                      input: {
                        backgroundColor: '#F9F9F9',
                      borderRadius: 10,
                      padding: 15,
                      fontSize: 16,
                      color: textColor,
                      borderWidth: 1,
                      borderColor: '#eee',
  },
                      textArea: {
                        height: 80,
                      textAlignVertical: 'top',
  },
                      categorySelector: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F9F9F9',
                      borderRadius: 10,
                      padding: 15,
                      borderWidth: 1,
                      borderColor: '#eee',
  },
                      colorDot: {
                        width: 20,
                      height: 20,
                      borderRadius: 10,
                      marginRight: 10,
  },
                      categoryText: {
                        fontSize: 16,
                      color: textColor,
                      flex: 1,
  },
                      dateSelector: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F9F9F9',
                      borderRadius: 10,
                      padding: 15,
                      borderWidth: 1,
                      borderColor: '#eee',
  },
                      dateText: {
                        marginTop: 20,
                      borderRadius: 25,
  },
});
