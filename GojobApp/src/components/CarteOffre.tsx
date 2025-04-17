import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CarteOffreProps {
  titre: string;
  entreprise: string;
  location: string;
  logo: string;
  timeAgo: string;
  isFavorite?: boolean;
  isUrgent?: boolean;
  isNew?: boolean;
  onPress: () => void;
  onFavoriteToggle?: () => void;
}

export const CarteOffre: React.FC<CarteOffreProps> = ({
  titre,
  entreprise,
  location,
  logo,
  timeAgo,
  isFavorite = false,
  isUrgent = false,
  isNew = false,
  onPress,
  onFavoriteToggle
}) => {
    const theme = useTheme();
  
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container, 
          { backgroundColor: theme.couleurs.FOND_SECONDAIRE }
        ]}
      >
        <Image source={{ uri: logo }} style={styles.logo} />
        
        <View style={styles.content}>
          <Text style={[
            styles.title, 
            { color: theme.couleurs.TEXTE_PRIMAIRE }
          ]}>{titre}</Text>
          <Text style={[
            styles.company,
            { color: theme.couleurs.TEXTE_SECONDAIRE }
          ]}>{entreprise}</Text>
          <Text style={[
            styles.location,
            { color: theme.couleurs.TEXTE_SECONDAIRE }
          ]}>{location}</Text>
        </View>
        
        {isUrgent && (
          <View style={[styles.badge, styles.urgentBadge, { backgroundColor: theme.couleurs.URGENT }]}>
            <Text style={styles.badgeText}>URGENT</Text>
          </View>
        )}
        
        {isNew && (
          <View style={[styles.badge, styles.newBadge, { backgroundColor: theme.couleurs.NOUVELLE }]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        
        <TouchableOpacity
          onPress={onFavoriteToggle}
          style={styles.favoriteButton}
        >
          <Text style={{ 
            color: isFavorite ? theme.couleurs.ERREUR : theme.couleurs.TEXTE_TERTIAIRE, 
            fontSize: 20 
          }}>
            {isFavorite ? '❤️' : '♡'}
          </Text>
        </TouchableOpacity>
        
        <Text style={[
          styles.timeAgo,
          { color: theme.couleurs.TEXTE_TERTIAIRE }
        ]}>{timeAgo}</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  company: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    top: 8,
    left: 8,
  },
  urgentBadge: {
    backgroundColor: 'red',
  },
  newBadge: {
    backgroundColor: 'blue',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: '#777',
    position: 'absolute',
    bottom: 10,
    right: 10,
  }
});