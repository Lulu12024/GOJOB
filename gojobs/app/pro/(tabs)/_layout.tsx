import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'stats') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'publish') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'candidates') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'messages') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          }

          return (
            <Ionicons 
              name={iconName} 
              size={size} 
              color={color}
              style={{
                borderBottomWidth: focused ? 2 : 0, // Ligne sous l'icône active
                borderBottomColor: '#FFFFFF',
              }}
            />
          );
        },
        tabBarActiveTintColor: '#FFFFFF', // Couleur des icônes actives
        tabBarInactiveTintColor: '#888', // Couleur des icônes inactives
        tabBarStyle: { 
          backgroundColor: '#181A1B', // Couleur de fond du bottom tab
          borderTopWidth: 0, // Enlever la bordure supérieure
        },
        tabBarLabelStyle: {
          fontSize: 12, // Taille de la police
        },
        headerStyle: { backgroundColor: '#000' }, // AppBar en noir
      })}
    >
      <Tabs.Screen name="home" options={{ headerShown: false, title: 'Home' }} />
      <Tabs.Screen name="stats" options={{ headerShown: false, title: 'Suivi stats' }} />
      <Tabs.Screen name="publish" options={{ headerShown: false, title: 'Publier' }} />
      <Tabs.Screen name="candidates" options={{ headerShown: false, title: 'Candidats' }} />
      <Tabs.Screen name="messages" options={{ headerShown: false, title: 'Messages' }} />
    </Tabs>
  );
}
