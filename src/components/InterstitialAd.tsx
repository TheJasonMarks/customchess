import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export default function InterstitialAd({ visible, onClose, onUpgrade }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (visible) {
      setCountdown(5);
      setCanClose(false);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [visible]);

  if (!visible) return null;

  // In production, you would use expo-ads-admob:
  // import { AdMobInterstitial } from 'expo-ads-admob';
  // await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
  // await AdMobInterstitial.requestAdAsync();
  // await AdMobInterstitial.showAdAsync();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.adContainer}>
          {/* Close button */}
          <View style={styles.header}>
            {canClose ? (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            )}
          </View>

          {/* Ad content placeholder */}
          <View style={styles.adContent}>
            <Ionicons name="game-controller" size={64} color="#4CAF50" />
            <Text style={styles.adTitle}>Chess Pro</Text>
            <Text style={styles.adDescription}>
              Unlock all themes, advanced AI, and remove ads forever!
            </Text>
            
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
              <Text style={styles.upgradeText}>Upgrade to Premium - $4</Text>
            </TouchableOpacity>
            
            <Text style={styles.adLabel}>Advertisement</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'flex-end',
    padding: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adContent: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 0,
  },
  adTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E8D5B7',
    marginTop: 16,
  },
  adDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  adLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 24,
  },
});
