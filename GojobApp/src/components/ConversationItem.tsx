import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ConversationItemProps {
  nom: string;
  photo: string;
  dernierMessage: string;
  timeAgo: string;
  hasUnread?: boolean;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  nom,
  photo,
  dernierMessage,
  timeAgo,
  hasUnread = false,
  onPress
}) => {
    const theme = useTheme();

    return (
        <TouchableOpacity 
          onPress={onPress} 
          style={[styles.container, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}
        >
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            {hasUnread && <View style={[styles.unreadIndicator, { backgroundColor: theme.couleurs.PRIMAIRE }]} />}
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.name, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{nom}</Text>
            <Text 
              numberOfLines={1} 
              ellipsizeMode="tail"
      
              style={[
                styles.message, 
                { color: theme.couleurs.TEXTE_SECONDAIRE },
                hasUnread ? [styles.unreadMessage, { fontWeight: '600' }] : null
              ]}
            >
              {dernierMessage}
            </Text>
          </View>
          
          <Text style={[styles.time, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>{timeAgo}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3,
  },
  message: {
    fontSize: 14,
    color: '#777',
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#777',
  }
});