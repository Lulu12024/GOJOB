// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { TabNavigatorParamList } from '../types/navigation';
// import { useTheme } from '../hooks/useTheme';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// // Importation des navigateurs
// import AccueilNavigator from './AccueilNavigator';
// import FlashJobsNavigator from './FlashJobsNavigator';
// import PublierNavigator from './PublierNavigator';
// import CandidatsNavigator from './CandidatsNavigator';
// import MessagerieNavigator from './MessagerieNavigator';

// // Importation des écrans pour l'onglet PublierTab qui est un peu différent
// import EcranPublier from '../écrans/publier/Publier';

// const Tab = createBottomTabNavigator<TabNavigatorParamList>();

// const TabNavigator: React.FC = () => {
//   const theme = useTheme();
  
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: theme.couleurs.FOND_SOMBRE,
//           borderTopColor: theme.couleurs.DIVIDER,
//           borderTopWidth: 1,
//           height: 60,
//           paddingBottom: 8,
//         },
//         tabBarActiveTintColor: theme.couleurs.PRIMAIRE,
//         tabBarInactiveTintColor: theme.couleurs.TEXTE_SECONDAIRE,
//         tabBarShowLabel: true,
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//         headerStyle: {
//           backgroundColor: theme.couleurs.FOND_SOMBRE,
//         },
//         headerTintColor: theme.couleurs.TEXTE_PRIMAIRE,
//         headerTitleStyle: {
//           fontWeight: theme.typographie.POIDS.GRAS,
//         },
//         headerShadowVisible: false,
//       }}
//     >
//       <Tab.Screen
//         name="AccueilTab"
//         component={AccueilNavigator}
//         options={{
//           tabBarLabel: 'Accueil',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="home" color={color} size={size} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="FlashJobsTab"
//         component={FlashJobsNavigator}
//         options={{
//           tabBarLabel: 'Flash Jobs',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="clock-fast" color={color} size={size} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="PublierTab"
//         component={EcranPublier}
//         options={{
//           tabBarLabel: 'Publier',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="plus-circle" color={color} size={size + 8} />
//           ),
//           title: 'Publier une annonce',
//         }}
//       />
//       <Tab.Screen
//         name="CandidatsTab"
//         component={CandidatsNavigator}
//         options={{
//           tabBarLabel: 'Candidats',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="account-group" color={color} size={size} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="MessagesTab"
//         component={MessagerieNavigator}
//         options={{
//           tabBarLabel: 'Messages',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="message-text" color={color} size={size} />
//           ),
//           headerShown: false,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigator;


// navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

// Écrans candidat
import { Accueil } from '../ecrans/accueil/Accueil';
import { ListeFlashJobs } from '../ecrans/flashJobs/ListeFlashJobs';
import { ListeConversations } from '../ecrans/messages/ListeConversations';
import { Favoris } from '../ecrans/favoris/Favoris';
import { MonProfil } from '../ecrans/profil/MonProfil';
import { ApplyAI } from '../ecrans/applyai/ApplyAI';

// Écrans employeur
import { TableauDeBord } from '../ecrans/employeur/TableauDeBord';
import { Candidatures } from '../ecrans/employeur/Candidatures';
import { MesOffres } from '../ecrans/employeur/MesOffres';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useSelector((state: any) => state.auth);
  const isEmployer = user?.role === 'employer';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {isEmployer ? (
        // Onglets pour les employeurs
        <>
          <Tab.Screen
            name="TableauDeBord"
            component={TableauDeBord}
            options={{
              title: 'Tableau de bord',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MesOffres"
            component={MesOffres}
            options={{
              title: 'Mes offres',
              tabBarIcon: ({ color, size }) => (
                <Icon name="briefcase" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Publier"
            component={PublierEmploi}
            options={{
              title: 'Publier',
              tabBarIcon: ({ color, size }) => (
                <Icon name="add-circle" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Candidatures"
            component={Candidatures}
            options={{
              title: 'Candidatures',
              tabBarIcon: ({ color, size }) => (
                <Icon name="people" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Messages"
            component={ListeConversations}
            options={{
              title: 'Messages',
              tabBarIcon: ({ color, size }) => (
                <Icon name="chatbubbles" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        // Onglets pour les candidats
        <>
          <Tab.Screen
            name="Accueil"
            component={Accueil}
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="FlashJobs"
            component={ListeFlashJobs}
            options={{
              title: 'Flash Jobs',
              tabBarIcon: ({ color, size }) => (
                <Icon name="flash" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="ApplyAI"
            component={ApplyAI}
            options={{
              title: 'ApplyAI',
              tabBarIcon: ({ color, size }) => (
                <Icon name="bulb" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Favoris"
            component={Favoris}
            options={{
              title: 'Favoris',
              tabBarIcon: ({ color, size }) => (
                <Icon name="heart" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Messages"
            component={ListeConversations}
            options={{
              title: 'Messages',
              tabBarIcon: ({ color, size }) => (
                <Icon name="chatbubbles" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
      <Tab.Screen
        name="MonProfil"
        component={MonProfil}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};