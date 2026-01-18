import React from 'react';
import { View, TextInput } from 'react-native';
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

          <TextInput
            style={{ fontSize: 14 , marginTop: 4 }}
            placeholder="Your Bio"
            value={userBio}
            onChangeText={setUserBio}
          />
        </View>
      </View>

      <View
        style={{
          height: 50,
          backgroundColor: '#eee',
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      <View
        style={{
          height: 50,
          backgroundColor: '#eee',
          borderRadius: 10,
        }}
      />
    </View>
  );
}
