import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { imageUrl, timeAgo } from "@/utils";
import { getJobById } from "@/utils/job";

const { width } = Dimensions.get("window");

export default function JobDetails() {
  const { id } = useGlobalSearchParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducer.token);
  const user = useSelector((state) => state.userReducer.user);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  console.log(user)
  useEffect(() => {
    getJobById(id, token, dispatch).then((job) => {
      setJob(job);
      setLoading(false);
    });
  }, [id, token, dispatch]);

  // Reconvertir les images en tableau

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" style={styles.container} />
  ) : job ? (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Galerie d'images */}
      <View style={styles.imageGallery}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false} 
        >
          {job.photos.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: `${imageUrl}${img}` }} style={styles.image} />
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {index + 1}/{job.photos.length}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Détails de l'emploi */}
      <View style={styles.detailsContainer}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color="#66B2FF" />
          <Text style={styles.locationText}>{job.location}</Text>
        </View>

        {/* Catégorie */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="briefcase-outline" size={18} color="#66B2FF" />
          <Text style={styles.infoText}>Catégorie: {job.category}</Text>
        </View>

        {/* Types de contrat */}
        <View style={styles.contractTypes}>
          {job.cdi && <View style={styles.badge}><Text style={styles.badgeText}>CDI</Text></View>}
          {job.cdd && <View style={styles.badge}><Text style={styles.badgeText}>CDD</Text></View>}
          {job.alternance && <View style={styles.badge}><Text style={styles.badgeText}>Alternance</Text></View>}
          {job.freelance && <View style={styles.badge}><Text style={styles.badgeText}>Freelance</Text></View>}
        </View>

        {/* Working Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions requises</Text>
          {job.working_rights.map((right, index) => (
            <Text key={index} style={styles.listItem}>• {right}</Text>
          ))}
        </View>

        {/* Accommodation Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options d'hébergement</Text>
          {job.accommodation_options.map((option, index) => (
            <Text key={index} style={styles.listItem}>• {option}</Text>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.listItem}>Nom: {job.contact_name}</Text>
          <Text style={styles.listItem}>Téléphone: {job.phone_number}</Text>
        </View>

        {/* Informations de l'entreprise */}
        <View style={styles.companyContainer}>
          <View style={styles.companyLogo}>
            <Image source={{ uri: `${imageUrl}${job.user.image}` }} style={styles.companyLogoImage} />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{job.user.name}</Text>
            <Text style={styles.companyDetails}>
              membres GoJobs depuis {timeAgo(job.user.created_at)}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="check-decagram"
            size={20}
            color="#66B2FF"
          />
        </View>

        {/* Salaire */}
        <Text style={styles.salaryText}>{job.is_hourly ? `$${job.hourly_rate} / Heure` : `$${job.monthly_rate} / Mois`}</Text>

        {/* Description de l'emploi */}
        <Text style={styles.description}>{job.description}</Text>
      </View>

      {/* Boutons en bas */}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.applyButton} onPress={() => router.push(`/abonnement`)}>
          <Text style={styles.applyButtonText}>Postuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Text style={styles.errorText}>Impossible de charger les détails de l'emploi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1D222B",
    paddingBottom: 20, // Pour laisser de l'espace pour les boutons
  },
  imageGallery: {
    position: "relative",
  },
  imageWrapper: {
    width,
    height: width * 0.6,
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  imageCounter: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },
  topButtons: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  detailsContainer: {
    padding: 16,
  },
  jobTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    color: "#66B2FF",
    marginLeft: 4,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  companyLogo: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  companyDetails: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  salaryText: {
    color: "#E1E1E1",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  similarJobsTitle: {
    color: "#66B2FF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  similarJobsContainer: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  similarJobCard: {
    alignItems: "center",
    marginRight: 16,
  },
  similarJobImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  similarJobTitle: {
    color: "#CCCCCC",
    fontSize: 12,
    textAlign: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  applyButton: {
    backgroundColor: "#888888",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  applyButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#0044CC",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  messageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#CCCCCC',
    marginLeft: 4,
  },
  contractTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    gap: 8,
  },
  badge: {
    backgroundColor: '#66B2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
