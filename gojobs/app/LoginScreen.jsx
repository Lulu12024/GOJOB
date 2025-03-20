import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {      
  validationSchemaRegister,
  validationSchemaLogin,
  initialValuesLogin,
  initialValuesRegister,
} from "../utils/validationShema";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { registerRequest, loginRequest } from "../utils/auth";
export default function LoginScreen() {
  const router = useRouter();
  const [isEmployer, setIsEmployer] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [loadingRegister, setLoadingRegister] = useState(false);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const handleLoginSubmit = (values) => { 
    const data = {
      email: values.emailLogin,
      password: values.passwordLogin,
    };
    loginRequest(data, dispatch, setLoadingLogin);
   
  };
  const handleSignupSubmit = (values) => {
    const data = {
      name: values.fullNameRegister,
      email: values.emailRegister,
      phone: values.phoneNumberRegister,
      password: values.passwordRegister,
      role: isEmployer ? "employer" : "candidate",
    };
    registerRequest(data, dispatch, setLoadingRegister, setIsLogin);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logooo.png")}
          style={{
            alignItems: "center",
            justifyContent: "center",
            right: -100,
          }}
        />

        <View style={styles.switchContainer}>
          <View style={isEmployer ? styles.rightActive : styles.leftActive}>
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.gradientBackground}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsEmployer(false)}
            style={styles.switchButton}
          >
            <Text
              style={[
                styles.switchText,
                !isEmployer && styles.activeSwitchText,
              ]}
            >
              Candidats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsEmployer(true)}
            style={styles.switchButton}
          >
            <Text
              style={[styles.switchText, isEmployer && styles.activeSwitchText]}
            >
              Employeur
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <View style={isLogin ? styles.leftActive : styles.rightActive}>
            <LinearGradient
              colors={["#0F53E7FF", "#192f6a"]}
              style={styles.gradientBackground}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsLogin(true)}
            style={styles.switchButton}
          >
            
            <Text
              style={[styles.switchText, isLogin && styles.activeSwitchText]}
            >
              Se connecter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsLogin(false)}
            style={styles.switchButton}
          >
            <Text
              style={[styles.switchText, !isLogin && styles.activeSwitchText]}
            >
              S'inscrire
            </Text>
          </TouchableOpacity>
        </View>

        {isLogin ? (
          <Formik
            initialValues={initialValuesLogin}
            validationSchema={validationSchemaLogin}
            onSubmit={handleLoginSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#666"
                  onChangeText={handleChange("emailLogin")}
                  onBlur={handleBlur("emailLogin")}
                  value={values.emailLogin}
                />
                {errors.emailLogin && touched.emailLogin && (
                  <Text style={styles.errorText}>{errors.emailLogin}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry
                  onChangeText={handleChange("passwordLogin")}
                  onBlur={handleBlur("passwordLogin")}
                  value={values.passwordLogin}
                />
                {errors.passwordLogin && touched.passwordLogin && (
                  <Text style={styles.errorText}>{errors.passwordLogin}</Text>
                )}
                <TouchableOpacity
                  onPress={() => router.push("../forgot-password")}
                >
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.loginButton}
                >
                  <LinearGradient
                    colors={["#0F53E7FF", "#192f6a"]}
                    style={styles.gradientButtonBackground}
                  >
                    {loadingLogin ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>Se connecter</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={initialValuesRegister}
            validationSchema={validationSchemaRegister}
            onSubmit={handleSignupSubmit}
          >
            {({
              handleChange: handleRegisterChange,
              handleBlur: handleRegisterBlur,
              handleSubmit: handleRegisterSubmit,
              values: registerValues,
              errors: registerErrors,
              touched: registerTouched,
            }) => (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor="#666"
                  onChangeText={handleRegisterChange("fullNameRegister")}
                  onBlur={handleRegisterBlur("fullNameRegister")}
                  value={registerValues.fullNameRegister}
                />
                {registerErrors.fullNameRegister &&
                  registerTouched.fullNameRegister && (
                    <Text style={styles.errorText}>
                      {registerErrors.fullNameRegister}
                    </Text>
                  )}
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#666"
                  onChangeText={handleRegisterChange("emailRegister")}
                  onBlur={handleRegisterBlur("emailRegister")}
                  value={registerValues.emailRegister}
                />
                {registerErrors.emailRegister &&
                  registerTouched.emailRegister && (
                    <Text style={styles.errorText}>
                      {registerErrors.emailRegister}
                    </Text>
                  )}
                <TextInput
                  style={styles.input}
                  placeholder="Numéro"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  maxLength={15}
                  onChangeText={handleRegisterChange("phoneNumberRegister")}
                  onBlur={handleRegisterBlur("phoneNumberRegister")}
                  value={registerValues.phoneNumberRegister}
                />
                {registerErrors.phoneNumberRegister &&
                  registerTouched.phoneNumberRegister && (
                    <Text style={styles.errorText}>
                      {registerErrors.phoneNumberRegister}
                    </Text>
                  )}
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor="#666"
                  secureTextEntry
                  onChangeText={handleRegisterChange("passwordRegister")}
                  onBlur={handleRegisterBlur("passwordRegister")}
                  value={registerValues.passwordRegister}
                />
                {registerErrors.passwordRegister &&
                  registerTouched.passwordRegister && (
                    <Text style={styles.errorText}>
                      {registerErrors.passwordRegister}
                    </Text>
                  )}
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#666"
                  secureTextEntry
                  onChangeText={handleRegisterChange("confirmPasswordRegister")}
                  onBlur={handleRegisterBlur("confirmPasswordRegister")}
                  value={registerValues.confirmPasswordRegister}
                />
                {registerErrors.confirmPasswordRegister &&
                  registerTouched.confirmPasswordRegister && (
                    <Text style={styles.errorText}>
                      {registerErrors.confirmPasswordRegister}
                    </Text>
                  )}
                <TouchableOpacity
                  onPress={handleRegisterSubmit}
                  style={styles.loginButton}
                >
                  <LinearGradient
                    colors={["#0F53E7FF", "#192f6a"]}
                    style={styles.gradientButtonBackground}
                  >
                    {loadingRegister ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>S'inscrire</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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
  switchContainer: {
    flexDirection: "row",
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#003366",
    backgroundColor: "#fff",
    position: "relative",
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    zIndex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  leftActive: {
    position: "absolute",
    left: 0,
    width: "50%",
    height: "100%",
  },
  rightActive: {
    position: "absolute",
    right: 0,
    width: "50%",
    height: "100%",
  },
  switchText: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "bold",
  },
  activeSwitchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  forgotText: {
    color: "#3b82f6",
    textAlign: "left",
    marginBottom: 20,
  },
  loginButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButtonBackground: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  orText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#888",
  },
  infoText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginBottom: 20,
  },
  socialLoginContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 15,
    marginBottom: 10,
    width: "80%",
  },
  icon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
  },
  signUpText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  signUpLink: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
