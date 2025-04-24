import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { MainNavigatorParamList } from '../../types/navigation';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, title }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainNavigatorParamList>>();
  const theme = useTheme();
  
  return (
    <View style={[styles.header, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
        </TouchableOpacity>
      ) : (
        <View style={styles.logoContainer}>
          {/* <Text style={[styles.logoText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            GoJobs
          </Text> */}
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
            />
        </View>
      )}
      
      {title && (
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
          {title}
        </Text>
      )}
      
      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
        //   onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell-outline" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('MonProfil')}
        >
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
    padding: 4,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});

export default Header;