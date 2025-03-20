import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";

import Title from "@/components/Title";
import Categories from "@/components/CategoriesPub";
import Photos from "@/components/Photos";
import Description from "@/components/Description";
import WorkingRightsExperience from "@/components/WorkingRightsExperience";
import Accomodation from "@/components/Accomodation";
import YourDetails from "@/components/YourDetails";
import ContractType from "@/components/ContractType"; // Import du composant ContractType
import ContactOptions from "@/components/ContactOptions"; // Import du composant ContactOptions
import ContractSection from "@/components/ContractSection"; // Import du composant ContractSection
import NotationSection from "@/components/NotationSection"; // Import du composant NotationSection
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"; // Pour Expo, assurez-vous d'installer cette bibliothèque
import ContactsOptions from "@/components/ContactsOptions";
import { createJob } from "@/utils/job";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  selectedCategory: Yup.string().required("La catégorie est requise"),
  selectedPhotos: Yup.array().required("Les photos sont requises"),
  description: Yup.string().required("La description est requise"),
  workingRights: Yup.array()
    .min(1, "Sélectionnez au moins une option")
    .required("Les droits de travail sont requis"),
  accommodationOptions: Yup.array()
    .min(1, "Sélectionnez au moins une option")
    .required("Les options d'accomodation sont requises"),
  contactName: Yup.string().required("Le nom du contact est requis"),
  location: Yup.string().required("La localisation est requise"),
  phoneNumber: Yup.string().when('contactOptions.call', {
    is: true,
    then: () => Yup.string()
      .required('Le numéro de téléphone est requis')
      .matches(/^[0-9]+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres')
      .min(10, 'Le numéro doit contenir au moins 10 chiffres')
      .max(15, 'Le numéro ne doit pas dépasser 15 chiffres'),
  }),
  cdi: Yup.boolean(),
  cdd: Yup.boolean(),
  alternance: Yup.boolean(),
  freelance: Yup.boolean(),
  contractTypes: Yup.array()
    .min(1, "Sélectionnez au moins un type de contrat")
    .required("Au moins un type de contrat est requis"),
  isHourly: Yup.boolean(),
  isMonthly: Yup.boolean(),
  hourlyRate: Yup.string().when(['isHourly'], {
    is: true,
    then: () => Yup.string().required("Le taux horaire est requis"),
  }),
  monthlyRate: Yup.string().when(['isMonthly'], {
    is: true,
    then: () => Yup.string().required("Le taux mensuel est requis"),
  }),
  gojobsMessaging: Yup.boolean(),
  call: Yup.boolean(),
  websiteRedirect: Yup.boolean(),
  phoneNumbers: Yup.string(),
  contractImages: Yup.array(),
  selectedOption: Yup.mixed(),
  total: Yup.number(),
  startDate: Yup.date().required("La date de début est requise"),
  endDate: Yup.date().required("La date de fin est requise"),
  autoRenew: Yup.boolean(),
  promoCode: Yup.string(),
  totals: Yup.number(),
  contactOptions: Yup.object().shape({
    gojobsMessaging: Yup.boolean(),
    call: Yup.boolean(),
    websiteRedirect: Yup.boolean(),
  }).test(
    'exactly-two-selected',
    'Vous devez sélectionner exactement deux options de contact.',
    (value) => {
      if (!value) return false;
      const selectedCount = Object.values(value).filter(Boolean).length;
      return selectedCount === 2;
    }
  ),
  websiteUrl: Yup.string().when('contactOptions.websiteRedirect', {
    is: true,
    then: () => Yup.string()
      .required('L\'URL du site web est requise')
      .url('Veuillez entrer une URL valide')
      .matches(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        'Veuillez entrer une URL valide'
      ),
  }),
});

