import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '../../hooks/useTheme';
import { Emploi } from '../../api/jobsApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextStyle /* autres imports */ } from 'react-native';

interface PropsCarteEmploi {
  emploi: Emploi;
  style?: ViewStyle;
  onFavorite?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

const CarteEmploi: React.FC<PropsCarteEmploi> = ({
  emploi,
  style,
  onFavorite,
  isFavorite = false,
  compact = false,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  // Image par défaut si aucune photo n'est disponible
  const imagePlaceholder = require('../../assets/images/job-placeholder.png');
  
  // Formatage du salaire pour affichage
  const formatSalaire = (emploi: Emploi): string => {
    if (!emploi.salary) return 'Salaire non précisé';
    
    return `${emploi.salary.amount} € / ${emploi.salary.period === 'hour' ? 'h' : 'mois'}`;
  };
  
  // Ouvrir la page de détail de l'emploi
  const ouvrirDetail = () => {
    // @ts-ignore - La navigation est typée plus tard
    navigation.navigate('DetailEmploi', { id: emploi.id });
  };

  return (
    <TouchableOpacity
      style={[
        styles.conteneur,
        {
          backgroundColor: theme.couleurs.FOND_SECONDAIRE,
          borderRadius: theme.bordures.RADIUS_MOYEN,
          ...theme.ombres.LEGERE,
        },
        compact ? styles.conteneurCompact : {},
        style,
      ]}
      onPress={ouvrirDetail}
      activeOpacity={0.7}
    >
      {/* Badges pour urgent/nouveau */}
      <View style={styles.badgesConteneur}>
        {emploi.is_urgent && (
          <View style={[styles.badge, { backgroundColor: theme.couleurs.URGENT }]}>
            <Text style={styles.badgeTexte}>URGENT</Text>
          </View>
        )}
        {emploi.is_new && (
          <View style={[styles.badge, { backgroundColor: theme.couleurs.NOUVELLE }]}>
            <Text style={styles.badgeTexte}>NOUVEAU</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conteneurPrincipal}>
        {/* Image de l'emploi */}
        <Image
          source={emploi.photos && emploi.photos.length > 0 ? { uri: emploi.photos[0] } : imagePlaceholder}
          style={[
            styles.image,
            compact ? styles.imageCompact : {},
            { borderRadius: theme.bordures.RADIUS_PETIT }
          ]}
          resizeMode="cover"
        />
        
        <View style={styles.contenuTexte}>
          {/* Titre de l'emploi */}
          <Text
            style={[
              styles.titre,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.MOYEN,
                // fontWeight: theme.typographie.POIDS.GRAS,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {emploi.title}
          </Text>
          
          {/* Entreprise */}
          <Text
            style={[
              styles.entreprise,
              {
                color: theme.couleurs.TEXTE_SECONDAIRE,
                fontSize: theme.typographie.TAILLES.PETIT,
              },
            ]}
            numberOfLines={1}
          >
            {emploi.company}
          </Text>
          
          {/* Localisation */}
          <View style={styles.rangee}>
            <Icon name="map-marker" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
            <Text
              style={[
                styles.texteLigne,
                {
                  color: theme.couleurs.TEXTE_SECONDAIRE,
                  fontSize: theme.typographie.TAILLES.PETIT,
                },
              ]}
              numberOfLines={1}
            >
              {emploi.location}
            </Text>
          </View>
          
          {/* Salaire */}
          {!compact && (
            <View style={styles.rangee}>
              <Icon name="currency-eur" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text
                style={[
                  styles.texteLigne,
                  {
                    color: theme.couleurs.TEXTE_SECONDAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  },
                ]}
              >
                {formatSalaire(emploi)}
              </Text>
            </View>
          )}
          
          {/* Type de contrat */}
          {!compact && emploi.contract_type && (
            <View style={styles.rangee}>
              <Icon name="file-document-outline" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text
                style={[
                  styles.texteLigne,
                  {
                    color: theme.couleurs.TEXTE_SECONDAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  },
                ]}
              >
                {emploi.contract_type}
              </Text>
            </View>
          )}
          
          {/* Accommodation si disponible */}
          {!compact && emploi.accommodation && (
            <View style={styles.rangee}>
              <Icon name="home" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text
                style={[
                  styles.texteLigne,
                  {
                    color: theme.couleurs.TEXTE_SECONDAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  },
                ]}
              >
                Logement inclus
              </Text>
            </View>
          )}
        </View>
        
        {/* Bouton favori */}
        {onFavorite && (
          <TouchableOpacity
            style={styles.boutonFavori}
            onPress={onFavorite}
            activeOpacity={0.7}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? theme.couleurs.ERREUR : theme.couleurs.TEXTE_SECONDAIRE}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Date de publication */}
      <View style={styles.piedDePage}>
        <Text
          style={[
            styles.texteDate,
            {
              color: theme.couleurs.TEXTE_TERTIAIRE,
              fontSize: theme.typographie.TAILLES.TRES_PETIT,
            },
          ]}
        >
          {emploi.created_at ? `Publié il y a 3m` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  conteneurCompact: {
    height: 100,
  },
  badgesConteneur: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  badgeTexte: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  conteneurPrincipal: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  imageCompact: {
    width: 60,
    height: 60,
  },
  contenuTexte: {
    flex: 1,
    justifyContent: 'center',
  },
  titre: {
    marginBottom: 4,
  },
  entreprise: {
    marginBottom: 8,
  },
  rangee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  texteLigne: {
    marginLeft: 4,
  },
  boutonFavori: {
    alignSelf: 'center',
    marginLeft: 8,
  },
  piedDePage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  texteDate: {
    fontStyle: 'italic',
  },
});

export default CarteEmploi;