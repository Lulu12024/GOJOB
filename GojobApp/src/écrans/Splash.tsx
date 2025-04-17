// src/écrans/Splash.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TextStyle } from 'react-native';

const Splash: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text 
          style={[
            styles.appName, 
            { 
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
            }
          ]}
        >
          GoJobs
        </Text>
      </View>
      
      <ActivityIndicator 
        size="large" 
        color={theme.couleurs.PRIMAIRE} 
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    marginBottom: 24,
  },
  loader: {
    marginTop: 30,
  }
});

export default Splash;