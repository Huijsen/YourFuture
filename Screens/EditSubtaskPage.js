import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function EditSubtaskPage({
  tasks,
  setTasks,
  selectedSubtask,
  setSelectedSubtask,
  editedSubtaskText,
  setEditedSubtaskText,
  editedSubtaskDesc,
  setEditedSubtaskDesc,
  subtaskFromTaskModal,
  setSelectedTask,
  setCurrentPage,
  showSubtaskDropdown,
  setShowSubtaskDropdown,
}) {
  const { taskIdx, subIdx } = selectedSubtask;

  return (
    <View style={styles.subtaskPageContainer}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => {
            const updated = [...tasks];
            updated[taskIdx].subtasks[subIdx].text = editedSubtaskText;
            updated[taskIdx].subtasks[subIdx].desc = editedSubtaskDesc;
            setTasks(updated);
            // Clear all subtask edit states
            setSelectedSubtask(null);
            setEditedSubtaskText('');
            setEditedSubtaskDesc('');
            setShowSubtaskDropdown(false);

            if (subtaskFromTaskModal) {
              setSelectedTask(taskIdx);
              setCurrentPage('editTask');
            } else {
              setCurrentPage('home');
            }
          }}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowSubtaskDropdown(!showSubtaskDropdown)}>
          <Ionicons name="ellipsis-horizontal" size={24} />
        </TouchableOpacity>
      </View>

      {showSubtaskDropdown && (
        <>
          <TouchableOpacity
            style={{ position: 'absolute', inset: 0, zIndex: 999 }}
            activeOpacity={1}
            onPress={() => setShowSubtaskDropdown(false)}
          />
          <View style={styles.dropdownStyle}>
            <TouchableOpacity
              onPress={() => {
                updated[taskIdx].subtasks.splice(subIdx, 1);
                setTasks(updated);

                // Reset all subtask editing state
                setSelectedSubtask(null);
                setEditedSubtaskText('');
                setEditedSubtaskDesc('');
                setShowSubtaskDropdown(false);

                if (subtaskFromTaskModal) {
                  setSelectedTask(taskIdx);
                  setCurrentPage('editTask');
                } else {
                  setCurrentPage('home');
                }
              }}>
              <Text style={{ padding: 10, color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TextInput
        value={editedSubtaskText}
        onChangeText={setEditedSubtaskText}
        style={styles.modalTitle}
      />

      <TextInput
        value={editedSubtaskDesc}
        onChangeText={setEditedSubtaskDesc}
        style={styles.modalDesc}
        multiline
        placeholder="Description..."
        placeholderTextColor="grey"
      />
    </View>
  );
}
