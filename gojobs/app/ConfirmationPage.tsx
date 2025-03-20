import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ConfirmationPage() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const handleConfirm = () => {
    router.push({
      pathname: '/ResultatApplyAI', // Remplacez par le chemin de votre page cible
      params: {
        category: params.category,
        filter: params.filter,
        excludedCompany: params.excludedCompany,
        salaryRange: params.salaryRange,
        notificationTime: params.notificationTime,
      },
    });
  };

  const handleModifier = () => {
    router.push({
      pathname: '/UpdateApplyAI', // Remplacez par le chemin de votre page cible
    });
  };

  return (
    <View style={styles.container}>

       
        <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => router.back()}/>
        </TouchableOpacity>
        <View style={{flex: 1,justifyContent:'center', alignItems:'center', }}><Text style={styles.titles}>ApplyAI</Text></View>
       
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>ApplyAI ✨</Text>
        <Text style={styles.info}>Catégorie : {params.category}</Text>
        <Text style={styles.info}>Filtre : {params.filter}</Text>
        <Text style={styles.info}>Société non désirée : {params.excludedCompany}</Text>
        <Text style={styles.info}>Salaire souhaité : {params.salaryRange}</Text>
        <Text style={styles.info}>Heure de la notification : {params.notificationTime}</Text>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Consulter et confirmer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modifyButton} onPress={handleModifier}>
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1D222B',
      padding: 16,
    },
    header: {
      flexDirection:'row',
      position: 'relative', // Permet un positionnement absolu des enfants
      alignItems: 'center', // Centre les éléments sur l'axe vertical
      marginBottom: 20,
    },
    backButton: {
      position: 'absolute',
      left: 0, // Positionne la flèche à gauche
      top: 0, // Aligné verticalement avec le titre
    },
    titles: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center', // Centre le texte au milieu horizontalement
    },
    card: {
      backgroundColor: '#3E5E7C',
      padding: 20,
      borderRadius: 10,
    },
    title: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    info: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 8,
    },
    buttons: {
      marginTop: 20,
    },
   confirmButton: {
    backgroundColor: '#457DF5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center', // Centre horizontalement
    width: '70%', // Ajustez la largeur
  },
  modifyButton: {
    backgroundColor: '#555',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center', // Même ajustement si nécessaire
    width: '70%',
  },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  