import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CarteOffreProps {
  titre: string;
  entreprise: string;
  location: string;
  logo: string | null;
  timeAgo: string;
  isFavorite?: boolean;
  isUrgent?: boolean;
  isNew?: boolean;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  views?: number;
  applications?: number;
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
  onFavoriteToggle,
  views,
  applications
}) => {
    const theme = useTheme();
    // Image par défaut si aucun logo n'est fourni ou si l'URL est invalide
    const imagePlaceholder = require('../assets/images/job-placeholder.png');
  
    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container, 
          { backgroundColor: theme.couleurs.FOND_SECONDAIRE }
        ]}
      >
        <Image 
          source={logo ? { uri: logo } : imagePlaceholder} 
          style={styles.logo}
          onError={(e) => {
            // En cas d'erreur de chargement de l'image, Image utilisera automatiquement 
            // l'image par défaut définie dans defaultSource 
            console.log("Erreur de chargement de l'image:", e.nativeEvent.error);
          }}
          defaultSource={imagePlaceholder}
        />
        
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
          
          {/* Statistiques de vues et candidatures */}
          {(views !== undefined || applications !== undefined) && (
            <Text style={[
              styles.statsText,
              { color: theme.couleurs.TEXTE_TERTIAIRE, marginTop: 4 }
            ]}>
              {views !== undefined ? `${views} vues` : ''}
              {views !== undefined && applications !== undefined ? ' · ' : ''}
              {applications !== undefined ? `${applications} candidatures` : ''}
            </Text>
          )}
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
        
        {onFavoriteToggle && (
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
        )}
        
        <Text style={[
          styles.timeAgo,
          { color: theme.couleurs.TEXTE_TERTIAIRE }
        ]}>{formatDate(timeAgo)}</Text>
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
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
  },
  statsText: {
    fontSize: 12,
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
    position: 'absolute',
    bottom: 10,
    right: 10,
  }
});