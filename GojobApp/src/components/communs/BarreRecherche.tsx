import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../hooks/useTheme';

interface PropsBarreRecherche {
  placeholder?: string;
  valeur: string;
  onChange: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  iconDroite?: string;
  onPressIconDroite?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  filtreVisible?: boolean;
  onPressFiltres?: () => void;
  compact?: boolean;
}

const BarreRecherche: React.FC<PropsBarreRecherche> = ({
  placeholder = 'Rechercher...',
  valeur,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  iconDroite,
  onPressIconDroite,
  autoFocus = false,
  style,
  inputStyle,
  filtreVisible = true,
  onPressFiltres,
  compact = false,
}) => {
  const theme = useTheme();
  const [estFocus, setEstFocus] = useState<boolean>(false);
  
  // Gérer le focus de l'input
  const handleFocus = () => {
    setEstFocus(true);
    if (onFocus) onFocus();
  };
  
  // Gérer la perte de focus de l'input
  const handleBlur = () => {
    setEstFocus(false);
    if (onBlur) onBlur();
  };
  
  // Gérer la soumission de l'input
  const handleSubmit = () => {
    if (onSubmit) onSubmit();
  };
  
  // Gérer le clic sur l'icône d'effacement
  const handleClear = () => {
    onChange('');
  };

  return (
    <View
      style={[
        styles.conteneur,
        {
          backgroundColor: theme.couleurs.FOND_SECONDAIRE,
          borderRadius: theme.bordures.RADIUS_MOYEN,
          ...theme.ombres.LEGERE,
        },
        style,
      ]}
    >
      <View style={styles.inputConteneur}>
        {/* Icône de recherche */}
        <Icon
          name="magnify"
          size={compact ? 18 : 22}
          color={estFocus ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_SECONDAIRE}
          style={styles.iconRecherche}
        />
        
        {/* Champ de recherche */}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontSize: compact ? theme.typographie.TAILLES.PETIT : theme.typographie.TAILLES.MOYEN,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
          value={valeur}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {/* Bouton d'effacement ou icône personnalisée à droite */}
        {valeur.length > 0 ? (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.boutonEffacer}
            activeOpacity={0.7}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon
              name="close-circle"
              size={compact ? 16 : 20}
              color={theme.couleurs.TEXTE_SECONDAIRE}
            />
          </TouchableOpacity>
        ) : iconDroite ? (
          <TouchableOpacity
            onPress={onPressIconDroite}
            style={styles.boutonEffacer}
            activeOpacity={0.7}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon
              name={iconDroite}
              size={compact ? 16 : 20}
              color={theme.couleurs.TEXTE_SECONDAIRE}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Séparateur vertical si le bouton filtre est visible */}
      {filtreVisible && (
        <View
          style={[
            styles.separateur,
            { backgroundColor: theme.couleurs.DIVIDER },
          ]}
        />
      )}
      
      {/* Bouton de filtres */}
      {filtreVisible && (
        <TouchableOpacity
          style={styles.boutonFiltres}
          onPress={onPressFiltres}
          activeOpacity={0.7}
        >
          <Icon
            name="filter-variant"
            size={compact ? 18 : 22}
            color={theme.couleurs.TEXTE_SECONDAIRE}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    marginVertical: 8,
  },
  inputConteneur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRecherche: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 0,
  },
  boutonEffacer: {
    marginLeft: 8,
  },
  separateur: {
    width: 1,
    height: '60%',
    marginHorizontal: 8,
  },
  boutonFiltres: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
});

export default BarreRecherche;