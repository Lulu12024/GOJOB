import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
// import { Bouton } from './communs/Bouton';

interface CarteCandidatureProps {
  nom: string;
  photo: string;
  dateCandidature: string;
  status?: 'new' | 'accepted' | 'rejected' | 'pending';
  onAccept?: () => void;
  onReject?: () => void;
  onViewCV?: () => void;
  onViewResume?: () => void;
}

export const CarteCandidature: React.FC<CarteCandidatureProps> = ({
  nom,
  photo,
  dateCandidature,
  status,
  onAccept,
  onReject,
  onViewCV,
  onViewResume
}) => {
    const theme = useTheme();

return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <Image source={{ uri: photo }} style={styles.photo} />
        <View style={styles.content}>
        <Text style={[styles.name, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{nom}</Text>
        
        <View style={styles.actions}>
            <TouchableOpacity onPress={onViewCV} style={styles.documentButton}>
            <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>CV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onViewResume} style={styles.documentButton}>
            <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Resume</Text>
            </TouchableOpacity>
        </View>
        
        {status === 'new' && (
            <View style={styles.statusButtons}>
            <TouchableOpacity 
                onPress={onAccept} 
                style={[styles.statusButton, { backgroundColor: theme.couleurs.SUCCES }]}>
                <Text style={styles.buttonText}>✓</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => {}} 
                style={[styles.statusButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}>
                <Text style={styles.buttonText}>⏱</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={onReject} 
                style={[styles.statusButton, { backgroundColor: theme.couleurs.ERREUR }]}>
                <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>
            </View>
        )}
        
        {status === 'accepted' && (
            <View style={[styles.statusIndicator, { backgroundColor: theme.couleurs.SUCCES }]}>
            <Text style={styles.statusText}>Accepter</Text>
            </View>
        )}
        
        {status === 'rejected' && (
            <View style={[styles.statusIndicator, { backgroundColor: theme.couleurs.ERREUR }]}>
            <Text style={styles.statusText}>Refuser</Text>
            </View>
        )}
        
        {status === 'pending' && (
            <View style={[styles.statusIndicator, { backgroundColor: theme.couleurs.PRIMAIRE }]}>
            <Text style={styles.statusText}>En attente</Text>
            </View>
        )}
        </View>
        <Text style={[styles.date, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>{dateCandidature}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  documentButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  statusIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginLeft: 'auto',
  }
});