import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NotationSection({ selectedOption, setSelectedOption, total, setTotal }) {
  // Fonction pour sélectionner une option et calculer le total
  const handleSelectOption = (option, price) => {
    setSelectedOption(option);
    setTotal(price); // Met à jour le total avec le prix sélectionné
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Notation</Text>
      <Text style={styles.sectionSubtitle}>
        Ces notations vous permettent de rester en haut pour plus de visibilité. Choisissez la notation selon votre besoin.
      </Text>

      <TouchableOpacity
        style={[styles.notationOption, selectedOption === 'urgent' && styles.selected]}
        onPress={() => handleSelectOption('urgent', 3)}
      >
        <View style={[styles.notationBadge, { backgroundColor: '#FF4D4D' }]}>
          <Text style={styles.badgeText}>Urgent</Text>
        </View>
        <Text style={styles.priceText}>3 $ / P/J</Text>
        <View style={styles.circle}>
          {selectedOption === 'urgent' && <View style={styles.filledCircle} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.notationOption, selectedOption === 'new' && styles.selected]}
        onPress={() => handleSelectOption('new', 1.5)}
      >
        <View style={[styles.notationBadge, { backgroundColor: '#1C78FF' }]}>
          <Text style={styles.badgeText}>New</Text>
        </View>
        <Text style={styles.priceText}>1.50 $ / P/J</Text>
        <View style={styles.circle}>
          {selectedOption === 'new' && <View style={styles.filledCircle} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.notationOption, selectedOption === 'top' && styles.selected]}
        onPress={() => handleSelectOption('top', 2)}
      >
        <View style={[styles.notationBadge, { backgroundColor: '#00C853' }]}>
          <Text style={styles.badgeText}>Top</Text>
        </View>
        <Text style={styles.priceText}>2 $ / P/J</Text>
        <View style={styles.circle}>
          {selectedOption === 'top' && <View style={styles.filledCircle} />}
        </View>
      </TouchableOpacity>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Totale :</Text>
        <Text style={styles.totalAmount}>{total.toFixed(2)} $ / Week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  notationOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selected: {
    backgroundColor: '#484848',
  },
  notationBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  totalContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
