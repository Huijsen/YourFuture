import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function EditTaskPage({
  tasks,
  selectedTask,
  editedText,
  setEditedText,
  editedDesc,
  setEditedDesc,
  setSelectedTask,
  setCurrentPage,
  showAddSubtask,
  setShowAddSubtask,
  newSubtask,
  setNewSubtask,
  inputRef,
  updateSubtaskChecked,
  deleteSubtask,
  selectedSubtask,
  setSelectedSubtask,
  editedSubtaskText,
  setEditedSubtaskText,
  editedSubtaskDesc,
  setEditedSubtaskDesc,
  setSubtaskFromTaskModal,
  saveSubtaskInline,
  showDropdown,
  setShowDropdown,
  handleDelete,
  setTasks,
}) {
  return (
    <View style={styles.taskDetailPageContainer}>
    {/* Header */}
    <View
        style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        }}>
        {/* Back button */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
            onPress={() => {
            const updated = [...tasks];
            updated[selectedTask].text = editedText;
            updated[selectedTask].desc = editedDesc;
            setSelectedTask(null);
            setCurrentPage('home');
            setShowAddSubtask(false);
            }}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        </View>

        {/* Dropdown */}
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="grey" />
        </TouchableOpacity>

    </View>
    {/* Task Title & Desc */}
    <TextInput
        value={editedText}
        onChangeText={setEditedText}
        style={styles.modalTitle}
    />
    <TextInput
        value={editedDesc}
        onChangeText={setEditedDesc}
        style={styles.modalDesc}
        multiline
        placeholder="Press to edit Description..."
        placeholderTextColor="grey"
    />    
    
    {selectedSubtask && !showDropdown && (
        <TouchableOpacity
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 220, // 👈 only header + title + desc
            }}
            activeOpacity={1}
            onPress={saveSubtaskInline}
        />
    )}

    {/* Subtasks */}
    <View style={{ marginVertical: 10 }}>
        {showAddSubtask && (
        <View
            style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6, // same as other subtasks
            }}
        >
            {/* Checkbox placeholder */}
            <TouchableOpacity
            style={styles.subtaskBox}
            disabled
            >
            {/* empty, no checkmark yet */}
            </TouchableOpacity>

            {/* Input for new subtask */}
            <TextInput
            ref={inputRef}
            placeholder="Type your subtask"
            placeholderTextColor='grey'
            value={newSubtask}
            onChangeText={setNewSubtask}
            style={[
                styles.subtitleText2, // same style as collapsed subtasks
                { flex: 1, marginLeft: 10, paddingVertical: 0,  },
            ]}
            autoFocus
            onSubmitEditing={() => {
            if (newSubtask.trim()) {
            const updated = [...tasks];


            // Initialize subtasks array if undefined
            if (!updated[selectedTask].subtasks) {
            updated[selectedTask].subtasks = [];
            }


            updated[selectedTask].subtasks.unshift({
            text: newSubtask,
            desc: '',
            checked: false,
            });


            setTasks(updated);
            setNewSubtask('');
            setShowAddSubtask(false);
            }
            }}
            onBlur={() => {
            if (newSubtask.trim()) {
            const updated = [...tasks];


            // Initialize subtasks array if undefined
            if (!updated[selectedTask].subtasks) {
            updated[selectedTask].subtasks = [];
            }


            updated[selectedTask].subtasks.unshift({
            text: newSubtask,
            desc: '',
            checked: false,
            });


            setTasks(updated);
            setNewSubtask('');
            }
            setShowAddSubtask(false);
            }}
            />
        </View>
        )}
        {tasks[selectedTask]?.subtasks?.map((sub, idx) => (
        <View key={idx}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 6,
                    zIndex: 2,
                }}
                >
                <TouchableOpacity
                    onPress={() => updateSubtaskChecked(selectedTask, idx)}
                    style={styles.subtaskBox}
                >
                    {sub.checked && <Ionicons name="checkmark" size={14} color="grey" />}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                    // Go to EditSubtaskPage
                    setSelectedSubtask({
                        taskIdx: selectedTask,
                        subIdx: idx,
                    });
                    setEditedSubtaskText(sub.text);
                    setEditedSubtaskDesc(sub.desc || '');
                    setSubtaskFromTaskModal(true);
                    setCurrentPage('editSubtask'); // open subtask page
                    }}
                    style={{ flex: 1 }}
                >
                    <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.subtitleText2, sub.checked && styles.strikedText]}>
                        {sub.text}
                    </Text>
                    {sub.desc && (
                        <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ fontSize: 12, color: 'grey', maxWidth: '60%' }}
                        >
                        {sub.desc}
                        </Text>
                    )}
                    </View>
                </TouchableOpacity>
                </View>
                </View>
            ))}
        </View>
    {/* Click-away to save inline subtask edit */}


    {showDropdown && (
        <>
        <TouchableOpacity
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            }}
            activeOpacity={1}
            onPress={() => setShowDropdown(false)}
        />
        <View style={[styles.dropdownStyle, { zIndex: 4 }]}>
            <TouchableOpacity
            onPress={() => {
                handleDelete(selectedTask);
                setShowDropdown(false);
            }}
            style={{ padding: 10 }}>
            <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
        </View>
        </>
    )}

    
    </View>
  );
}
