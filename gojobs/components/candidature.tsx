import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Candidature({ name, status, time, imageSource, statusText, statusColor, iconName }) {
    return (
        
        <View style={styles.candidateCard}>

            
            <Image source={imageSource} style={styles.candidateImage} />
            <View style={styles.candidateDetails}>
                <Text style={styles.candidateName}>{name}</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cvButton}>
                        <Text style={styles.buttonText}>Cv</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resumeButton}>
                        <Text style={styles.buttonText}>Resume</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.statusRow, { backgroundColor: statusColor, opacity:0.5 }]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                    <Ionicons name={iconName} size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <Text style={styles.timePosted}>{time}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    candidateCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    candidateImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.05,
        marginRight: 12,
    },
    candidateDetails: {
        flex: 1,
    },
    candidateName: {
        color: '#FFFFFF',
        fontSize: width * 0.04,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cvButton: {
        backgroundColor: '#B0B0B0',
        borderRadius: 18,
        paddingVertical: 6,
        paddingHorizontal: 20,
        flex: 1, // Prend toute la largeur disponible
        marginRight: 4,
    },
    resumeButton: {
        backgroundColor: '#B0B0B0',
        borderRadius: 18,
        paddingVertical: 6,
        paddingHorizontal: 20,
        flex: 1, // Prend toute la largeur disponible
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    statusText: {
        color: '#000000FF',
        fontSize: width * 0.035,
        fontWeight: 'bold',
        marginRight: 8,
    },
    timePosted: {
        color: 'white',
        fontSize: width * 0.03,
        marginLeft: 10,
        top: 35,
    },
});
