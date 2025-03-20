import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ParamCand() {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const router = useRouter();
    const [isNight, setIsNight] = useState(true); // État par défaut sur "night"

    const toggleImage = () => {
        setIsNight(!isNight); // Change l'état
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()}/>
                </TouchableOpacity>
                <Text style={{ color: '#FFFFFFFF', fontWeight: 'bold', fontSize: 18 }}>Profile</Text>
                <TouchableOpacity onPress={toggleImage}>
                {isNight ? (
                    <Image 
                        source={require('@/assets/images/Night.png')} 
                        style={styles.image} 
                    />
                ) : (
                    <Image 
                        source={require('@/assets/images/light.png')} 
                        style={styles.image} 
                    />
                )}
            </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Profile Card */}
                <LinearGradient colors={['#3875E6', '#3875E6']} style={styles.profileCard}>
                    <Text style={styles.profileName}>Mathieu Cordion</Text>
                    <Text style={styles.balance}>100 24 $</Text>

                    {/* Payment Badge and PayPal Icon */}
                    <View style={styles.paymentContainer}>
                        <View style={styles.paymentBadge}>
                            <Text style={styles.paymentTexts}>Détails des opérations</Text>
                        </View>
                        <View style={styles.paymentBadges}>
                            <Text style={styles.paymentText}>Effectuer un virement</Text>
                        </View>
                    </View>

                    <View style={styles.paypalIconContainer}>
                        <Image
                            source={require('@/assets/images/papal.png')} // Assurez-vous d'avoir le logo PayPal dans le dossier correct
                            style={styles.paypalIcon}
                        />
                    </View>
                    <Image source={require('@/assets/images/Shield.png')} style={styles.verificationIcon} />
                </LinearGradient>

                {/* Options List */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity onPress={() => router.push('/robo')} style={{ flexDirection: 'row' }}><Image source={require('@/assets/images/robo.png')} /><Text style={{ color: '#FFFFFFFF', textAlign: 'center', marginTop: '20', fontWeight: 'bold' }}>ApplyAI</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/myProfil')} style={{ flexDirection: 'row' }}><Image source={require('@/assets/images/account.png')} /><Text style={{ color: '#FFFFFFFF', textAlign: 'center', marginTop: '20', fontWeight: 'bold' }}>Mon profile</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/Contratcand')} style={{ flexDirection: 'row' }}><Image source={require('@/assets/images/contra.png')} /><Text style={{ color: '#FFFFFFFF', textAlign: 'center', marginTop: '20', fontWeight: 'bold' }}>Contract</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/fichepayCand')} style={{ flexDirection: 'row' }}><Image source={require('@/assets/images/Invoice.png')} /><Text style={{ color: '#FFFFFFFF', textAlign: 'center', marginTop: '20', fontWeight: 'bold' }}>Fiche de paye</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/RechercheFavorisCand')} style={{ flexDirection: 'row' }}><Image source={require('@/assets/images/Favorite.png')} /><Text style={{ color: '#FFFFFFFF', textAlign: 'center', marginTop: '20', fontWeight: 'bold' }}>Recherche favoris</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Composant Option pour chaque élément de la liste
const Option = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={30} color="#f1f1f1" style={styles.optionIcon} />
        <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
);

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
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between', // Spread content to fill the screen
        alignItems: 'center',
    },
    image: {
        width: 30,
        height: 30,
    },
    profileCard: {
        width: width * 0.9,
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        padding: 30,
        position: 'relative',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    balance: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    paymentContainer: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
        marginRight: 100
    },
    paymentBadge: {
        backgroundColor: '#D9D9D9',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 100,
        alignItems: 'center',
        marginBottom: 8,
    },

    paymentBadges: {
        backgroundColor: '#616E7E',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 100,
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 10
    },
    paymentText: {
        color: '#FFFFFF',
        fontSize: 14,
    },

    paymentTexts: {
        color: '#000000FF',
        fontSize: 14,
    },
    paypalIconContainer: {
        borderRadius: 20,
        padding: 6,
        position: 'absolute',
        right: 5
    },
    paypalIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',

    },
    verificationIcon: {
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    optionsContainer: {
        width: '100%',
        height: '68%',
        marginTop:20
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    optionIcon: {
        marginRight: 16,
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});