export default function Publish() {
  const { token } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    title: "",
    selectedCategory: "",
    selectedPhotos: [],
    description: "",
    workingRights: [],
    accommodationOptions: [],
    contactName: "",
    location: "",
    phoneNumber: "",
    cdi: false,
    cdd: false,
    alternance: false,
    freelance: false,
    contractTypes: [],
    isHourly: true,
    isMonthly: false,
    hourlyRate: "",
    monthlyRate: "",
    gojobsMessaging: false,
    call: false,
    apply: false,
    websiteRedirect: false,
    phoneNumbers: "",
    customQuestion1: "",
    customQuestion2: "",
    contractImages: [],
    selectedOption: null,
    total: 0,
    startDate: new Date(),
    endDate: new Date(),
    autoRenew: false,
    promoCode: "",
    totals: 0,
    contactOptions: {
      gojobsMessaging: false,
      call: false,
      websiteRedirect: false,
    },
    websiteUrl: '',
  };
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    setLoading(true);
    await createJob(values, token, dispatch);
    setLoading(false);
    Toast.show({
      text1: 'Job created successfully',
      type: 'success',
    });
  };

  const showDatePicker = (setter, setFieldValue, values) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          setter(selectedDate);
          const otherDate = setter === setFieldValue.bind(null, "startDate") 
            ? values.endDate 
            : values.startDate;
          const newTotal = calculateTotal(
            setter === setFieldValue.bind(null, "startDate") ? selectedDate : values.startDate,
            setter === setFieldValue.bind(null, "endDate") ? selectedDate : values.endDate,
            values.selectedOption
          );
          setFieldValue('total', newTotal);
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const handleSelectOption = (option, price, setFieldValue, values) => {
    setFieldValue('selectedOption', option);
    
    if (values.startDate && values.endDate) {
      const newTotal = calculateTotal(values.startDate, values.endDate, option);
      setFieldValue('total', newTotal);
    }
  };

  const calculateTotal = (startDate, endDate, selectedOption) => {
    if (!startDate || !endDate || !selectedOption) return 0;
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const ratePerDay = {
      'urgent': 3,
      'new': 1.5,
      'top': 2
    }[selectedOption];
    
    return days * ratePerDay;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        setFieldTouched,
        errors,
        touched,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ad Job</Text>
            <View style={{ width: 24 }} />
          </View>

          <Title
            title={values.title}
            errors={errors}
            touched={touched}
            setTitle={handleChange("title")}
          />
          <Categories
            errors={errors}
            touched={touched}
            selectedCategory={values.selectedCategory}
            setSelectedCategory={handleChange("selectedCategory")}
          />

          <Photos
            errors={errors}
            touched={touched}
            selectedPhotos={values.selectedPhotos}
            setSelectedPhotos={(photos) =>
              setFieldValue("selectedPhotos", photos)
            }
          />

          <Description
            errors={errors}
            touched={touched}
            description={values.description}
            setDescription={handleChange("description")}
          />

          <WorkingRightsExperience
            errors={errors}
            touched={touched}
            selectedOptions={values.workingRights}
            setSelectedOptions={(options) =>
              setFieldValue("workingRights", options)
            }
          />

          <Accomodation
            errors={errors}
            touched={touched}
            selectedOptions={values.accommodationOptions}
            setSelectedOptions={(options) =>
              setFieldValue("accommodationOptions", options)
            }
          />
          <YourDetails
            errors={errors}
            touched={touched}
            contactName={values.contactName}
            setContactName={handleChange("contactName")}
            location={values.location}
            setLocation={handleChange("location")}
            phoneNumber={values.phoneNumber}
            setPhoneNumber={handleChange("phoneNumber")}
          />
          <ContractType
            errors={errors}
            touched={touched}
            cdi={values.cdi}
            setCdi={(value) => {
              setFieldValue("cdi", value);
              setFieldValue(
                "contractTypes",
                value
                  ? [
                      ...values.contractTypes.filter((t) => t.label !== "CDI"),
                      { label: "CDI", value: true },
                    ]
                  : values.contractTypes.filter((t) => t.label !== "CDI")
              );
            }}
            cdd={values.cdd}
            setCdd={(value) => {
              setFieldValue("cdd", value);
              setFieldValue(
                "contractTypes",
                value
                  ? [
                      ...values.contractTypes.filter((t) => t.label !== "CDD"),
                      { label: "CDD", value: true },
                    ]
                  : values.contractTypes.filter((t) => t.label !== "CDD")
              );
            }}
            alternance={values.alternance}
            setAlternance={(value) => {
              setFieldValue("alternance", value);
              setFieldValue(
                "contractTypes",
                value
                  ? [
                      ...values.contractTypes.filter(
                        (t) => t.label !== "alternance"
                      ),
                      { label: "alternance", value: true },
                    ]
                  : values.contractTypes.filter((t) => t.label !== "alternance")
              );
            }}
            freelance={values.freelance}
            setFreelance={(value) => {
              setFieldValue("freelance", value);
              setFieldValue(
                "contractTypes",
                value
                  ? [
                      ...values.contractTypes.filter(
                        (t) => t.label !== "free lance"
                      ),
                      { label: "free lance", value: true },
                    ]
                  : values.contractTypes.filter((t) => t.label !== "free lance")
              );
            }}
            contractTypes={values.contractTypes}
            setContractTypes={(value) => handleChange("contractTypes", value)}
            isHourly={values.isHourly}
            setIsHourly={(value) => setFieldValue("isHourly", value)}
            isMonthly={values.isMonthly}
            setIsMonthly={(value) => setFieldValue("isMonthly", value)}
            hourlyRate={values.hourlyRate}
            setHourlyRate={handleChange("hourlyRate")}
            monthlyRate={values.monthlyRate}
            setMonthlyRate={handleChange("monthlyRate")}
            setFieldTouched={setFieldTouched}
            
          />
          <ContactOptions
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            gojobsMessaging={values.contactOptions.gojobsMessaging}
            setGojobsMessaging={(value) => {
              setFieldValue("contactOptions.gojobsMessaging", value);
              setFieldTouched("contactOptions.gojobsMessaging", true);
            }}
            call={values.contactOptions.call}
            setCall={(value) => {
              setFieldValue("contactOptions.call", value);
              setFieldTouched("contactOptions.call", true);
              if (value) {
                setFieldTouched("phoneNumber", true);
              }
            }}
            websiteRedirect={values.contactOptions.websiteRedirect}
            setWebsiteRedirect={(value) => {
              setFieldValue("contactOptions.websiteRedirect", value);
              setFieldTouched("contactOptions.websiteRedirect", true);
              if (value) {
                setFieldTouched("websiteUrl", true);
              }
            }}
            phoneNumber={values.phoneNumber}
            setPhoneNumber={(value) => {
              setFieldValue("phoneNumber", value);
              setFieldTouched("phoneNumber", true);
            }}
            websiteUrl={values.websiteUrl}
            setWebsiteUrl={(value) => {
              setFieldValue("websiteUrl", value);
              setFieldTouched("websiteUrl", true);
            }}
          />
          <ContractSection
            contractImages={values.contractImages}
            setContractImages={(images) =>
              setFieldValue("contractImages", images)
            }
          />
          <NotationSection
            selectedOption={values.selectedOption}
            setSelectedOption={(option) => handleSelectOption(option, null, setFieldValue, values)}
            total={values.total}
            setTotal={(total) => setFieldValue('total', total)}
            errors={errors}
            touched={touched}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temps de mise en ligne</Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() =>
                  showDatePicker(setFieldValue.bind(null, "startDate"), setFieldValue, values)
                }
              >
                <Text style={styles.dateText}>
                  DU : {values.startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() =>
                  showDatePicker(setFieldValue.bind(null, "endDate"), setFieldValue, values)
                }
              >
                <Text style={styles.dateText}>
                  AU : {values.endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          
            <Text style={styles.totalText}>Total : {values.total} €</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.postAdButton} onPress={handleSubmit}>
              <Text style={styles.postAdButtonText}>Post </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1D222B",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  postAdButton: {
    backgroundColor: "#0A5EDDFF", // Couleur bleue comme dans l'image
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  postAdButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  section: {
    backgroundColor: "#282A2B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: "#1F1F1F",
    padding: 12,
    borderRadius: 8,
  },
  dateText: {
    color: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  promoInput: {
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  totalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  input: {
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});
