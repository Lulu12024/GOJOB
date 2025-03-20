import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CustomCheckbox from "./CustomCheckbox"; // Utiliser le même CustomCheckbox
import { Ionicons } from "@expo/vector-icons";

export default function ContractType({
  cdi,
  setCdi,
  cdd,
  setCdd,
  alternance,
  setAlternance,
  freelance,
  setFreelance,
  isHourly,
  setIsHourly,
  isMonthly,
  setIsMonthly,
  hourlyRate,
  setHourlyRate,
  monthlyRate,
  setMonthlyRate,
  errors,
  touched,
  contractTypes,
  setContractTypes,
  setFieldTouched,
}) {
  const handleSalaryToggle = (type) => {
    if (type === "hourly") {
      setIsHourly(true);
      setIsMonthly(false);
    } else if (type === "monthly") {
      setIsMonthly(true);
      setIsHourly(false);
    }
  };

  const onValueChange = (label) => {
    let updatedValue;
    switch (label) {
      case "CDI":
        updatedValue = !cdi;
        setCdi(updatedValue);
        break;
      case "CDD":
        updatedValue = !cdd;
        setCdd(updatedValue);
        break;
      case "alternance":
        updatedValue = !alternance;
        setAlternance(updatedValue);
        break;
      case "free lance":
        updatedValue = !freelance;
        setFreelance(updatedValue);
        break;
      default:
        return;
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Type de contract</Text>

      <View style={styles.checkboxGroup}>
        <CustomCheckbox
          label="CDI"
          value={cdi}
          onValueChange={() => onValueChange("CDI")}
        />
        <CustomCheckbox
          label="CDD"
          value={cdd}
          onValueChange={() => onValueChange("CDD")}
        />
        <CustomCheckbox
          label="alternance"
          value={alternance}
          onValueChange={() => onValueChange("alternance")}
        />
        <CustomCheckbox
          label="free lance"
          value={freelance}
          onValueChange={() => onValueChange("free lance")}
        />
      </View>
      {errors.contractTypes && touched.contractTypes && (
        <Text style={styles.errorText}>{errors.contractTypes}</Text>
      )}
      <Text style={styles.salaireLabel}>Salaire</Text>
      <View style={styles.salaryContainer}>
        <TouchableOpacity
          style={styles.salaryOption}
          onPress={() => handleSalaryToggle("hourly")}
        >
          <Text style={styles.salaryOptionText}>/H</Text>
          {isHourly && (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.salaryOption}
          onPress={() => handleSalaryToggle("monthly")}
        >
          <Text style={styles.salaryOptionText}>/Mois</Text>
          {isMonthly && (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      </View>
      {errors.isHourly && touched.isHourly && (
        <Text style={styles.errorText}>{errors.isHourly}</Text>
      )}
      {errors.isMonthly && touched.isMonthly && (
        <Text style={styles.errorText}>{errors.isMonthly}</Text>
      )}

      {/* Champ de saisie pour le taux horaire */}
      {isHourly && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.salaryInput}
            placeholder="Montant par heure"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            onBlur={() => setFieldTouched("hourlyRate")}
          />
          {errors.hourlyRate && touched.hourlyRate && (
            <Text style={styles.errorText}>{errors.hourlyRate}</Text>
          )}
        </View>
      )}

      {/* Champ de saisie pour le salaire mensuel */}
      {isMonthly && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.salaryInput}
            placeholder="Montant par mois"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={monthlyRate}
            onChangeText={setMonthlyRate}
            onBlur={() => setFieldTouched("monthlyRate")}
          />
          {errors.monthlyRate && touched.monthlyRate && (
            <Text style={styles.errorText}>{errors.monthlyRate}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  salaireLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  salaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  salaryOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 10,
    width: "48%",
    justifyContent: "space-between",
  },
  salaryOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  salaryInput: {
    backgroundColor: "#888888",
    color: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginTop: 4,
  },
});
