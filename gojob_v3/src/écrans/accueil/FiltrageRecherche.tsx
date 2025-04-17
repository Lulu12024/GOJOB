// src/écrans/accueil/FiltrageRecherche.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';
import Slider from '@react-native-community/slider';
import { TextStyle } from 'react-native';
import { AppDispatch, RootState } from '../../redux/store';
// Importer les actions du slice de filtres
// import { setFiltres } from '../../redux/slices/filtresSlice';

type FiltrageRechercheProps = {
  navigation: StackNavigationProp<any>;
  route: RouteProp<{ params: { fromScreen: string } }, 'params'>;
};


const FiltrageRecherche: React.FC<FiltrageRechercheProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { fromScreen } = route.params || { fromScreen: 'Recherche' };
  
  // État du filtre
  const [distance, setDistance] = useState(25);
  const [salaireMin, setSalaireMin] = useState('');
  const [salaireMax, setSalaireMax] = useState('');
  const [typeSalaire, setTypeSalaire] = useState<'mensuel' | 'horaire'>('mensuel');
  const [typeContrat, setTypeContrat] = useState<string[]>([]);
  
  // Options de logement
  const [avecLogement, setAvecLogement] = useState(false);
  const [logementAccepteEnfants, setLogementAccepteEnfants] = useState(false);
  const [logementAccepteAnimaux, setLogementAccepteAnimaux] = useState(false);
  const [logementAccessible, setLogementAccessible] = useState(false);
  
  // Autres options
  const [avecVehicule, setAvecVehicule] = useState(false);
  const [debutantAccepte, setDebutantAccepte] = useState(false);
  const [visaAccepte, setVisaAccepte] = useState(false);
  const [etudiantAccepte, setEtudiantAccepte] = useState(false);
  
  const toggleTypeContrat = (value: string) => {
    if (typeContrat.includes(value)) {
      setTypeContrat(typeContrat.filter(type => type !== value));
    } else {
      setTypeContrat([...typeContrat, value]);
    }
  };
  
  const appliquerFiltres = () => {
    // Créer l'objet de filtres
    const filtres = {
      distance,
      salaireMin: salaireMin ? parseFloat(salaireMin) : undefined,
      salaireMax: salaireMax ? parseFloat(salaireMax) : undefined,
      typeSalaire,
      typeContrat,
      options: {
        avecLogement,
        logementAccepteEnfants,
        logementAccepteAnimaux,
        logementAccessible,
        avecVehicule,
        debutantAccepte,
        visaAccepte,
        etudiantAccepte,
      }
    };
    
    // Dispatchez l'action pour mettre à jour les filtres
    // dispatch(setFiltres(filtres));
    
    // Retourner à l'écran précédent avec les filtres
    navigation.navigate(fromScreen, { filtres });
  };
  
  const reinitialiserFiltres = () => {
    setDistance(25);
    setSalaireMin('');
    setSalaireMax('');
    setTypeSalaire('mensuel');
    setTypeContrat([]);
    setAvecLogement(false);
    setLogementAccepteEnfants(false);
    setLogementAccepteAnimaux(false);
    setLogementAccessible(false);
    setAvecVehicule(false);
    setDebutantAccepte(false);
    setVisaAccepte(false);
    setEtudiantAccepte(false);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.sectionTitle, { 
        color: theme.couleurs.TEXTE_PRIMAIRE,
        fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
      }]}>
        Distance
      </Text>
      
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={distance}
          onValueChange={setDistance}
          minimumTrackTintColor={theme.couleurs.PRIMAIRE}
          maximumTrackTintColor={theme.couleurs.TEXTE_TERTIAIRE}
          thumbTintColor={theme.couleurs.PRIMAIRE}
        />
        <Text style={[styles.sliderValue, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          {distance} km
        </Text>
      </View>
      
      <Text style={[styles.sectionTitle, { 
        color: theme.couleurs.TEXTE_PRIMAIRE,
        fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
      }]}>
        Salaire
      </Text>
      
      <View style={styles.salaryContainer}>
        <View style={styles.salaryTypeButtons}>
          <Bouton
            titre="Mensuel"
            onPress={() => setTypeSalaire('mensuel')}
            variante={typeSalaire === 'mensuel' ? 'primaire' : 'outline'}
            taille="petit"
            style={styles.salaryTypeButton}
          />
          <Bouton
            titre="Horaire"
            onPress={() => setTypeSalaire('horaire')}
            variante={typeSalaire === 'horaire' ? 'primaire' : 'outline'}
            taille="petit"
            style={styles.salaryTypeButton}
          />
        </View>
        
        <View style={styles.salaryInputs}>
          <ChampTexte
            placeholder="Min"
            value={salaireMin}
            onChangeText={setSalaireMin}
            keyboardType="numeric"
            iconGauche="currency-eur"
            style={styles.salaryInput}
          />
          <Text style={[styles.toText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>à</Text>
          <ChampTexte
            placeholder="Max"
            value={salaireMax}
            onChangeText={setSalaireMax}
            keyboardType="numeric"
            iconGauche="currency-eur"
            style={styles.salaryInput}
          />
        </View>
      </View>
      
      <Text style={[styles.sectionTitle, { 
        color: theme.couleurs.TEXTE_PRIMAIRE,
        fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
      }]}>
        Type de contrat
      </Text>
      
      <View style={styles.contractTypes}>
        <Bouton
          titre="CDI"
          onPress={() => toggleTypeContrat('CDI')}
          variante={typeContrat.includes('CDI') ? 'primaire' : 'outline'}
          taille="petit"
          style={styles.contractButton}
        />
        <Bouton
          titre="CDD"
          onPress={() => toggleTypeContrat('CDD')}
          variante={typeContrat.includes('CDD') ? 'primaire' : 'outline'}
          taille="petit"
          style={styles.contractButton}
        />
        <Bouton
          titre="Intérim"
          onPress={() => toggleTypeContrat('Intérim')}
          variante={typeContrat.includes('Intérim') ? 'primaire' : 'outline'}
          taille="petit"
          style={styles.contractButton}
        />
        <Bouton
          titre="Saisonnier"
          onPress={() => toggleTypeContrat('Saisonnier')}
          variante={typeContrat.includes('Saisonnier') ? 'primaire' : 'outline'}
          taille="petit"
          style={styles.contractButton}
        />
      </View>
      
      <Text style={[styles.sectionTitle, { 
        color: theme.couleurs.TEXTE_PRIMAIRE,
        fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
      }]}>
        Options de logement
      </Text>
      
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          Avec logement de fonction
        </Text>
        <Switch
          value={avecLogement}
          onValueChange={setAvecLogement}
          trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
          thumbColor={'#fff'}
        />
      </View>
      
      {avecLogement && (
        <>
          <View style={styles.optionItem}>
            <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Logement acceptant les enfants
            </Text>
            <Switch
              value={logementAccepteEnfants}
              onValueChange={setLogementAccepteEnfants}
              trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
              thumbColor={'#fff'}
            />
          </View>
          
          <View style={styles.optionItem}>
            <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Logement acceptant les animaux
            </Text>
            <Switch
              value={logementAccepteAnimaux}
              onValueChange={setLogementAccepteAnimaux}
              trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
              thumbColor={'#fff'}
            />
          </View>
          
          <View style={styles.optionItem}>
            <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Logement accessible PMR
            </Text>
            <Switch
              value={logementAccessible}
              onValueChange={setLogementAccessible}
              trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
              thumbColor={'#fff'}
            />
          </View>
        </>
      )}
      
      <Text style={[styles.sectionTitle, { 
        color: theme.couleurs.TEXTE_PRIMAIRE,
        fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
      }]}>
        Autres options
      </Text>
      
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          Avec véhicule de fonction
        </Text>
        <Switch
          value={avecVehicule}
          onValueChange={setAvecVehicule}
          trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
          thumbColor={'#fff'}
        />
      </View>
      
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          Débutant accepté
        </Text>
        <Switch
          value={debutantAccepte}
          onValueChange={setDebutantAccepte}
          trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
          thumbColor={'#fff'}
        />
      </View>
      
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          Visa de travail accepté
        </Text>
        <Switch
          value={visaAccepte}
          onValueChange={setVisaAccepte}
          trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
          thumbColor={'#fff'}
        />
      </View>
      
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          Étudiant accepté
        </Text>
        <Switch
          value={etudiantAccepte}
          onValueChange={setEtudiantAccepte}
          trackColor={{ false: theme.couleurs.TEXTE_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
          thumbColor={'#fff'}
        />
      </View>
      
      <View style={styles.buttonsContainer}>
        <Bouton
          titre="Réinitialiser"
          onPress={reinitialiserFiltres}
          variante="secondaire"
          taille="moyen"
          style={styles.resetButton}
        />
        
        <Bouton
          titre="Appliquer"
          onPress={appliquerFiltres}
          variante="primaire"
          taille="moyen"
          style={styles.applyButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 60,
    textAlign: 'right',
    fontSize: 16,
  },
  salaryContainer: {
    marginBottom: 16,
  },
  salaryTypeButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  salaryTypeButton: {
    marginRight: 8,
  },
  salaryInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryInput: {
    flex: 1,
  },
  toText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  contractTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  contractButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionLabel: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 24,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default FiltrageRecherche;