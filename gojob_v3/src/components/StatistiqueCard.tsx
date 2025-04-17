import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface StatistiqueCardProps {
  titre: string;
  valeur: string | number;
  couleur: string;
  icon?: React.ReactNode;
}

export const StatistiqueCard: React.FC<StatistiqueCardProps> = ({
  titre,
  valeur,
  couleur,
  icon
}) => {
  const theme = useTheme();

    return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <View style={styles.header}>
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{titre}</Text>
        {icon}
        </View>
        
        <Text style={[styles.value, { color: couleur }]}>{valeur}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});