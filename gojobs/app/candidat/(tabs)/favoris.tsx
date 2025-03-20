import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';
import { useRouter } from 'expo-router';

export default function Favoris() {
    const router = useRouter();

    const [favorites, setFavorites] = useState([
        {
            id: '1',
            title: 'Cuisinier',
            company: 'Le grill',
            location: 'Rennes',
            image: require('@/assets/images/offre5.jpg'), // Remplacez par une URL d'image réelle
            isFavorite: true,
            timeAgo: '2h',

        },
        {
            id: '2',
            title: 'Infirmiere',
            company: 'CHU',
            location: 'Rennes',
            image: require('@/assets/images/offre2.jpg'),
            isFavorite: true,
            timeAgo: '2h',

        },
        {
            id: '3',
            title: 'Electricien',
            company: 'Edf',
            location: 'Rennes',
            image: require('@/assets/images/offre6.jpg'),
            isFavorite: true,
            timeAgo: '2h',

        },
        {
            id: '4',
            title: 'Cuisinier',
            company: 'Cuisinier',
            location: 'Rennes',
            image: require('@/assets/images/offre4.jpg'),
            isFavorite: true,
            timeAgo: '2h',

        },
    ]);

    const toggleFavorite = (id) => {
        setFavorites((prevFavorites) =>
            prevFavorites.map((item) =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    };

    const renderFavoriteItem = ({ item }) => (
        <View style={styles.card}>
            {/* Image */}
            <Image source={item.image} style={styles.image} />

            {/* Details */}
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.company}>{item.company}</Text>
                <View style={styles.locationRow}>
                    <Image source={require('@/assets/images/locate.png')} />
                    <Text style={styles.location}>{item.location}</Text>
                </View>
            </View>

            {/* Favorite Icon */}
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Ionicons
                    name={item.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={item.isFavorite ? '#FF0000' : '#888'}
                    style={{marginBottom:45}}
                />
                <Text style={{color:'#FFFF'}}>{item.timeAgo}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header />

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('../../searchscreen')}>
                <Ionicons name="search-outline" size={20} color="#888" />
                <TextInput
                    placeholder="Search Jobs"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                />
            </TouchableOpacity>

            {/* Header Text */}
            <Text style={styles.header}>Favoris</Text>

            {/* Favorite List */}
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={renderFavoriteItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D222B',
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
    },
    searchInput: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    header: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#434853',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 8,
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    company: {
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    location: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 4,
    },
});
