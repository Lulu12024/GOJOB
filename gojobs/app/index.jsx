import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user, token } = useSelector((state) => state.userReducer);
  
  useEffect(() => {
    setIsMounted(true); // Définir l'état monté une fois le composant chargé
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (token && user.role === "client") {
        router.replace("/candidat/(tabs)");
      } else if (token && user.role === "pro") {
        router.replace("/pro/(tabs)");
      } else {
        router.replace("/home");
      }

      // Redirection vers /home après le montage
    }
  }, [isMounted, router]);

  return null; // Pas d'affichage, redirection automatique
}
