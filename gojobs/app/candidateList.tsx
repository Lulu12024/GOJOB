import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';
import { useRouter } from 'expo-router'; // Pour la navigation


const CANDIDATES_DATA = [
    {
        id: '1',
        name: 'Claire',
        location: 'Rennes',
        timePosted: '2j',
        image: require('@/assets/images/profil.jpg'),
        status: 'new',
    },
    {
        id: '2',
        name: 'Louis Dabadi',
        location: 'Paris',
        timePosted: '1h',
        image: require('@/assets/images/profil.jpg'),
        status: 'validated',
    },
    {
        id: '3',
        name: 'Marie Cloarec',
        location: 'Pacé',
        timePosted: '1h',
        image: require('@/assets/images/profil.jpg'),
        status: 'pending',
    },
];

export default function CandidatesScreen() {
    const [candidates, setCandidates] = useState(CANDIDATES_DATA);

    const handleValidate = (id) => {
        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === id ? { ...candidate, status: 'validated' } : candidate
            )
        );
    };

    const handlePending = (id) => {
        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === id ? { ...candidate, status: 'pending' } : candidate
            )
        );
    };

    const handleDelete = (id) => {
        setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
    };
    const router = useRouter();


    const renderCandidateCard = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push('/ProfilCand')}>
                <Image source={item.image} style={styles.image} />

            </TouchableOpacity>

            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#00BFFF" />
                        <Text style={styles.location}>{item.location}</Text>
                    </View>
                    <Text style={styles.timePosted}>{item.timePosted}</Text>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.documentButton} onPress={() => router.push('/Document')}>
                        <Text style={styles.documentText}>Document</Text>
                    </TouchableOpacity>


                    <View style={styles.actionsRow}>
                        {item.status === 'new' && (
                            <>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleValidate(item.id)}>
                                    <View style={{ width: 33, height: 43, backgroundColor: '#2DB94E', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                                        <Image source={require('@/assets/images/Correct.png')} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton} onPress={() => handlePending(item.id)}>
                                    <View style={{ width: 33, height: 43, backgroundColor: '#4A6884', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                                        <Image source={require('@/assets/images/waiting.png')} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                                    <View style={{ width: 33, height: 43, backgroundColor: '#D22727', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                                        <Image source={require('@/assets/images/Cross.png')} />
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                        {item.status === 'validated' && (
                            <TouchableOpacity style={styles.actionButton}>
                                <View style={{ width: 33, height: 43, backgroundColor: '#2DB94E', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                                    <Image source={require('@/assets/images/Correct.png')} />
                                </View>
                            </TouchableOpacity>
                        )}
                        {item.status === 'pending' && (
                            <TouchableOpacity style={styles.actionButton} onPress={() => handlePending(item.id)}>
                                <View style={{ width: 33, height: 43, backgroundColor: '#4A6884', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                                    <Image source={require('@/assets/images/waiting.png')} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>


            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#888" />
                <TextInput
                    placeholder="Search Candidates"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                />
            </View>

            <Text style={styles.title}>Candidates</Text>
            <View style={{ backgroundColor: '#0E365BBF', borderRadius: 15, paddingVertical: 4, paddingHorizontal: 8, alignSelf: 'flex-start', marginBottom:15 }}>
                <Text style={styles.sectionTitle}>New</Text>
            </View>
            <FlatList
                data={candidates.filter((candidate) => candidate.status === 'new')}
                keyExtractor={(item) => item.id}
                renderItem={renderCandidateCard}
                contentContainerStyle={styles.listContainer}
            />

<View style={{ backgroundColor: '#7FBDE7', borderRadius: 15, paddingVertical: 4, paddingHorizontal: 8, alignSelf: 'flex-start', marginBottom:15}}>
                <Text style={styles.sectionTitle}>Vue</Text>
            </View>
            <FlatList
                data={candidates.filter((candidate) => candidate.status !== 'new')}
                keyExtractor={(item) => item.id}
                renderItem={renderCandidateCard}
                contentContainerStyle={styles.listContainer}
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
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
        marginVertical: 8,
    },
    listContainer: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 12,
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 15,
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: '#00BFFF',
        marginLeft: 4,
    },
    documentButton: {
        backgroundColor: '#444',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginTop: 8,
        alignSelf: 'flex-start',
        borderColor: '#A4A6A6',
        borderWidth: 2
    },
    documentText: {
        color: '#FFF',
        fontSize: 14,
    },
    timePosted: {
        color: '#AAA',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right'
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    actionButton: {
        marginHorizontal: 8,
    },
});
