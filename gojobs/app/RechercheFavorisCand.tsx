import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider"; 
import { Ionicons } from "@expo/vector-icons";
import Categories from "../components/Categories"; 
import { useRouter } from 'expo-router';


const favoris = [
  { id: "1", categorie: "Plombier", emplacement: "Paris ou 50 km autour" },
  { id: "2", categorie: "Électricien", emplacement: "Lyon ou 30 km autour" },
  { id: "3", categorie: "Menuisier", emplacement: "Marseille ou 20 km autour" },
];

const RechercheFavorisCand = () => {
  const [selectedFavori, setSelectedFavori] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false); 
  const [categorie, setCategorie] = useState("");
  const [emplacement, setEmplacement] = useState("");
  const [distance, setDistance] = useState(50); // Distance par défaut
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);

  const openEditModal = (item) => {
    setSelectedFavori(item);
    setCategorie(item.categorie);
    setEmplacement(item.emplacement);
    setModalVisible(true);
  };

  const saveChanges = () => {
    if (selectedFavori) {
      selectedFavori.categorie = categorie;
      selectedFavori.emplacement = emplacement;
    }
    setModalVisible(false);
  };

  const handleCategorySelection = (selectedCategories) => {
    setCategorie(selectedCategories.join(", "));
  };

  const openLocationModal = () => {
    setLocationModalVisible(true);
  };

  const saveLocation = () => {
    setEmplacement(`${emplacement} ou ${distance} km autour`);
    setLocationModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.text}>
          <Text style={styles.bold}>Catégorie : </Text>
          {item.categorie}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Emplacement : </Text>
          {item.emplacement}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditModal(item)}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

    const router = useRouter();
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Recherche favoris</Text>
      </View>

      <Text style={styles.sectionTitle}>Consulter ou modifier</Text>

      <FlatList
        data={favoris}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirmer</Text>
      </TouchableOpacity>

      {/* Modal de modification */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le favori</Text>

            <Text style={styles.label}>Catégorie</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCategoriesModalVisible(true)}
            >
              <Text style={{ color: "#fff" }}>{categorie || "Choisir..."}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Emplacement</Text>
            <TouchableOpacity style={styles.input} onPress={openLocationModal}>
              <Text style={{ color: "#fff" }}>
                {emplacement || "Choisir un emplacement"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveChanges}
              >
                <Text style={styles.buttonText}>Go</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour le choix d'emplacement */}
      <Modal visible={locationModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Où</Text>

            
            <TextInput
              style={styles.input}
              placeholder="Entrez une ville"
              placeholderTextColor="#888"
              value={emplacement}
              onChangeText={setEmplacement}
            />

            <Text style={styles.label}>Distance : {distance} KM</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={250}
              step={1}
              value={distance}
              onValueChange={(value) => setDistance(value)}
              minimumTrackTintColor="#0E365BBF"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#0E365BBF"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveLocation}
              >
                <Text style={styles.buttonText}>Go</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLocationModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nouveau composant Categories */}
      <Categories
        visible={categoriesModalVisible}
        onClose={() => setCategoriesModalVisible(false)}
        onSelectCategories={handleCategorySelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1D222B" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#1D222B",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", paddingHorizontal: 16, marginBottom: 10 },
  list: { paddingHorizontal: 16 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", borderRadius: 8, padding: 16, marginBottom: 12 },
  cardContent: { flex: 1 },
  text: { color: "#fff", fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: "bold" },
  editButton: { backgroundColor: "#3A3A3C", padding: 8, borderRadius: 4 },
  confirmButton: { backgroundColor: "#0E365BBF", padding: 16, borderRadius: 8, alignItems: "center", marginHorizontal: 16, marginBottom: 20 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "90%", backgroundColor: "#2C2C2E", borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 18, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8 },
  input: { backgroundColor: "#3A3A3C", color: "#fff", borderRadius: 25, padding: 12, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: { backgroundColor: "#0E365BBF", padding: 12, borderRadius: 8, flex: 1, marginRight: 8 },
  cancelButton: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 8, flex: 1 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default RechercheFavorisCand;
