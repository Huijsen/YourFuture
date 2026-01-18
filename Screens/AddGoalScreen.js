import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles'; // <- import styles
import { Alert } from 'react-native'; // Should already be there

export default function AddGoalScreen({
  newGoalTitle,
  setNewGoalTitle,
  newGoalDays,
  setNewGoalDays,
  setGoals,
  goals,
  setCurrentPage,
}) {
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
      daysPerWeek: parseInt(newGoalDays),
      streakNumber: 0,
      Currentstreak: '0',
      longeststreak: '0 days',
      consistency: '0%',
      weekStreak: 0,
      weekConsistency: '0%',
      workoutCompleted: false,
      dates: [],
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDays('');
    setCurrentPage('target');
  };

  const handleCancel = () => {
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
            style={[styles.modalTitle, { marginBottom: 10, color: "grey"}]}
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

        <TouchableOpacity
            onPress={() => {

            if (newGoalTitle.trim() === '' || newGoalDays.trim() === '') {
                alert('Invalid, Please fill in both fields');
                return; // stop execution
            }

            setNewGoalTitle('');
            setNewGoalDays('');
            
            setCurrentPage('target');

            const newGoal = {
            title: newGoalTitle,
            daysPerWeek: parseInt(newGoalDays),
            streakNumber: 0,
            Currentstreak: '0',
            longeststreak: '0 days',
            consistency: '0%',
            weekStreak: 0,           // ✅ add
            weekConsistency: '0%', 
            workoutCompleted: false,
            dates: [],  // each goal starts with its own empty array
            };
            setGoals([...goals, newGoal]);


            // Add empty array for new goal in goalDates
            //</View>setGoalDates(prev => ({
            //  ...prev,
            //  [newGoalTitle]: [],
            //}));

            


            
            }}

            style={{ alignSelf: 'center' }}
            >
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
