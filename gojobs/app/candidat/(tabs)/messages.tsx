import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const messages = [
  {
    id: '1',
    title: 'Electricien',
    company: 'EDF',
    location: 'Rennes',
    message: 'Bonjour, je viens de lire votre candidature, je suis intéressé par votre profil...',
    avatar: require('@/assets/images/offre4.jpg'),
    isNew: true,
    timestamp: '15:00',
  },
  {
    id: '2',
    title: 'Infirmiere',
    company: 'CHU',
    location: 'Rennes',
    message: 'Bonjour, je viens de lire votre candidature, je suis intéressé par votre profil...',
    avatar: require('@/assets/images/offre5.jpg'),
    isNew: false,
    timestamp: '12:30',
  },
  {
    id: '3',
    title: 'Infirmiere',
    company: 'CHU',
    location: 'Rennes',
    message: 'Bonjour, je viens de lire votre candidature, je suis intéressé par votre profil...',
    avatar: require('@/assets/images/offre6.jpg'),
    isNew: false,
    timestamp: '08:45',
  },
];

export default function Messages() {
  const router = useRouter();
  const [data, setData] = React.useState(messages);

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const renderRightActions = (progress, dragX, itemId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => handleDelete(itemId)} style={styles.deleteButton}>
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>Supprimer</Animated.Text>
<Ionicons name="trash" size={24} color="#fff"/>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
    >
      <TouchableOpacity
        style={styles.messageCard}
        onPress={() =>
          router.push({
            pathname: `../../chat/${item.id}`,
            params: { title: item.title, avatar: item.avatar, location: item.location },
          })
        }
      >
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.location}>
              <Image source={require('@/assets/images/locate.png')} style={{ marginRight: 2 }} />
              {item.location}
            </Text>
          </View>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        {item.isNew && <View style={styles.newIndicator} />}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.icon} onPress={() => router.push('../../notification')}>
            <Image source={require('@/assets/icons/not.png')} style={{ width: 22, height: 27, top: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={() => router.push('/param')}>
            <Image
              source={require('@/assets/images/profil.jpg')}
              style={styles.avatars}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  listContent: {
    padding: 16,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#434853',
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 88,
    borderRadius: 10,
    marginRight: 16,
  },
  avatars: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 16,
    color: '#000000FF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  company: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  location: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 600,
  },
  messageText: {
    fontSize: 14,
    color: '#D0D0D0',
  },
  timestamp: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'right',
  },
  newIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#FF5A5F',
    borderRadius: 5,
    marginLeft: 6,
    marginTop: -15,
    marginRight: -16,
  },
  deleteButton: {
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderRadius: 15,
    marginBottom: 16,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});