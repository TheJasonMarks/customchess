import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface RewardedAdProps {
  visible: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
  rewardType: 'hint' | 'undo' | 'extra_time';
}

export default function RewardedAd({ visible, onClose, onRewardEarned, rewardType }: RewardedAdProps) {
  const [watching, setWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (watching) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setCompleted(true);
            return 100;
          }
          return prev + 5;
        });
      }, 150); // 3 second video simulation

      return () => clearInterval(timer);
    }
  }, [watching]);

  useEffect(() => {
    if (visible) {
      setWatching(false);
      setProgress(0);
      setCompleted(false);
    }
  }, [visible]);

  const getRewardText = () => {
    switch (rewardType) {
      case 'hint':
        return 'Get a free hint for your next move!';
      case 'undo':
        return 'Get a free undo!';
      case 'extra_time':
        return 'Get 30 extra seconds!';
      default:
        return 'Get a reward!';
    }
  };

  const handleWatchAd = () => {
    setWatching(true);
    // In production:
    // import { AdMobRewarded } from 'expo-ads-admob';
    // await AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');
    // await AdMobRewarded.requestAdAsync();
    // await AdMobRewarded.showAdAsync();
  };

  const handleClaimReward = () => {
    onRewardEarned();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {!watching ? (
            // Initial state - offer to watch ad
            <>
              <Ionicons name="gift" size={48} color="#F59E0B" />
              <Text style={styles.title}>Free Reward!</Text>
              <Text style={styles.description}>{getRewardText()}</Text>
              <Text style={styles.subtitle}>Watch a short video to claim</Text>
              
              <TouchableOpacity style={styles.watchButton} onPress={handleWatchAd}>
                <Ionicons name="play-circle" size={24} color="#fff" />
                <Text style={styles.watchButtonText}>Watch Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>No Thanks</Text>
              </TouchableOpacity>
            </>
          ) : !completed ? (
            // Watching state
            <>
              <Ionicons name="play-circle" size={48} color="#4CAF50" />
              <Text style={styles.title}>Watching Ad...</Text>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
              
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </>
          ) : (
            // Completed state
            <>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.title}>Reward Earned!</Text>
              <Text style={styles.description}>{getRewardText()}</Text>
              
              <TouchableOpacity style={styles.claimButton} onPress={handleClaimReward}>
                <Text style={styles.claimButtonText}>Claim Reward</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 350,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8D5B7',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
    padding: 8,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 14,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#2d2d44',
    borderRadius: 4,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
  },
  claimButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
