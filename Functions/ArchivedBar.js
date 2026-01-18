import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function ArchivedBar({ setCurrentPage }) {
  return (
    <TouchableOpacity onPress={() => setCurrentPage('archived')}>
      <View style={styles.archiveBox}>
        <Ionicons name="archive" size={24} color="grey" />
        <Text style={styles.archiveText}>Archived</Text>
      </View>
    </TouchableOpacity>
  );
}