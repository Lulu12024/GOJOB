import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { CarteOffre } from '../../components/CarteOffre';
import { fetchFavorites, toggleFavorite } from '../../redux/slices/favorisSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch } from '../../redux/store';

type FavorisProps = {
  navigation: StackNavigationProp<any>;
};

export const Favoris: React.FC<FavorisProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  // const { favoris, loading, error } = useSelector((state: any) => state.favoris);
  const { favoris = [], loading = false, error = null } = useSelector((state: any) => state.favoris || {});
  
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des favoris...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.ERREUR }}>Erreur: {error}</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Favoris</Text>
      
      <FlatList
        data={favoris}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CarteOffre
            titre={item.titre}
            entreprise={item.entreprise}
            location={item.location}
            logo={item.logo}
            timeAgo={item.createdAt}
            isFavorite={true}
            isUrgent={item.isUrgent}
            isNew={item.isNew}
            onPress={() => navigation.navigate('DetailEmploi', { jobId: item.id })}
            onFavoriteToggle={() => dispatch(toggleFavorite(item.id))}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE, textAlign: 'center' }}>
              Vous n'avez pas encore ajouté d'offres aux favoris.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  }
});