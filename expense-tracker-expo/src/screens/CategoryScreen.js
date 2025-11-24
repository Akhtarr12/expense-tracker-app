import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import CategoryModal from '../components/CategoryModal';
import Loading from '../components/Loading';
import { windowWidth } from '../utils/Dimentions';
import {
  globalStyle,
  primaryColor,
  textColor,
  backgroundColor,
  surfaceColor,
  secondaryColor,
} from '../utils/GlobalStyle';

const CategoryScreen = ({
  categories,
  addCategory,
  deleteCategory,
  updateCategory,
}) => {
  let initialState = {
    name: '',
    color: '#2196F3', // Default Blue
    type: 'expense', // Default type
  };

  const [errMsg, setErrMsg] = useState('');
  const [data, setData] = useState(categories);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = text => {
    if (text.trim() === '') {
      setData(categories);
    } else {
      setData(
        categories.filter(
          item => item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1,
        ),
      );
    }
  };

  const handleChange = (key, value) => {
    setPayload({ ...payload, [key]: value });
  };

  const handleModalVisibility = flag => {
    setPayload(initialState);
    setModalVisible(flag);
    setErrMsg('');
  };

  const handleSubmit = async () => {
    if (payload.name.trim() === '') {
      setErrMsg('Please enter a name.');
      return;
    }

    setModalVisible(false);
    setIsLoading(true);
    setErrMsg('');

    try {
      let isSuccessful;
      if (isUpdate) {
        isSuccessful = await updateCategory(payload);
        setIsUpdate(false);
      } else {
        isSuccessful = await addCategory(payload);
      }

      if (isSuccessful) {
        setPayload(initialState);
      } else {
        setErrMsg('Failed to save category. Please try again.');
      }
    } catch (error) {
      console.error("Category submit error:", error);
      setErrMsg('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async id => {
    setIsLoading(true);
    try {
      const isDeleted = await deleteCategory(id);
      if (!isDeleted) {
        Alert.alert(
          'Error',
          'Could not delete category. It might be in use or network issue.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error("Delete category error:", error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = item => {
    setIsUpdate(true);
    setPayload(item);
    setModalVisible(true);
    setErrMsg('');
  };

  const handleAdd = () => {
    setIsUpdate(false);
    setPayload(initialState);
    setModalVisible(true);
    setErrMsg('');
  };

  useEffect(() => {
    setData(categories);
  }, [categories]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View
        style={{
          flex: 3,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={[styles.color, { backgroundColor: item.color }]} />
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <Icon
          size={24}
          color="#1E88E5"
          name="pencil-outline"
          onPress={() => handleUpdate(item)}
        />
        <Icon
          size={24}
          color="#D32F2F"
          name="trash-can-outline"
          onPress={() => handleDelete(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      ) : (
        <>
          {modalVisible ? (
            <CategoryModal
              payload={payload}
              isUpdate={isUpdate}
              handleSave={handleSubmit}
              handleChange={handleChange}
              handleModalVisibility={handleModalVisibility}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <TextInput
                  style={styles.input}
                  placeholder="Search Categories"
                  placeholderTextColor="#999"
                  onChangeText={text => handleSearch(text)}
                />
                <Button
                  buttonColor={primaryColor}
                  mode="contained"
                  style={{ alignSelf: 'center', borderRadius: 20 }}
                  labelStyle={{ color: '#fff' }}
                  onPress={handleAdd}>
                  + Add
                </Button>
              </View>
              {errMsg.trim().length !== 0 && (
                <Text style={globalStyle.error} onPress={() => setErrMsg('')}>
                  {errMsg}
                </Text>
              )}
              <FlatList
                style={{ marginTop: 10 }}
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  input: {
    color: textColor,
    borderBottomWidth: 1,
    width: windowWidth / 1.4,
    borderBottomColor: '#BDBDBD',
    fontSize: 17,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: surfaceColor,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 10,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  color: {
    marginRight: 10,
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
  iconsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
