import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExpandableGroup({ item, onAddUser, onToggle, expanded, setCurrentPage }) {
  const { name, bio, type } = item;
  const isPerson = type === 'person';

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: expanded ? 230 : 60,
        justifyContent: 'flex-start',
        marginBottom: 6,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
        <Ionicons
          name={isPerson ? 'person-circle' : 'people'}
          size={30}
          color="black"
        />
        <Text style={{ marginLeft: 10, fontSize: 18 }}>{name}</Text>

        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}>
          <TouchableOpacity onPress={() => onAddUser(item)}>
            <Ionicons name="add-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <>
          <View
            style={{
              height: 120,
              paddingHorizontal: 10,
              backgroundColor: 'white',
              borderRadius: 8,
              marginTop: 10,
              justifyContent: 'center',
            }}
          />
          <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
            <Text>{bio || (isPerson ? 'No bio available' : '')}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}