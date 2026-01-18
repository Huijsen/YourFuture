import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ErrorOverlay = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <View style={styles.alertOverlay} pointerEvents="box-none">
      <View style={styles.alertBox}>
        <Ionicons name="alert-circle" size={50} color="#ff4444" style={{ marginBottom: 10 }} />
        <Text style={styles.alertTitle}>Oops!</Text>
        <Text style={styles.alertMessage}>{error}</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.alertButton}>
          <Text style={styles.alertButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingContainer} pointerEvents="box-none">
      <ActivityIndicator size="large" color="#2772BC" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // ALERT STYLES
  alertOverlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    zIndex: 9999,
    elevation: 9999,
  },
  alertBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  alertButton: {
    backgroundColor: '#2772BC',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  alertButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  // LOADING STYLES
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
});
