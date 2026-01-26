import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles';

export default function AddGoalScreen({
  newGoalTitle,
  setNewGoalTitle,
  newGoalDays,
  setNewGoalDays,
  setGoals,
  goals,
  setCurrentPage,
}) {

  // Generate random color
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const handleAddGoal = () => {
    // Title validation
    if (!newGoalTitle.trim()) {
      Alert.alert("Error", "Goal title cannot be empty");
      return;
    }

    // Days validation
    const days = parseInt(newGoalDays);
    if (!newGoalDays.trim() || isNaN(days) || days < 1 || days > 7) {
      Alert.alert("Error", "Days per week must be between 1 and 7");
      return;
    }

    const newGoal = {
      title: newGoalTitle,
      daysPerWeek: days,
      streakNumber: 0,
      Currentstreak: '0',
      longeststreak: '0 days',
      consistency: '0%',
      weekStreak: 0,
      weekConsistency: '0%',
      workoutCompleted: false,
      dates: [],
      color: getRandomColor(), // 🎨 random color saved
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDays('');
    setCurrentPage('target');
  };

  return (
    <View style={styles.taskDetailPageContainer}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>
        Add New Goal
      </Text>

      <TextInput
        value={newGoalTitle}
        onChangeText={setNewGoalTitle}
        placeholder="Goal title"
        style={[styles.modalTitle, { marginBottom: 10, color: "grey" }]}
        placeholderTextColor="lightgrey"
      />

      <TextInput
        value={newGoalDays}
        onChangeText={setNewGoalDays}
        placeholder="Days per week"
        keyboardType="numeric"
        style={[styles.modalTitle, { marginBottom: 20, color: "grey" }]}
        placeholderTextColor="lightgrey"
      />

      {/* ✔️ Clean: only one add handler */}
      <TouchableOpacity onPress={handleAddGoal} style={{ alignSelf: 'center' }}>
        <Text style={{ color: '#2772BC', fontWeight: 'bold' }}>Add Goal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setNewGoalTitle('');
          setNewGoalDays('');
          setCurrentPage('target');
        }}
        style={{ marginTop: 15, alignSelf: 'center' }}
      >
        <Text style={{ color: 'grey' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
