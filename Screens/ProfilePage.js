import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage({
  userName,
  setUserName,
  userBio,
  setUserBio,
}) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <Ionicons name="person-circle" size={100} color="grey" />

        <View style={{ marginLeft: 15 }}>
          <TextInput
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              borderBottomWidth: 1,
              height: 20,
              borderBottomColor: '#ccc',
              width: 130,
            }}
            placeholder="Your Name"
            value={userName}
            onChangeText={setUserName}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          backgroundColor: '#eee',
          borderRadius: 10,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>
          Bio:
        </Text>
        <TextInput
          style={{ fontSize: 14}}
          placeholder="Tap to edit your Bio"
          value={userBio}
          onChangeText={setUserBio}
        />
      </View>
    </View>
  );
}