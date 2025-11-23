import { Alert } from 'react-native';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

const ExportToExcel = async (type, selectedDate, data) => {
  let presentDate = new Date();
  if (type === 'Day') selectedDate = moment(selectedDate).format('DD-MMM-YYYY');
  else if (type === 'Month')
    selectedDate = moment(selectedDate).format('MMMM,YYYY');
  else if (type === 'Year') selectedDate = selectedDate.toString();
  else selectedDate = '';

  const filename = `Report(${selectedDate})_${presentDate.getTime()}.xlsx`;
  const fileUri = FileSystem.documentDirectory + filename;

  const exportDataToExcel = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    try {
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Uh oh", "Sharing isn't available on your platform");
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (e) {
      console.log('Error', e);
      Alert.alert('Error', 'Failed to export file');
    }
  };

  exportDataToExcel();
};

export default ExportToExcel;
