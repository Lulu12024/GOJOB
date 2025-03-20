import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

type Category = {
  id: number;
  name: string;
};

type CategoriesProps = {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
};

const categoriesData: Category[] = [
  { id: 1, name: 'Backpaker' },
  { id: 2, name: 'Mines' },
  { id: 3, name: 'Construction' },
  { id: 4, name: 'Pêche' },
  { id: 5, name: 'Hôtellerie' },
  { id: 6, name: 'Agriculture' },
  { id: 7, name: 'Forêt' },
  { id: 8, name: 'Plombier' },
];

export default function Categories({
  visible,
  onClose,
  onSelectCategory,
}: CategoriesProps) {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        onSelectCategory(item.name);
        onClose();
      }}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Catégorie</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Clear All</Text>
          </TouchableOpacity>
          <FlatList
            data={categoriesData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    color: '#F385BA',
    fontWeight: 'bold',
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  categoryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
