import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactOptions({
  gojobsMessaging, setGojobsMessaging,
  call, setCall,
  websiteRedirect, setWebsiteRedirect,
  phoneNumber, setPhoneNumber,
  websiteUrl, setWebsiteUrl,
  errors, touched,
  setFieldTouched,
}) {
  // Calculer le nombre d'options sélectionnées
  const selectedCount = [gojobsMessaging, call, websiteRedirect].filter(Boolean).length;

  const handleToggle = (option) => {
    // Si l'option est déjà sélectionnée, on peut toujours la désactiver
    if ((option === 'gojobs' && gojobsMessaging) ||
        (option === 'call' && call) ||
        (option === 'website' && websiteRedirect)) {
      switch (option) {
        case 'gojobs':
          setGojobsMessaging(false);
          break;
        case 'call':
          setCall(false);
          break;
        case 'website':
          setWebsiteRedirect(false);
          break;
      }
      return;
    }

    // Si on a déjà 2 options sélectionnées, on ne peut pas en ajouter une nouvelle
    if (selectedCount >= 2) {
      return;
    }

    // Sinon, on peut sélectionner la nouvelle option
    switch (option) {
      case 'gojobs':
        setGojobsMessaging(true);
        setFieldTouched('contactOptions.gojobsMessaging', true);
        break;
      case 'call':
        setCall(true);
        setFieldTouched('contactOptions.call', true);
        setFieldTouched('phoneNumber', true);
        break;
      case 'website':
        setWebsiteRedirect(true);
        setFieldTouched('contactOptions.websiteRedirect', true);
        setFieldTouched('websiteUrl', true);
        break;
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Contacte</Text>
      <Text style={styles.sectionSubtitle}>
        Sélection votre choix pour être contacté, 2 choix minimum et maximum
      </Text>

      {errors.contactOptions && touched.contactOptions && (
        <Text style={styles.errorText}>{errors.contactOptions}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.contactOption, 
          gojobsMessaging && styles.selected,
          selectedCount >= 2 && !gojobsMessaging && styles.disabled
        ]}
        onPress={() => handleToggle('gojobs')}
      >
        <Text style={styles.contactOptionText}>Messagerie Gojobs</Text>
        {gojobsMessaging && <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.contactOption, 
          call && styles.selected,
          selectedCount >= 2 && !call && styles.disabled
        ]}
        onPress={() => handleToggle('call')}
      >
        <Text style={styles.contactOptionText}>Appel</Text>
        {call && <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />}
      </TouchableOpacity>

      {call && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            placeholderTextColor="#FFFFFF"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onBlur={() => setFieldTouched('phoneNumber')}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && touched.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.contactOption, 
          websiteRedirect && styles.selected,
          selectedCount >= 2 && !websiteRedirect && styles.disabled
        ]}
        onPress={() => handleToggle('website')}
      >
        <Text style={styles.contactOptionText}>Redirection vers site web</Text>
        {websiteRedirect && <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />}
      </TouchableOpacity>

      {websiteRedirect && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="URL du site web"
            placeholderTextColor="#FFFFFF"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            onBlur={() => setFieldTouched('websiteUrl')}
            keyboardType="url"
            autoCapitalize="none"
          />
          {errors.websiteUrl && touched.websiteUrl && (
            <Text style={styles.errorText}>{errors.websiteUrl}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
  },
  contactOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selected: {
    backgroundColor: '#484848',
  },
  disabled: {
    opacity: 0.5,
  },
  contactOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#888888',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 10,
  },
});
