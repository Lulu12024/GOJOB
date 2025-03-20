import React from "react";
import { Stack, useRouter } from "expo-router";
import LoginScreen from "../LoginScreen"; // Assurez-vous que le chemin est correct
import { Provider } from "react-redux";
import { persistor, store } from "../../store/store";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
export default function StartScreen() {
  const router = useRouter();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoginScreen />
        <Toast />
      </PersistGate>
    </Provider>
  );
}

