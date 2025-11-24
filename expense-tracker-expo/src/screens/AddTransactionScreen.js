import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Button, Snackbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  primaryColor,
  backgroundColor,
  surfaceColor,
  textColor,
  secondaryColor,
  gradientColors,
} from '../utils/GlobalStyle';
import CategoryModal from '../components/CategoryModal';
import { addTransaction, updateTransaction } from '../utils/Api';
import { dateFormat } from '../utils/HelperFunctions';

const AddTransactionScreen = ({ navigation, route }) => {
  const { name, transaction, showFutureDates } = route.params || {};
  const isUpdate = name === 'Update Transaction';

  const [title, setTitle] = useState(isUpdate ? transaction.title : '');
  const [amount, setAmount] = useState(isUpdate ? transaction.amount.toString() : '');
  const [category, setCategory] = useState(
    isUpdate
      ? { title: transaction.categoryName, id: transaction.categoryId, color: transaction.color }
      : { title: 'Category', id: '0', color: primaryColor }
  );
  const [date, setDate] = useState(isUpdate ? new Date(transaction.date) : new Date());
  const [note, setNote] = useState(isUpdate ? transaction.note : '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSave = async () => {
    if (title.trim() === '' || amount.trim() === '' || category.id === '0') {
      Alert.alert('Error', 'Please fill all fields (Title, Amount, Category).');
      return;
    }

    setLoading(true);
    const payload = {
      title,
      amount: parseFloat(amount),
      categoryId: category.id,
      date,
      note,
      type: 'Expense', // Defaulting to Expense for now
    };

    try {
      let result;
      if (isUpdate) {
        result = await updateTransaction(transaction.id, payload);
      } else {
        result = await addTransaction(payload);
      }

      if (result) {
        setSnackbarMessage(isUpdate ? 'Transaction Updated!' : 'Transaction Added!');
        setSnackbarVisible(true);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        Alert.alert('Error', 'Failed to save transaction.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
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
            buttonColor={primaryColor}
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
    shadowOffset: { width: 0, height: 4 },
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
    fontSize: 16,
    color: textColor,
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 4,
  },
  saveButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
