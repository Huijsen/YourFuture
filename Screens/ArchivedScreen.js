import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GroupPeople from '../Functions/GroupPeople'; // adjust path if needed

export default function ArchivedScreen({ setCurrentPage, archivedGroups, archivedPeople, setItems }) {
  return (
    <>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 25 ,paddingBottom: 0}}>
        <TouchableOpacity onPress={() => setCurrentPage('people')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Archived</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 50 , padding: 20 }}>
        <GroupPeople
          setCurrentPage={setCurrentPage}
          archived={true}
          items={[...archivedGroups, ...archivedPeople]} // merged archived items
          setItems={setItems}
        />
      </ScrollView>
    </>
  );
}
