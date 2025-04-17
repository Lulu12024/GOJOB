import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import  { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { subscribeToPackage } from '../../redux/slices/subscriptionSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch } from '../../redux/store'; // Ajoutez cette importation

type AbonnementsProps = {
  route: RouteProp<{ params: { highlight?: string } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

export const Abonnements: React.FC<AbonnementsProps> = ({ route, navigation }) => {
  const theme = useTheme(); // Utilisez la structure correcte de votre thème
  const dispatch = useDispatch<AppDispatch>(); // Typez correctement le dispatch
  const { subscriptions, loading } = useSelector((state: any) => state.subscription);
  const { user } = useSelector((state: any) => state.auth);
  
  const highlightPackage = route.params?.highlight;
  
  const handleSubscribe = (packageId: string) => {
    if (loading) return;
    
    Alert.alert(
      'Confirmer l\'abonnement', 
      'Voulez-vous souscrire à cet abonnement?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            dispatch(subscribeToPackage(packageId));
            navigation.navigate('Payment', { packageId });
          }
        }
      ]
    );
  };
  
  const packages = [
    {
      id: 'basique_pro',
      title: 'Basique Pro',
      price: '24.75',
      period: 'semaine',
      features: [
        'Publication d\'offres d\'emploi',
        'Accès aux candidatures',
        'Messagerie illimitée',
        'Tableaux de bord basiques'
      ],
      isHighlighted: highlightPackage === 'basic'
    },
    {
      id: 'standard_pro',
      title: 'Standard Pro',
      price: '44.75',
      period: 'semaine',
      features: [
        'Tout ce qui est inclus dans Basique Pro',
        'Publication d\'annonces urgentes',
        'Statistiques avancées',
        'Contrats personnalisés',
        'Support prioritaire'
      ],
      isHighlighted: highlightPackage === 'standard'
    },
    {
      id: 'premium_pro',
      title: 'Premium Pro',
      price: '74.75',
      period: 'semaine',
      features: [
        'Tout ce qui est inclus dans Standard Pro',
        'Visibilité maximale des annonces',
        'Analyses de performance détaillées',
        'Accès aux candidats recommandés',
        'Support dédié 24/7'
      ],
      isHighlighted: highlightPackage === 'premium'
    },
    {
      id: 'apply_ai',
      title: 'ApplyAI',
      price: '29.99',
      period: 'mois',
      features: [
        'Candidature automatique',
        'CV et lettre de motivation optimisés par IA',
        'Recommandations d\'emplois personnalisées',
        'Notifications quotidiennes'
      ],
      isHighlighted: highlightPackage === 'applyai'
    },
    {
      id: 'apply_ai_pro',
      title: 'ApplyAI Pro',
      price: '49.99',
      period: 'mois',
      features: [
        'Tout ce qui est inclus dans ApplyAI',
        'Suivi avancé des candidatures',
        'Optimisation multi-critères',
        'Nombre illimité de candidatures automatiques',
        'Intelligence contextuelle approfondie'
      ],
      isHighlighted: highlightPackage === 'applyai_pro'
    }
  ];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Abonnements</Text>
      
      {packages.map(pkg => (
        <View 
          key={pkg.id} 
          style={[
            styles.packageCard, 
            { backgroundColor: theme.couleurs.FOND_SECONDAIRE },
            pkg.isHighlighted && { borderColor: theme.couleurs.PRIMAIRE, borderWidth: 2 }
          ]}
        >
          {pkg.isHighlighted && (
            <View style={[styles.highlightBadge, { backgroundColor: theme.couleurs.PRIMAIRE }]}>
              <Text style={styles.highlightText}>Recommandé</Text>
            </View>
          )}
          
          <Text style={[styles.packageTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{pkg.title}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.couleurs.PRIMAIRE }]}>{pkg.price} €</Text>
            <Text style={[styles.period, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>/ {pkg.period}</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            {pkg.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={[styles.featureText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{feature}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              { backgroundColor: user.hasSubscription(pkg.id) ? '#e0e0e0' : theme.couleurs.PRIMAIRE }
            ]}
            onPress={() => handleSubscribe(pkg.id)}
            disabled={user.hasSubscription(pkg.id)}
          >
            <Text 
              style={[
                styles.subscribeText, 
                { color: user.hasSubscription(pkg.id) ? '#666' : 'white' }
              ]}
            >
              {user.hasSubscription(pkg.id) ? 'Abonné' : 'S\'abonner'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  packageCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  highlightBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 15,
  },
  highlightText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 5,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
  subscribeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '500',
  }
});