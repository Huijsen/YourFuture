import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function TaskItem({
  text,
  checked,
  onToggle,
  onDelete,
  subtitle,
  subtasks,
  onPress,
  onToggleSubtask,
  onDeleteSubtask,
  onPressSubtask,
}) {
  return (
    <View style={{ marginBottom: 10 , maxWidth: '85%' }}>
      <TouchableOpacity onPress={onPress} style={styles.taskRow}>
        <TouchableOpacity onPress={onToggle} style={{ marginRight: 10 }}>
          <View style={styles.squareBox}>
            {checked && <Ionicons name="checkmark" size={20} color="grey" />}
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={3} style={[styles.taskText, checked && styles.strikedText]}>
            {text}
          </Text>
          {subtitle ? (
            <Text 
              numberOfLines={1}
              ellipsizeMode="tail" 
              style={[styles.subtitleText, checked && styles.strikedText,]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {subtasks?.length > 0 && (
        <View style={{ marginLeft: 33, marginTop: 8 }}>
          {subtasks.map((sub, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start', // changed to flex-start for desc multiline
                marginBottom: 6,
              }}>
              <TouchableOpacity
                onPress={() => onToggleSubtask(idx)}
                style={styles.subtaskBox}>
                {(checked || sub.checked) && (
                  <Ionicons name="checkmark" size={14} color="grey" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onPressSubtask(idx)}
                style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.subtaskText,
                    (checked || sub.checked) && styles.strikedText,
                    { marginLeft: 10 },
                  ]}>
                  {sub.text}
                </Text>

                {sub.desc ? (
                  <Text 
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.subtitleText,
                      (checked || sub.checked) && styles.strikedText,
                      { marginLeft: 10, marginTop: 2},
                    ]}>
                    {sub.desc}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}