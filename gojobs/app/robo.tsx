import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Données des abonnements
const subscriptionData = [
    {
        id: 1,
        name: 'ApplyAI',
        price: '24.75 $ / week',
        op: ' Postulation automatique à 4 offres d\'emploi par jour.\n- Assistance IA pour rédiger des messages, emails ou lettres de motivation, avec une limite de 5 demandes par jour .',
        status: false, // abonnement actif
    },
    {
        id: 2,
        name: 'ApplyAI Pro',
        price: '44.75 $ / week',
        color: '#3E5E7C',
        op: ' Postulation automatique à 4 offres d\'emploi par jour.\n- Assistance IA pour rédiger des messages, emails ou lettres de motivation, avec une limite de 5 demandes par jour .',
        status: false, // abonnement inactif
    },

];

export default function Robo() {
        const router = useRouter();
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ApplyAI</Text>
                <View style={styles.headerIcons}>
                    
                    <TouchableOpacity style={styles.icon}>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{
                backgroundColor: '#FFFFFF', borderRadius: 12,
                padding: 16,
                marginHorizontal: 16,
                marginVertical: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            }}>
                <Text style={{ color: '#000000FF', fontWeight: 'bold' }}>vous n’avez pas le temps de postuler ? Vous souhaitez changer de travail sans rater aucune opportunité ? Laisser notre IA postuler a votre place ! </Text>
            </View>

            {/* Liste des abonnements */}
            <ScrollView contentContainerStyle={styles.subscriptionList}>
                {subscriptionData.map((subscription) => (
                    <View key={subscription.id} style={{
                        backgroundColor: subscription.id === 2 ? '#3E5E7C' : '#E1E1E3B2',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        width: width * 0.9,
                        alignSelf: 'center',
                        height: 190
                    }}>
                        <Text style={{
                            color: subscription.id === 2 ? '#FFFFFFFF' : '#000000B2',
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            alignSelf: 'center',
                            
                        }}>{subscription.name}</Text>

                        <Text style={{
                            color: subscription.id === 2 ? '#FFFFFFFF' : '#000000B2',
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            alignSelf: 'center',
                        }}>{subscription.op}</Text>

                        {/* Ligne pour le prix et le bouton */}
                        <View style={styles.priceButtonContainer}>
                            <Text style={{
                                color: subscription.id === 2 ? '#FFFFFFFF' : '#000000B2',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}>{subscription.price}</Text>
                            <TouchableOpacity
                            onPress={() => router.push('/ApplyAIForm')}
                                style={[
                                    styles.button,
                                    subscription.status ? styles.buttonSuspend : styles.buttonSubscribe,
                                ]}
                            >
                                <Text style={{
                                    color: subscription.id === 2 ? '#FFFFFFFF' : '#000000B2',
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>
                                    S'abonner
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D222B',
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 16,
    },
    subscriptionList: {
        paddingBottom: 20,
    },
    subscriptionCard: {

    },
    planTitle: {


    },
    priceButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        top: 20
    },
    planPrice: {

    },
    button: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonSuspend: {
        backgroundColor: '#FF4D4D',
    },
    buttonSubscribe: {
        backgroundColor: '#78788080',
    },
    buttonText: {

    },

    buttonTexts: {
        color: '#FFFFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
