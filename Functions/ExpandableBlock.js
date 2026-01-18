import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { countDone, countThisWeek } from './goalStats';
import { calculateStreaks } from './streakUtils';
import calculateWeekStreak from './calculateWeekStreak';

export default function ExpandableBlock({
  goalTitle,
  streakNumber,
  Currentstreak,
  longeststreak,
  consistency,
  weekStreak,
  weekConsistency,
  daysPerWeek,
  workoutCompleted,
  expanded,
  onPress,
  onDeleteGoal,
  onEditGoalPage,
  goalDates,
}) {
  const animation = useMemo(() => new Animated.Value(0), []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doneCount = countDone(goalDates, daysPerWeek);
  const doneThisWeek = countThisWeek(goalDates, daysPerWeek);

  const dropdownStyle = {
    position: 'absolute',
    top: 42, // right below the button
    right: 20, // aligned to the right edge
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'flex-start', // left align text inside dropdown
  };


  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [expanded, animation]);

  useEffect(() => {
    if (!expanded) {
      setShowDropdown(false);
      setConfirmDelete(false);
    }
  }, [expanded]);

  const screenWidth = Dimensions.get('window').width;
  const cellSize = screenWidth > 700 ? 40 : 32;

  const inner = Math.round(cellSize * 0.75);
  const fontSize = Math.round(cellSize * 0.28);
  const fontSize2 = fontSize*1.5

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(goalTitle);
  const [editDays, setEditDays] = useState(daysPerWeek.toString());



  const renderCalendar = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayWeekDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const totalCells = 35;

    let dayItems = [];

    for (let i = 0; i < totalCells; i++) {
      let day = null;
      let isCurrentMonth = true;

      if (i < firstDayWeekDay) {
        day = daysInPrevMonth - firstDayWeekDay + 1 + i;
        isCurrentMonth = false;
      } else if (i >= firstDayWeekDay + daysInMonth) {
        day = i - (firstDayWeekDay + daysInMonth) + 1;
        isCurrentMonth = false;
      } else {
        day = i - firstDayWeekDay + 1;
      }

      const today = new Date();
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear() &&
        isCurrentMonth;

      let cellYear = year;
      let cellMonth = month;

      if (i < firstDayWeekDay) {
        // previous month
        cellMonth = month - 1;
        if (cellMonth < 0) {
          cellMonth = 11;
          cellYear -= 1;
        }
      } else if (i >= firstDayWeekDay + daysInMonth) {
        // next month
        cellMonth = month + 1;
        if (cellMonth > 11) {
          cellMonth = 0;
          cellYear += 1;
        }
      }

      const dayString = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayDate = new Date(dayString);
      const firstGoalDate = (goalDates && goalDates.length) 
        ? new Date(goalDates[0]) 
        : new Date(); // fallback naar vandaag

      // Determine if this day should show a check
      let isChecked = false;

      if (daysPerWeek === 0 && firstGoalDate) {
        const dayDateObj = new Date(dayString);
        const today = new Date();

        // strip time parts
        dayDateObj.setHours(0, 0, 0, 0);
        const firstGoalDateObj = new Date(firstGoalDate);
        firstGoalDateObj.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (dayDateObj >= firstGoalDateObj && dayDateObj <= today) {
          // Quit goal: check if there is NO completion on this day
          const hasCompletion = (goalDates || []).some(
            date => date.slice(0, 10) === dayString
          );
          isChecked = !hasCompletion; // green check for skipped days
        }
      } else {
        // Normal goal: check if there is a completion
        isChecked = (goalDates || []).some(
          date => date.slice(0, 10) === dayString
        );
      }


      dayItems.push(
        <View
          style={{
            width: cellSize,
            height: cellSize,
            borderRadius: cellSize/2,
            backgroundColor: 'lightgrey',
            marginVertical: 1,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isCurrentMonth ? 1 : 0.3,
          }}
        >
          <View
            style={{
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              backgroundColor: isChecked ? 'lightgreen' : 'white',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Text
              style={{
                fontSize,
                color: 'grey',
                position: 'absolute',
                opacity: isChecked ? 0.4 : 1,
              }}
            >
              {day}
            </Text>
            {isChecked && (
              <Ionicons name="checkmark" size={20} color="darkgreen" />
            )}
          </View>
        </View>
      );
    }

    return dayItems;
  };

  return (
    <View style={{ position: 'relative' }}>

      {!goalTitle || goalTitle.trim() === "" ? (
        <Text>There are no goals</Text>
      ) : (
        <>
          {/* Dropdown */}
          {showDropdown && !confirmDelete && !editMode && (
            <View style={dropdownStyle}>
              <TouchableOpacity
                onPress={() => onEditGoalPage()} 
                style={{ padding: 10 }}
              >
                <Text style={{ color: 'blue' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setConfirmDelete(true)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}


          {/* Delete confirmation modal */}
          {confirmDelete && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={{ marginBottom: 15 }}>Are you sure?</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setConfirmDelete(false);
                      setShowDropdown(false);
                    }}
                    style={styles.modalButton}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onDeleteGoal();
                      setConfirmDelete(false);
                      setShowDropdown(false);
                    }}
                    style={[styles.modalButton, { backgroundColor: 'red' }]}
                  >
                    <Text style={{ color: 'white' }}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={onPress}>
            <View
              style={{
                padding: 20,
                marginBottom: 10,
                backgroundColor: '#eee',
                borderRadius: 10,
                height: expanded ? 355 : 270,
                justifyContent: 'flex-start',
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 25 }}>{goalTitle}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {expanded ? (
                    <TouchableOpacity
                      onPress={() => setShowDropdown(!showDropdown)}
                    >
                      <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        {doneCount}
                      </Text>
                      <Ionicons name="checkmark-sharp" size={25} color="green" />
                    </>
                  )}
                </View>
              </View>

              {/* Stats */}
              {expanded && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <View>
                    <Text style={{ marginTop: 5 }}>Days per week:</Text>
                    {/* <Text style={{ marginTop: 10 }}>Current streak:</Text> */}
                    {/* <Text style={{ marginTop: 5 }}>Longest streak:</Text> */}
                    {/* <Text style={{ marginTop: 5 }}>Consistency:</Text> */}
                    <Text style={{ marginTop: 10 }}>Week streak:</Text> 
                    <Text style={{ marginTop: 5 }}>Week consistency:</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ marginTop: 5 }}>
                      {`${doneThisWeek}/${daysPerWeek}`}
                    </Text>
                    {/* <Text style={{ marginTop: 10 }}>{Currentstreak}</Text> */}
                    {/* <Text style={{ marginTop: 5 }}>{longeststreak}</Text> */}
                    {/* <Text style={{ marginTop: 5 }}>{consistency}</Text> */}
                    <Text style={{ marginTop: 10 }}>{weekStreak} {weekStreak === 1 ? 'week' : 'weeks'}, ({weekStreak * 7} days)</Text>
                    <Text style={{ marginTop: 5, marginBottom: 5 }}>{weekConsistency}</Text>
                  </View>
                </View>
              )}

              {/* Days row */}
              <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                {['Mo','Tu','We','Th','Fr','Sa','Su'].map((day,i) => (
                  <Text
                    key={i}
                    style={{
                      fontSize2,
                      fontWeight: 'bold',
                      color: 'grey',
                      textAlign: 'center',   // center inside its column
                      width: '14.28%',       // 7 equal columns
                    }}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginTop: 5 }}>
                {renderCalendar().map((dayComponent, i) => (
                  <View
                    key={i}
                    style={{
                      width: '14.28%',      // same as labels
                      alignItems: 'center', // center circle in the column
                      marginVertical: 0.5,
                    }}
                  >
                    {dayComponent}
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}