import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactOptions({ gojobsMessaging, setGojobsMessaging, call, setCall, phoneNumbers, setPhoneNumbers }) {
    const toggleOption = (option) => {
        if (option === 'gojobs') {
            setGojobsMessaging(!gojobsMessaging);
        } else if (option === 'call') {
            setCall(!call);
        }
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacte</Text>
            <Text style={styles.subtitle}>Sélectionnez votre choix pour être contacté. 2 choix minimum et maximum</Text>

            {/* Option 1: Messagerie Gojobs */}
            <TouchableOpacity
                style={[styles.option, gojobsMessaging && styles.optionSelected]}
                onPress={() => toggleOption('gojobs')}
            >
                <Text style={styles.optionText}>Messagerie Gojobs</Text>
                {gojobsMessaging && <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Option 2: Appelle */}
            <TouchableOpacity
                style={[styles.option, call && styles.optionSelected]}
                onPress={() => toggleOption('call')}
            >
                <Text style={styles.optionText}>Apelle</Text>
                {call && <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Input: Téléphone */}
            {call && (
                <TextInput
                    style={styles.phoneInput}
                    placeholder="Tel :"
                    placeholderTextColor="#888"
                    value={phoneNumbers}
                    onChangeText={setPhoneNumbers}
                    keyboardType="phone-pad"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#282A2B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#888',
        fontSize: 12,
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1F1F1F',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    optionSelected: {
        borderColor: '#FFFFFF',
        borderWidth: 1,
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    phoneInput: {
        backgroundColor: '#1F1F1F',
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        marginTop: 12,
    },
});
