import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/header";
import HeaderCand from "@/components/headerCand";
import { useDispatch, useSelector } from "react-redux";
import { ListeJob } from "@/utils/job";
import { imageUrl, timeAgo } from "@/utils";
import LottieView from "lottie-react-native";
const { width } = Dimensions.get("window");

// Données des offres

export default function Home() {
  const { user, token } = useSelector((state) => state.userReducer);
  const { offers } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const height = Dimensions.get("window").height;
  useEffect(() => {
    setLoading(true);
    ListeJob(token, dispatch);
    setLoading(false);
  }, []);

  // Définir le type de likedOffers
  const [likedOffers, setLikedOffers] = useState({});

  // Fonction pour gérer le clic sur l'icône
  const toggleLike = (offerId) => {
    setLikedOffers((prevState) => ({
      ...prevState,
      [offerId]: !prevState[offerId], // Inverse l'état actuel
    }));
  };

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" style={styles.container} />
  ) : (
    <View style={styles.container}>
      <HeaderCand />

      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => router.push("../../searchscreen")}
      >
        <Ionicons name="search-outline" size={20} color="#666666" />
        <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Emplois recommandé</Text>

      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.recommendationCard}
            onPress={() =>
              router.push({ pathname: "/JobDetails", params: { id: item.id } })
            }
          >
            <Image
              source={{ uri: `${imageUrl}${item.photos[0]}` }}
              style={styles.jobImage}
            />
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.companyName} numberOfLines={1}>
                {item.category}
              </Text>
              <Text style={styles.companyName} numberOfLines={1}>
                {item.description}
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <Ionicons name="person" size={20} color="#30B0C7" />
                  <Text style={styles.location}>{item.user.name}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="location" size={20} color="#30B0C7" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </View>
            </View>
            <View style={styles.roww}>
              <Text style={styles.timeAgo}>{timeAgo(item.created_at)}</Text>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Ionicons
                  name="heart"
                  size={20}
                  color={likedOffers[item.id] ? "red" : "#666666"}
                  style={styles.like}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.2,
            }}
          >
            <LottieView
              source={require("@/assets/empty.json")}
              autoPlay
              loop
              width={200}
              height={200}
            />
            <Text
              style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
            >
              Aucune offre trouvée
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D222B",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  roww: {
    flexDirection: "column",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    color: "#343F47",
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  recommendationCard: {
    backgroundColor: "#434853",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    bottom: 10,
  },
  companyName: {
    color: "#A4A6A6",
    fontSize: 16,
    bottom: 10,
  },
  location: {
    color: "#FFFFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  timeAgo: {
    color: "#FFFFFF",
    fontSize: 12,
    top: 28,
    fontWeight: "bold",
  },
  like: {
    bottom: 35,
  },
});
