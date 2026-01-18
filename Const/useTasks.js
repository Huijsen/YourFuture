import { useState } from "react";
import { Alert } from 'react-native';

export default function useTasks({ 
  setGoals,
  calculateStreaks,
  setWorkoutCompleted,
  setIsAddingTask,
  setShowAddSubtask,
  setSelectedTask,
  setEditedText,
  setEditedDesc,
  setCurrentPage,
}) {
  const [tasks, setTasks] = useState([
    {
      text: "Goal - Workout",
      desc: "Go till you drop down",
      timeTaken: 0,
      startTime: Date.now(),
      checked: false, // NEW: checked property
      subtasks: [
        { text: "Pushups", desc: "Do 3 sets", checked: false },
        { text: "Pullups", desc: "Minimum 5", checked: false },
      ],
    },
    {
      text: "Do the dishes",
      desc: "",
      timeTaken: 0,
      startTime: Date.now(),
      checked: false, // NEW: checked property
      subtasks: [],
    },
  ]);

  const [checkedStates, setCheckedStates] = useState(Array(tasks.length).fill(false));
  const [doneCollapsed, setDoneCollapsed] = useState(true);

  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [editedSubtaskText, setEditedSubtaskText] = useState("");
  const [editedSubtaskDesc, setEditedSubtaskDesc] = useState("");
  const [showSubtaskDropdown, setShowSubtaskDropdown] = useState(false);

  const saveSubtaskInline = () => {
    if (!selectedSubtask) return;
    // Validation
    if (!editedSubtaskText.trim()) {
      Alert.alert("Error", "Subtask cannot be empty");
      return;
    }

    const updated = [...tasks];
    const { taskIdx, subIdx } = selectedSubtask;
    updated[taskIdx].subtasks[subIdx].text = editedSubtaskText;
    updated[taskIdx].subtasks[subIdx].desc = editedSubtaskDesc;
    setTasks(updated);
  };

  const updateSubtaskChecked = (taskIdx, subIdx) => {
    const updated = [...tasks];
    updated[taskIdx].subtasks[subIdx].checked = !updated[taskIdx].subtasks[subIdx].checked;
    setTasks(updated);
  };

  const deleteSubtask = (taskIdx, subIdx) => {
    const updated = [...tasks];
    updated[taskIdx].subtasks.splice(subIdx, 1);
    setTasks(updated);
  };

  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleAddSuggestionTask = (taskText) => {
    if (!taskText.trim()) return;

    const newTask = {
      text: taskText,
      desc: "",
      subtasks: [],
      startTime: Date.now(),
      timeTaken: 0,
      checked: false, // NEW: checked property
    };

    setTasks([newTask, ...tasks]);
    setCheckedStates([false, ...checkedStates]);

    // Reset UI
    setIsAddingTask(false);
    setShowAddSubtask(false);
    setSelectedTask(null);
    setEditedText('');
    setEditedDesc('');
    setNewTaskText('');
    setFilteredSuggestions([]);
  };
  
  const handleAddTask = () => {
    if (!newTaskText.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }

    setTasks([
      { text: newTaskText, desc: newTaskDesc, subtasks: [], startTime: Date.now(), timeTaken: 0, checked: false },
      ...tasks,
    ]);

    setCheckedStates([false, ...checkedStates]);
    setNewTaskText("");
    setNewTaskDesc("");
    setAddingTask(false);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    setCheckedStates(checkedStates.filter((_, i) => i !== index));
    
    // Reset and navigate
    setSelectedTask(null);
    setEditedText('');
    setEditedDesc('');
    if (setCurrentPage) setCurrentPage('home'); // ← ADD THIS
  };

  const toggleCheckTask = (index) => {
    const updated = [...tasks];
    const task = updated[index];

    // If checking the task (marking as done)
    if (!task.checked) {
      if (!task.startTime) task.startTime = Date.now();
      const elapsedSeconds = Math.round((Date.now() - task.startTime) / 1000);
      task.timeTaken = elapsedSeconds;

      // Handle goal updates
      if (task.text.startsWith("Goal -")) {
        const title = task.text.replace("Goal - ", "");
        setGoals((prev) =>
          prev.map((g) =>
            g.title === title
              ? {
                  ...g,
                  dates: [...g.dates, new Date().toISOString()],
                  ...calculateStreaks([...g.dates, new Date().toISOString()], g.daysPerWeek),
                  workoutCompleted: true,
                }
              : g
          )
        );

        if (task.text === "Goal - Workout") setWorkoutCompleted(true);
      }
    } else {
      // If unchecking the task (marking as not done)
      task.startTime = Date.now();
      task.timeTaken = 0;

      // Handle goal updates for unchecking
      if (task.text.startsWith("Goal -")) {
        const title = task.text.replace("Goal - ", "");
        setGoals((prev) =>
          prev.map((g) =>
            g.title === title
              ? {
                  ...g,
                  dates: g.dates.slice(0, -1),
                  ...calculateStreaks(g.dates.slice(0, -1), g.daysPerWeek),
                  workoutCompleted: g.dates.length > 1,
                }
              : g
          )
        );

        if (task.text === "Goal - Workout") setWorkoutCompleted(false);
      }
    }

    // Toggle the checked state
    task.checked = !task.checked;
    setTasks(updated);
  };

  // REMOVED: toggleUncheckDoneTask - no longer needed since we just toggle checked property

  // Compute active and done tasks from the single tasks array
  const activeTasks = tasks.filter(t => !t.checked);
  const doneTasks = tasks.filter(t => t.checked);

  return {
    tasks,
    checkedStates,
    activeTasks, // NEW: return filtered active tasks
    doneTasks, // NEW: return filtered done tasks
    doneCollapsed,
    selectedSubtask,
    editedSubtaskText,
    editedSubtaskDesc,
    showSubtaskDropdown,
    addingTask,
    newTaskText,
    newTaskDesc,
    filteredSuggestions,
    setTasks, 
    setFilteredSuggestions,

    setDoneCollapsed,
    setSelectedSubtask,
    setEditedSubtaskText,
    setEditedSubtaskDesc,
    setShowSubtaskDropdown,
    setAddingTask,
    setNewTaskText,
    setNewTaskDesc,

    saveSubtaskInline,
    updateSubtaskChecked,
    deleteSubtask,
    handleAddSuggestionTask,
    handleAddTask,
    handleDelete,
    toggleCheckTask,
    //toggleUncheckDoneTask,
  };
}
