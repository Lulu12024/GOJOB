import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import {
  initialValuesForgotPassword,
  initialValuesForgotPasswordNewPassword,
  initialValuesForgotPasswordOtp,
  validationSchemaForgotPassword,
  validationSchemaForgotPasswordNewPassword,
  validationSchemaForgotPasswordOtp,
} from "../utils/validationShema";
import { ActivityIndicator } from "react-native";
import {
  forgotPasswordRequest,
  resetPasswordRequest,
  verifyOtpRequest,
} from "../utils/auth";
import { OtpInput } from "react-native-otp-entry";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request, 2: Email Sent, 3: New Password, 4: Success
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const handleRequestReset = (values) => {
    console.log("Request Reset Email:", values.emailForgotPassword);
    forgotPasswordRequest(
      { email: values.emailForgotPassword },
      setLoadingForgotPassword,
      setStep,
      setEmail
    );
  };

  const handleOtpSubmit = (valuesOtp) => {
    verifyOtpRequest(
      { otp: valuesOtp.otp, email: email },
      setLoadingOtp,
      setStep,
      setEmail
    );
  };

  const handleResetPassword = (values) => {N
    console.log("New Password:", values.newPassword);
    resetPasswordRequest(
      { email: email, password: values.newPassword },
      setLoadingResetPassword,
      setStep
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {step === 1 && (
          <Formik
            initialValues={initialValuesForgotPassword}
            validationSchema={validationSchemaForgotPassword}
            onSubmit={handleRequestReset}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={styles.title}>Mot de passe oublié</Text>
                <Text style={styles.subtitle}>
                  Entrez votre adresse e-mail pour réinitialiser votre mot de
                  passe.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#666"
                  value={values.emailForgotPassword}
                  onChangeText={handleChange("emailForgotPassword")}
                  onBlur={handleBlur("emailForgotPassword")}
                />
                {errors.emailForgotPassword && touched.emailForgotPassword && (
                  <Text style={styles.errorText}>
                    {errors.emailForgotPassword}
                  </Text>
                )}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <LinearGradient
                    colors={["#0F53E7FF", "#192f6a"]}
                    style={styles.gradientButtonBackground}
                  >
                    {loadingForgotPassword ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Envoyer</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )}

        {step === 2 && (
          <>
            <Formik
              initialValues={initialValuesForgotPasswordOtp}
              validationSchema={validationSchemaForgotPasswordOtp}
              onSubmit={handleOtpSubmit}
            >
              {({
                handleSubmit: handleOtpSubmit,
                values: valuesOtp,
                errors: errorsOtp,
                touched: touchedOtp,
                setFieldValue: setFieldValueOtp,
                isValid: isValidOtp,
              }) => (
                <>
                  <View style={styles.title}>
                    <Text style={styles.title}>Confirmation du code OTP</Text>
                  </View>

                  <View>
                    <Text style={styles.title}>Code OTP</Text>
                    <OtpInput
                      numberOfDigits={6}
                      onTextChange={(text) => {
                        setFieldValueOtp("otp", text);
                      }}
                      theme={{
                        focusStickStyle: {
                          backgroundColor: "#3C50E0",
                          marginBottom: 10,
                        },
                      }}
                    />
                    {errorsOtp.otp && touchedOtp.otp && (
                      <Text style={styles.errorText}>{errorsOtp.otp}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={handleOtpSubmit}
                    style={styles.button}
                  >
                    <LinearGradient
                      colors={["#0F53E7FF", "#192f6a"]}
                      style={styles.gradientButtonBackground}
                    >
                      {loadingOtp ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Valider OTP</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </>
        )}

        {step === 3 && (
          <>
            <Formik
              initialValues={initialValuesForgotPasswordNewPassword}
              validationSchema={validationSchemaForgotPasswordNewPassword}
              onSubmit={handleResetPassword}
            >
              {({
                handleChange: handleChangeNewPassword,
                handleBlur: handleBlurNewPassword,
                handleSubmit: handleSubmitNewPassword,
                values: valuesNewPassword,
                errors: errorsNewPassword,
                touched: touchedNewPassword,
              }) => (
                <>
                  <Text style={styles.title}>Nouveau mot de passe</Text>
                  <Text style={styles.subtitle}>
                    Entrez votre nouveau mot de passe.
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={valuesNewPassword.newPassword}
                    onChangeText={handleChangeNewPassword("newPassword")}
                    onBlur={handleBlurNewPassword("newPassword")}
                  />
                  {errorsNewPassword.newPassword && touchedNewPassword.newPassword && (
                    <Text style={styles.errorText}>{errorsNewPassword.newPassword}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={valuesNewPassword.confirmPassword}
                    onChangeText={handleChangeNewPassword("confirmPassword")}
                    onBlur={handleBlurNewPassword("confirmPassword")}
                  />
                  {errorsNewPassword.confirmPassword && touchedNewPassword.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errorsNewPassword.confirmPassword}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={handleSubmitNewPassword}
                    style={styles.button}
                  >
                    <LinearGradient
                      colors={["#0F53E7FF", "#192f6a"]}
                      style={styles.gradientButtonBackground}
                    >
                      <Text style={styles.buttonText}>Réinitialiser</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Mot de passe réinitialisé</Text>
            <Text style={styles.subtitle}>
              Votre mot de passe a été réinitialisé avec succès.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("./")}
              style={styles.button}
            >
              <LinearGradient
                colors={["#0F53E7FF", "#192f6a"]}
                style={styles.gradientButtonBackground}
              >
                <Text style={styles.buttonText}>Se connecter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButtonBackground: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
