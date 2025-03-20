import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ContactUsScreen() {
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // État pour afficher le succès
  const [selectedReason, setSelectedReason] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const reasons = [
    'Dysfonctionnement',
    'Problème de paiement',
    'Suggestion pour améliorer Gojobs',
    'Autre',
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setReasonModalVisible(false);
  };

  const handleSend = () => {
    if (!selectedReason || !message) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    // Afficher la boîte modale de succès
    setSuccessModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nous contacter</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Sélecteur de raison */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setReasonModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>
            {selectedReason || 'Raison'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Modal pour la sélection de la raison */}
        <Modal
          visible={reasonModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setReasonModalVisible(false)}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Raison</Text>
              </View>
              <FlatList
                data={reasons}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.reasonItem}
                    onPress={() => handleReasonSelect(item)}
                  >
                    <Text style={styles.reasonText}>{item}</Text>
                    {selectedReason === item ? (
                      <Ionicons name="radio-button-on" size={24} color="#3875E6" />
                    ) : (
                      <Ionicons
                        name="radio-button-off"
                        size={24}
                        color="#A0A0A0"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Zone de texte pour le message */}
        <TextInput
          style={styles.textInput}
          placeholder="Zone de message"
          placeholderTextColor="#888"
          multiline={true}
          value={message}
          onChangeText={(text) => setMessage(text)}
          textAlignVertical="top"
        />

        {/* Bouton envoyer */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de succès */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <View style={{backgroundColor: '#3875E6',height: 62, width:62,justifyContent: 'center',alignItems: 'center',borderRadius: 50,}}>
                <Image source={require('@/assets/images/Gp.png')} />
            </View>
                        
            
            <Text style={styles.successText}>
              Votre message a été envoyé avec succès
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B', // Couleur de fond sombre
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#1E1E1E', // Fond gris foncé
    borderRadius: 12,
    padding: 20,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
    color: 'white',
    fontSize: 16,
    padding: 10,
    height: 120,
    textAlignVertical: 'top', // Texte en haut
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#3875E6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  reasonText: {
    color: 'white',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  successContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3875E6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
