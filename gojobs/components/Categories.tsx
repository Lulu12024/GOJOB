import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Category = {
  id: number;
  name: string;
  children?: string[];
};

type CategoriesProps = {
  visible: boolean;
  onClose: () => void;
  onSelectCategories: (categories: string[]) => void;
};

const categoriesData: Category[] = [
  { id: 1, name: 'Backpaker', children: ['Plombier', 'Backpak', 'Plombi', 'Backpaker'] },
  { id: 2, name: 'Mines' },
  { id: 3, name: 'Construction' },
  { id: 4, name: 'Pêche' },
  { id: 5, name: 'Hôtellerie' },
  { id: 6, name: 'Agriculture' },
  { id: 7, name: 'Forêt' },
];

export default function Categories({
  visible,
  onClose,
  onSelectCategories,
}: CategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const selectOption = (optionName: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionName)
        ? prev.filter((option) => option !== optionName) // Retirer si déjà sélectionné
        : [...prev, optionName] // Ajouter sinon
    );
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isExpanded = expandedCategory === item.name;

    return (
      <>
        {/* Catégorie principale */}
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => toggleCategory(item.name)}
        >
          <View style={styles.categoryMainRow}>
            <Text style={styles.categoryText}>{item.name}</Text>
            {item.name === 'Backpaker' && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
          </View>
          {item.children ? (
            <MaterialIcons
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={24}
              color="#FFFFFF"
            />
          ) : (
            <MaterialIcons
              name={selectedOptions.includes(item.name) ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={20}
              color={selectedOptions.includes(item.name) ? '#1A73E8' : '#777'}
              onPress={() => selectOption(item.name)}
            />
          )}
        </TouchableOpacity>

        {/* Sous-catégories */}
        {isExpanded &&
          item.children &&
          item.children.map((child, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subCategoryItem}
              onPress={() => selectOption(child)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedOptions.includes(child) && styles.selectedText,
                ]}
              >
                {child}
              </Text>
              <MaterialIcons
                name={selectedOptions.includes(child) ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={selectedOptions.includes(child) ? '#1A73E8' : '#777'}
              />
            </TouchableOpacity>
          ))}
      </>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Catégorie</Text>
            <TouchableOpacity onPress={() => setSelectedOptions([])}>
              <Text style={styles.clearAllText}>clear all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoriesData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <TouchableOpacity
            style={styles.goButton}
            onPress={() => {
              console.log('Selected Options:', selectedOptions);
              onSelectCategories(selectedOptions);
              onClose();
            }}
          >
            <Text style={styles.goButtonText}>GO</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearAllText: {
    color: '#666666',
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  categoryMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#0E365BBF',
    borderRadius: 2,
    paddingHorizontal: 6,
    marginLeft: 18,
    width:35,
    height:18,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignItems:'center',
    textAlign:'center'
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  categoryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#1A73E8',
    fontWeight: 'bold',
  },
  goButton: {
    backgroundColor: '#0E365BBF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  goButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
