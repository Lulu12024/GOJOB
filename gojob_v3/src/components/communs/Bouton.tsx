import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  DimensionValue, // Ajout de l'import pour DimensionValue
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type VarianteBouton = 'primaire' | 'secondaire' | 'succes' | 'danger' | 'texte' | 'outline';
export type TailleBouton = 'petit' | 'moyen' | 'grand';

interface PropsBouton extends TouchableOpacityProps {
  titre: string;
  onPress: () => void;
  variante?: VarianteBouton;
  taille?: TailleBouton;
  charge?: boolean;
  icone?: React.ReactNode;
  iconePosition?: 'gauche' | 'droite';
  largeur?: DimensionValue; // Utilisation du type correct
  hauteur?: DimensionValue; // Utilisation du type correct
  style?: ViewStyle;
  styleTexte?: TextStyle;
  desactive?: boolean;
  arrondi?: boolean;
}

const Bouton: React.FC<PropsBouton> = ({
  titre,
  onPress,
  variante = 'primaire',
  taille = 'moyen',
  charge = false,
  icone,
  iconePosition = 'gauche',
  largeur,
  hauteur,
  style,
  styleTexte,
  desactive = false,
  arrondi = false,
  ...props
}) => {
  const theme = useTheme();
  
  // Construction du style du bouton en fonction des props
  const construireStyleBouton = (): ViewStyle => {
    let styleBouton: ViewStyle = {};
    
    // Variante du bouton
    switch (variante) {
      case 'primaire':
        styleBouton = {
          backgroundColor: theme.couleurs.PRIMAIRE,
        };
        break;
      case 'secondaire':
        styleBouton = {
          backgroundColor: theme.couleurs.SECONDAIRE,
        };
        break;
      case 'succes':
        styleBouton = {
          backgroundColor: theme.couleurs.SUCCES,
        };
        break;
      case 'danger':
        styleBouton = {
          backgroundColor: theme.couleurs.ERREUR,
        };
        break;
      case 'texte':
        styleBouton = {
          backgroundColor: 'transparent',
        };
        break;
      case 'outline':
        styleBouton = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.couleurs.PRIMAIRE,
        };
        break;
    }
    
    // Taille du bouton
    switch (taille) {
      case 'petit':
        styleBouton = {
          ...styleBouton,
          paddingVertical: theme.espacement.PETIT,
          paddingHorizontal: theme.espacement.MOYEN,
        };
        break;
      case 'moyen':
        styleBouton = {
          ...styleBouton,
          paddingVertical: theme.espacement.MOYEN,
          paddingHorizontal: theme.espacement.GRAND,
        };
        break;
      case 'grand':
        styleBouton = {
          ...styleBouton,
          paddingVertical: theme.espacement.GRAND,
          paddingHorizontal: theme.espacement.TRES_GRAND,
        };
        break;
    }
    
    // État désactivé
    if (desactive) {
      styleBouton = {
        ...styleBouton,
        opacity: 0.5,
      };
    }
    
    // Dimensions personnalisées
    if (largeur !== undefined) {
      styleBouton.width = largeur;
    }
    
    if (hauteur !== undefined) {
      styleBouton.height = hauteur;
    }
    
    // Arrondi complet ou standard
    if (arrondi) {
      styleBouton.borderRadius = theme.bordures.RADIUS_COMPLET;
    } else {
      styleBouton.borderRadius = theme.bordures.RADIUS_MOYEN;
    }
    
    return styleBouton;
  };
  
  // Construction du style du texte en fonction des props
  const construireStyleTexte = (): TextStyle => {
    let styleTexte: TextStyle = {
      color: theme.couleurs.TEXTE_PRIMAIRE,
      fontWeight: 'bold',
    };
    
    // Couleur du texte selon la variante
    if (variante === 'texte' || variante === 'outline') {
      styleTexte.color = theme.couleurs.PRIMAIRE;
    }
    
    // Taille du texte selon la taille du bouton
    switch (taille) {
      case 'petit':
        styleTexte.fontSize = theme.typographie.TAILLES.PETIT;
        break;
      case 'moyen':
        styleTexte.fontSize = theme.typographie.TAILLES.MOYEN;
        break;
      case 'grand':
        styleTexte.fontSize = theme.typographie.TAILLES.GRAND;
        break;
    }
    
    return styleTexte;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={desactive || charge}
      style={[styles.bouton, construireStyleBouton(), style]}
      activeOpacity={0.7}
      {...props}
    >
      {charge ? (
        <ActivityIndicator
          size="small"
          color={variante === 'texte' || variante === 'outline' ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_PRIMAIRE}
        />
      ) : (
        <React.Fragment>
          {icone && iconePosition === 'gauche' && <React.Fragment>{icone}</React.Fragment>}
          <Text style={[construireStyleTexte(), styles.texte, styleTexte]}>{titre}</Text>
          {icone && iconePosition === 'droite' && <React.Fragment>{icone}</React.Fragment>}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bouton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Les styles spécifiques sont appliqués via les fonctions
  },
  texte: {
    textAlign: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
});

export default Bouton;