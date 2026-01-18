import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles'; // <- import your styles

export default function EditGoalScreen({
  editGoalTitle,
  setEditGoalTitle,
  editGoalDays,
  setEditGoalDays,
  editGoalIndex,
  setEditGoalIndex,
  setCurrentPage,
  goals,
  setGoals,
  countThisWeek,
  calculateStreaks,
}) {
  const handleSave = () => {
    if (!editGoalTitle.trim() || !editGoalDays.trim()) {
      alert('Please fill in both fields');
      return;
    }

    // Update goal info
    setGoals(prevGoals => {
      const updated = [...prevGoals];
      updated[editGoalIndex] = {
        ...updated[editGoalIndex],
        title: editGoalTitle,
        daysPerWeek: parseInt(editGoalDays),
      };
      return updated;
    });

    // Reset fields
    setEditGoalIndex(null);
    setEditGoalTitle('');
    setEditGoalDays('');
    setCurrentPage('target');

    // Recalculate stats
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        const weekDone = countThisWeek(goal.dates);
        const {
          currentStreak,
          longestStreak,
          consistency,
          weekStreak,
          longestWeekStreak,
          weekConsistency,
        } = calculateStreaks(goal.dates, goal.daysPerWeek);

        return {
          ...goal,
          streakNumber: currentStreak,
          Currentstreak: `${currentStreak}`,
          longeststreak: `${longestStreak} days`,
          consistency,
          weekStreak,
          longestWeekStreak,
          weekConsistency,
          workoutCompleted: weekDone > 0,
        };
      })
    );
  };

  const handleCancel = () => {
    setEditGoalIndex(null);
    setEditGoalTitle('');
    setEditGoalDays('');
    setCurrentPage('target');

    // Recalculate stats
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        const weekDone = countThisWeek(goal.dates);
        const {
          currentStreak,
          longestStreak,
          consistency,
          weekStreak,
          longestWeekStreak,
          weekConsistency,
        } = calculateStreaks(goal.dates, goal.daysPerWeek);

        return {
          ...goal,
          streakNumber: currentStreak,
          Currentstreak: `${currentStreak}`,
          longeststreak: `${longestStreak} days`,
          consistency,
          weekStreak,
          longestWeekStreak,
          weekConsistency,
          workoutCompleted: weekDone > 0,
        };
      })
    );
  };

  return (
    <View style={styles.taskDetailPageContainer}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }} >Edit Goal</Text>

      <TextInput
        value={editGoalTitle}
        onChangeText={setEditGoalTitle}
        placeholder="Goal title"
        style={[styles.modalTitle, { marginBottom: 10, color: 'grey' }]}
        placeholderTextColor="lightgrey"
      />

      <TextInput
        value={editGoalDays}
        onChangeText={setEditGoalDays}
        placeholder="Days per week"
        keyboardType="numeric"
        style={[styles.modalTitle, { marginBottom: 20, color: 'grey' }]}
        placeholderTextColor="lightgrey"
      />

      <TouchableOpacity onPress={handleSave} style={{ alignSelf: 'center' }}>
        <Text style={styles.addGoalText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCancel} style={{ marginTop: 15, alignSelf: 'center' }}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
