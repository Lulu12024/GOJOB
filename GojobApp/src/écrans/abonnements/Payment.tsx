import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import  { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import Bouton  from '../../components/communs/Bouton';
import { processPayment } from '../../redux/slices/paymentSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch } from '../../redux/store'; // Importez AppDispatch

type PaymentProps = {
  route: RouteProp<{ params: { packageId: string } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

export const Payment: React.FC<PaymentProps> = ({ route, navigation }) => {
    const theme = useTheme(); // Utilisez la structure correcte de votre thème
    const dispatch = useDispatch<AppDispatch>(); // Utilisez AppDispatch pour corriger l'erreur Redux
    const { loading } = useSelector((state: any) => state.payment);
    const { packageId } = route.params;
    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [cardDetails, setCardDetails] = useState({
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    });
    
    const handleCardNumberChange = (text: string) => {
      // Format card number with spaces (4 digits per group)
      const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({ ...cardDetails, number: formatted });
    };
    
    const handleExpiryChange = (text: string) => {
      // Format expiry date as MM/YY
      const cleaned = text.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      
      setCardDetails({ ...cardDetails, expiry: formatted });
    };
    
    const handlePayment = () => {
      if (paymentMethod === 'card') {
        // Simple validation
        if (cardDetails.number.length < 16) {
          Alert.alert('Erreur', 'Numéro de carte invalide');
          return;
        }
        
        if (cardDetails.name.length < 3) {
          Alert.alert('Erreur', 'Nom sur la carte invalide');
          return;
        }
        
        if (!cardDetails.expiry.includes('/') || cardDetails.expiry.length !== 5) {
          Alert.alert('Erreur', 'Date d\'expiration invalide');
          return;
        }
        
        if (cardDetails.cvc.length < 3) {
          Alert.alert('Erreur', 'CVC invalide');
          return;
        }
      }
      
      // Process payment
      dispatch(processPayment({
        packageId,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardDetails : {}
      }));
      
      // In a real app, you would check the response before navigating
      Alert.alert(
        'Paiement réussi', 
        'Votre abonnement a été activé avec succès!',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('MonProfil')
        }]
      );
    };
  
  const packageDetails = {
    'basique_pro': { title: 'Basique Pro', price: '24.75', period: 'semaine' },
    'standard_pro': { title: 'Standard Pro', price: '44.75', period: 'semaine' },
    'premium_pro': { title: 'Premium Pro', price: '74.75', period: 'semaine' },
    'apply_ai': { title: 'ApplyAI', price: '29.99', period: 'mois' },
    'apply_ai_pro': { title: 'ApplyAI Pro', price: '49.99', period: 'mois' }
  };
  
  const details = packageDetails[packageId as keyof typeof packageDetails];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Paiement</Text>
      
      <View style={[styles.summaryCard, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <Text style={[styles.summaryTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Récapitulatif</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Abonnement</Text>
          <Text style={[styles.summaryValue, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{details.title}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Prix</Text>
          <Text style={[styles.summaryValue, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{details.price} € / {details.period}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.couleurs.PRIMAIRE }]}>{details.price} €</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Méthode de paiement</Text>
        
        <TouchableOpacity 
          style={[
            styles.paymentMethodButton, 
            paymentMethod === 'card' && { 
              borderColor: theme.couleurs.PRIMAIRE, 
              backgroundColor: `${theme.couleurs.PRIMAIRE}10` 
            }
          ]}
          onPress={() => setPaymentMethod('card')}
        >
          <Icon name="card" size={24} color={paymentMethod === 'card' ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_TERTIAIRE} />
          <Text 
            style={[
              styles.paymentMethodText, 
              { color: paymentMethod === 'card' ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Carte bancaire
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.paymentMethodButton, 
            paymentMethod === 'paypal' && { 
              borderColor: theme.couleurs.PRIMAIRE, 
              backgroundColor: `${theme.couleurs.PRIMAIRE}10` 
            }
          ]}
          onPress={() => setPaymentMethod('paypal')}
        >
          <Icon name="logo-paypal" size={24} color={paymentMethod === 'paypal' ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_TERTIAIRE} />
          <Text 
            style={[
              styles.paymentMethodText, 
              { color: paymentMethod === 'paypal' ? theme.couleurs.PRIMAIRE : theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            PayPal
          </Text>
        </TouchableOpacity>
      </View>
      
      {paymentMethod === 'card' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Détails de la carte</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Numéro de carte</Text>
            <TextInput
              value={cardDetails.number}
              onChangeText={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
              style={[
                styles.input,
                { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
              ]}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Nom sur la carte</Text>
            <TextInput
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
              placeholder="JEAN DUPONT"
              style={[
                styles.input,
                { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
              ]}
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Date d'expiration</Text>
              <TextInput
                value={cardDetails.expiry}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5} // MM/YY
                style={[
                  styles.input,
                  { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
                ]}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>CVC</Text>
              <TextInput
                value={cardDetails.cvc}
                onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                style={[
                  styles.input,
                  { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
                ]}
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>
          </View>
        </View>
      )}
      
      {paymentMethod === 'paypal' && (
        <View style={styles.section}>
          <Text style={[
            styles.paypalInfo,
            { color: theme.couleurs.TEXTE_SECONDAIRE, backgroundColor: theme.couleurs.FOND_TERTIAIRE }
          ]}>
            Vous allez être redirigé vers PayPal pour compléter votre paiement.
          </Text>
        </View>
      )}
      
      <Bouton 
        titre={`Payer ${details.price} €`} 
        onPress={handlePayment} 
        style={styles.payButton}
        charge={loading} // Utilisez "charge" au lieu de "loading"
      />
      
      <View style={styles.securityInfo}>
        <Icon name="lock-closed" size={16} color={theme.couleurs.TEXTE_TERTIAIRE} />
        <Text style={[styles.securityText, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>
          Paiement sécurisé avec cryptage SSL. Nous ne stockons pas vos informations de carte.
        </Text>
      </View>
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
  summaryCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentMethodText: {
    fontSize: 16,
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  paypalInfo: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    color: '#333',
    textAlign: 'center',
  },
  payButton: {
    marginBottom: 20,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    textAlign: 'center',
  }
});