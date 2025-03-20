import React from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store, persistor } from "@/store/store";
import Toast from "react-native-toast-message";
import { StripeProvider } from '@stripe/stripe-react-native';

const STRIPE_PUBLIC_KEY = 'pk_test_51FrQwlBnheRwo4jaGI5iqBTAA9Z9KnwBOOCiNoTMhhLsox5vKpFPB8s61gacy9H4kQZ0Jol31w1KpAHtuS7MKO1100ZOqM7qyt';

export default function AppLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider
          publishableKey={STRIPE_PUBLIC_KEY}
          merchantIdentifier="merchant.com.yourapp" 
        >
          <GestureHandlerRootView style={styles.container}>
            <Toast />
            <RooterNav />
          </GestureHandlerRootView>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}
export const RooterNav = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="candidat/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pro/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="JobDetails" options={{ headerShown: false }} />
      <Stack.Screen name="abonnement" options={{ headerShown: false }} />

    </Stack>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
