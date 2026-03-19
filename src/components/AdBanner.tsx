import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Test Ad Unit IDs (Google AdMob)
const TEST_BANNER_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111',
});

interface AdBannerProps {
  showAds: boolean;
  onUpgradePress?: () => void;
}

export default function AdBanner({ showAds, onUpgradePress }: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Simulate ad loading
    if (showAds) {
      const timer = setTimeout(() => setAdLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [showAds]);

  if (!showAds) return null;

  // For web/testing, show a placeholder ad banner
  // In production on native, you would use:
  // import { AdMobBanner } from 'expo-ads-admob';
  // <AdMobBanner adUnitID={TEST_BANNER_ID} servePersonalizedAds />

  return (
    <View style={styles.container}>
      <View style={styles.adBanner}>
        <View style={styles.adContent}>
          <Ionicons name="megaphone-outline" size={20} color="#666" />
          <Text style={styles.adText}>Advertisement</Text>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={onUpgradePress}>
          <Text style={styles.removeText}>Remove Ads $2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  adBanner: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adText: {
    color: '#666',
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
