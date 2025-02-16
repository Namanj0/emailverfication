import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Button, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';


const ExpenseTrackerScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
      } catch (error) {
        console.error('Failed to load expenses:', error);
      }
    };
    loadExpenses();
  }, []);

  const handleSaveExpense = async () => {
    const newExpense = {
      id: editingExpense ? editingExpense.id : Math.random().toString(),
      amount: expenseAmount,
      description: expenseDescription,
      date: expenseDate.toISOString(),
    };

    let updatedExpenses;
    if (editingExpense) {
      updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id ? newExpense : expense
      );
    } else {
      updatedExpenses = [...expenses, newExpense];
    }

    setExpenses(updatedExpenses);

    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('Failed to save expenses:', error);
    }

    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseDate(new Date());
    setModalVisible(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expenseId) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);

    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setExpenseAmount(expense.amount);
    setExpenseDescription(expense.description);
    setExpenseDate(new Date(expense.date));
    setEditingExpense(expense);
    setModalVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expenseDate;
    setExpenseDate(currentDate);
  };

  const renderExpense = ({ item }) => (
    <View style={styles.expenseCard}>
      <View>
        <Text style={styles.expenseText}>{item.description}</Text>
        <Text style={styles.expenseAmount}>₹{item.amount}</Text>
        <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEditExpense(item)} style={styles.editButton}>
          <AntDesign name="edit" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteExpense(item.id)} style={styles.deleteButton}>
          <AntDesign name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Header title="Expense Tracker" />
      </View>


      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses recorded</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setExpenseAmount('');
          setExpenseDescription('');
          setExpenseDate(new Date());
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{editingExpense ? 'Edit Expense' : 'Add Expense'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            placeholderTextColor="#888"
            value={expenseDescription}
            onChangeText={setExpenseDescription}
          />

          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>Select Date:</Text>
            <DateTimePicker
              value={expenseDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
              <Text style={styles.saveButtonText}>{editingExpense ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
    marginTop: 20, // Added marginTop
  },
  datePickerLabel: {
    fontSize: 16,
    margin: 10,
    fontWeight: 'bold',


  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginTop: 25,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  expenseCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#009688',
    fontWeight: 'bold',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    backgroundColor: '#FFEB3B',
    padding: 6,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 6,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 0,
    borderRadius: 10,
    marginTop: 45,
    height: '100%',
    width: '100%'

  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,

  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ExpenseTrackerScreen;
