import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Categories({ selectedCategory, setSelectedCategory, errors, touched }) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const categories = ['Commercial', 'Développeur', 'Designer', 'Marketing', 'RH', 'Finance'];

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(false); // Fermer la modal après sélection
  };

  return (
    <View>
      <Text style={styles.label}>Categories</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.dropdown} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.dropdownText}>
            {selectedCategory ? selectedCategory : 'Select category'}
          </Text>
          <Ionicons name="chevron-down-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {errors.selectedCategory && touched.selectedCategory && (
        <Text style={styles.errorText}>{errors.selectedCategory}</Text>
      )}

      {/* Modal pour afficher la liste des catégories */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCategory(item)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#666',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arrière-plan semi-transparent
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1C78FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText:{
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
  }
});
