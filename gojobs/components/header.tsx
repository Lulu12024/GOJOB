import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Utilisation d'Expo Router

export default function Header() {
  const router = useRouter(); // Utilisation d'Expo Router
  return (
    <View style={styles.header}>
      {/* Affichage du logo */}
      <Image source={require('@/assets/images/logo.jpg')} style={styles.logo} />

      <View style={styles.icons}>
        <TouchableOpacity style={styles.icon} onPress={() => router.push('../../notification')}>
          {/* Icône de notification */}
          <Image source={require('@/assets/icons/not.png')} style={{width:22, height:27, top:4}}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => router.push('/param')}>
          {/* Avatar de l'utilisateur */}
          <Image
            source={require('@/assets/images/profil.jpg')} // Chemin vers l'image d'avatar
            style={styles.avatar}
          />
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100, // Adapter selon la taille souhaitée
    height: 40, // Adapter selon la taille souhaitée
    resizeMode: 'contain',
  },
  icons: {
    flexDirection: 'row',
    color:'#000000FF'

  },
  icon: {
    marginLeft: 16,
    color:'#000000FF'
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5, // Cercle parfait
    borderWidth: 2,
    borderColor: '#FFFFFF', // Optionnel : bordure blanche autour de l'avatar
  },
});
