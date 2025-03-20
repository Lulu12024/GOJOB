import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Param() {
    const [isNight, setIsNight] = useState(true); // État par défaut sur "night"
    const [showBalance, setShowBalance] = useState(true); // État pour cacher ou afficher le solde
    const [selectedOption, setSelectedOption] = useState(null); // Option sélectionnée

    const router = useRouter();

    const toggleImage = () => {
        setIsNight(!isNight); // Change l'état
    };

    // Liste des options
    const options = [
        
        { id: '1', icon: require('@/assets/images/Browser.png'), label: 'Abonnement', route: '/abonnement' },
        { id: '2', icon: require('@/assets/images/account.png'), label: 'Mon profil', route: '/myProfil' },
        { id: '3', icon: require('@/assets/images/contra.png'), label: 'Contract', route: '/ContractsScreen' },
        { id: '4', icon: require('@/assets/images/Invoice.png'), label: 'Fiche de paye', route: '/fichepay' },
        { id: '5', icon: require('@/assets/images/Favorite.png'), label: 'Recherche favoris', route: '/RechercheFavoris' },
        { id: '6', icon: require('@/assets/images/Book.png'), label: 'Agenda', route: '/fav' },
        { id: '7', icon: require('@/assets/images/Phone.png'), label: 'Nous contacter', route: '/ContactUs' },
        { id: '8', icon: require('@/assets/images/Notification.png'), label: 'Notification', route: '/notifiPro' },
        { id: '9', icon: require('@/assets/images/Announcement.png'), label: 'Annonce', route: '/MyAdsPro' },
    ];

    const handleAddPayPal = () => {
        // Remplacez par la navigation ou la logique de votre choix
        alert('Ajouter un nouveau compte PayPal');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
                </TouchableOpacity>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>Profile</Text>
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
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#FFFFFF' }}>Solde total</Text>
                        <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={{ right: -8, marginTop: 5 }}>
                            <Ionicons
                                name={showBalance ? 'eye-off' : 'eye'}
                                size={14}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balance}>
                            {showBalance ? '100 24 $' : '*****'}
                        </Text>
                    </View>

                    {/* Payment Badge */}
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
                            source={require('@/assets/images/papal.png')}
                            style={styles.paypalIcon}
                        />
                    </View>
                    
                                   {/* Add PayPal Button */}
                <TouchableOpacity style={styles.addPayPalButton} onPress={handleAddPayPal}>
                    <Ionicons name="add-circle-outline" size={24} color="#3875E6" />
                </TouchableOpacity>
                </LinearGradient>

                

                {/* Options List */}
                <FlatList
                    data={options}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        style={[
                            styles.option,
                            selectedOption === item.id && { borderColor: '#FFFFFFFF' },
                        ]}
                        onPressIn={() => setSelectedOption(item.id)} // Début de l'appui long
                        onPressOut={() => setSelectedOption(null)} // Fin de l'appui long
                        onPress={() => router.push(item.route)} // Navigation au clic
                        >
                            <Image source={item.icon} style={styles.optionIcon} />
                            <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.optionsContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 30,
        height: 30,
    },
    profileCard: {
        width: width * 0.9,
        borderRadius: 12,
        padding: 30,
        position: 'relative',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    balance: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    addPayPalButton: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 15,
        width: 50,
        alignSelf: 'center',
        left: 125,

    },
    addPayPalButtonText: {
        marginLeft: 8,
        color: '#3875E6',
        fontWeight: 'bold',
        fontSize: 16,
    },
    paymentContainer: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    paymentBadge: {
        backgroundColor: '#D9D9D9',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 120,
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentBadges: {
        backgroundColor: '#616E7E',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 140,
        alignItems: 'center',
        marginBottom: 8,
    },
    paypalIconContainer: {
        position: 'absolute',
        right: 5,
    },
    paypalIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    verificationIcon: {
        position: 'absolute',
        bottom: 2,
        right: 15,
    },
    optionsContainer: {
        width: '100%',
        paddingVertical: 15,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
        borderColor: 'transparent',
    },
    optionIcon: {
        width: 75,
        height: 75,
        marginRight: 16,
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
