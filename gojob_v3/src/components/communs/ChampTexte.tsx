
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

interface PropsChampTexte extends TextInputProps {
  label?: string;
  iconGauche?: string;
  iconDroite?: string;
  onPressIconDroite?: () => void;
  erreur?: string;
  conteneurStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  erreurStyle?: TextStyle;
  estMotDePasse?: boolean;
  helpText?: string;
}

const ChampTexte: React.FC<PropsChampTexte> = ({
  label,
  iconGauche,
  iconDroite,
  onPressIconDroite,
  erreur,
  conteneurStyle,
  labelStyle,
  inputStyle,
  erreurStyle,
  estMotDePasse = false,
  helpText,
  ...props
}) => {
  const theme = useTheme();
  const [estFocus, setEstFocus] = useState<boolean>(false);
  const [afficherMotDePasse, setAfficherMotDePasse] = useState<boolean>(!estMotDePasse);
  
  return (
    <View style={[styles.conteneur, conteneurStyle]}>
      {/* Label du champ */}
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.couleurs.TEXTE_SECONDAIRE,
              fontSize: theme.typographie.TAILLES.PETIT,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      
      {/* Conteneur du champ de saisie */}
      <View
        style={[
          styles.champConteneur,
          {
            backgroundColor: theme.couleurs.FOND_TERTIAIRE,
            borderColor: estFocus ? theme.couleurs.PRIMAIRE : theme.couleurs.BORDURE,
            borderRadius: theme.bordures.RADIUS_MOYEN,
          },
          inputStyle,
          erreur ? { borderColor: theme.couleurs.ERREUR } : {},
        ]}
      >
        {/* Icône à gauche */}
        {iconGauche && (
          <Icon
            name={iconGauche}
            size={20}
            color={estFocus ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_SECONDAIRE}
            style={styles.iconGauche}
          />
        )}
        
        {/* Champ de saisie */}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontSize: theme.typographie.TAILLES.MOYEN,
            },
          ]}
          placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
          secureTextEntry={estMotDePasse && !afficherMotDePasse}
          onFocus={() => setEstFocus(true)}
          onBlur={() => setEstFocus(false)}
          {...props}
        />
        
        {/* Icône à droite ou bouton voir/cacher mot de passe */}
        {estMotDePasse ? (
          <TouchableOpacity
            onPress={() => setAfficherMotDePasse(!afficherMotDePasse)}
            style={styles.iconDroite}
            activeOpacity={0.7}
          >
            <Icon
              name={afficherMotDePasse ? 'eye-off' : 'eye'}
              size={20}
              color={theme.couleurs.TEXTE_SECONDAIRE}
            />
          </TouchableOpacity>
        ) : iconDroite ? (
          <TouchableOpacity
            onPress={onPressIconDroite}
            style={styles.iconDroite}
            activeOpacity={0.7}
          >
            <Icon
              name={iconDroite}
              size={20}
              color={theme.couleurs.TEXTE_SECONDAIRE}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Message d'erreur */}
      {erreur && (
        <Text
          style={[
            styles.erreur,
            {
              color: theme.couleurs.ERREUR,
              fontSize: theme.typographie.TAILLES.TRES_PETIT,
            },
            erreurStyle,
          ]}
        >
          {erreur}
        </Text>
      )}
      
      {/* Texte d'aide */}
      {helpText && !erreur && (
        <Text
          style={[
            styles.helpText,
            {
              color: theme.couleurs.TEXTE_TERTIAIRE,
              fontSize: theme.typographie.TAILLES.TRES_PETIT,
            },
          ]}
        >
          {helpText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  champConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
  },
  iconGauche: {
    marginRight: 8,
  },
  iconDroite: {
    marginLeft: 8,
  },
  erreur: {
    marginTop: 4,
  },
  helpText: {
    marginTop: 4,
  },
});

export default ChampTexte;