import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOARD_THEMES, BoardTheme, DEFAULT_THEME } from '../src/utils/themes';
import { soundManager } from '../src/utils/soundManager';

const TIME_CONTROLS = [
  { id: 'unlimited', name: 'Unlimited', minutes: 0 },
  { id: '1min', name: '1 Minute', minutes: 1 },
  { id: '3min', name: '3 Minutes', minutes: 3 },
  { id: '5min', name: '5 Minutes', minutes: 5 },
  { id: '10min', name: '10 Minutes', minutes: 10 },
  { id: '15min', name: '15 Minutes', minutes: 15 },
  { id: '30min', name: '30 Minutes', minutes: 30 },
];

const AI_DIFFICULTIES = [
  { id: 'easy', name: 'Easy', description: 'Perfect for beginners' },
  { id: 'medium', name: 'Medium', description: 'A fair challenge' },
  { id: 'hard', name: 'Hard', description: 'For experienced players' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string>('classic');
  const [selectedTimeControl, setSelectedTimeControl] = useState<string>('unlimited');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [matureContentEnabled, setMatureContentEnabled] = useState<boolean>(false);
  const [showAgeVerification, setShowAgeVerification] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const theme = await AsyncStorage.getItem('chess_theme');
      const timeControl = await AsyncStorage.getItem('chess_time_control');
      const difficulty = await AsyncStorage.getItem('chess_ai_difficulty');
      const sound = await AsyncStorage.getItem('chess_sound');
      const matureContent = await AsyncStorage.getItem('chess_mature_content');

      if (theme) setSelectedTheme(theme);
      if (timeControl) setSelectedTimeControl(timeControl);
      if (difficulty) setSelectedDifficulty(difficulty);
      if (sound !== null) {
        const soundOn = sound === 'true';
        setSoundEnabled(soundOn);
        soundManager.setMuted(!soundOn);
      }
      if (matureContent === 'true') setMatureContentEnabled(true);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveTheme = async (themeId: string) => {
    setSelectedTheme(themeId);
    await AsyncStorage.setItem('chess_theme', themeId);
  };

  const saveTimeControl = async (timeControlId: string) => {
    setSelectedTimeControl(timeControlId);
    await AsyncStorage.setItem('chess_time_control', timeControlId);
  };

  const saveDifficulty = async (difficultyId: string) => {
    setSelectedDifficulty(difficultyId);
    await AsyncStorage.setItem('chess_ai_difficulty', difficultyId);
  };

  const toggleSound = async (value: boolean) => {
    setSoundEnabled(value);
    soundManager.setMuted(!value);
    await AsyncStorage.setItem('chess_sound', value.toString());
  };

  const handleMatureContentToggle = (value: boolean) => {
    if (value) {
      setShowAgeVerification(true);
    } else {
      setMatureContentEnabled(false);
      AsyncStorage.setItem('chess_mature_content', 'false');
    }
  };

  const confirmAgeVerification = async () => {
    setMatureContentEnabled(true);
    await AsyncStorage.setItem('chess_mature_content', 'true');
    setShowAgeVerification(false);
  };

  const cancelAgeVerification = () => {
    setShowAgeVerification(false);
  };

  const currentTheme = BOARD_THEMES.find(t => t.id === selectedTheme) || DEFAULT_THEME;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.mainMenuText, { color: currentTheme.textPrimary }]}>Resume Game</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.textPrimary }]}>Settings</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={[styles.mainMenuText, { color: currentTheme.textPrimary }]}>Main Menu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sound Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Sound</Text>
          <View style={[styles.soundRow, { backgroundColor: currentTheme.darkSquare + '30' }]}>
            <View style={styles.soundInfo}>
              <Text style={[styles.soundLabel, { color: currentTheme.textPrimary }]}>
                Sound Effects
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#767577', true: currentTheme.accent + '80' }}
              thumbColor={soundEnabled ? currentTheme.accent : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Crude Humor 13+ Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Crude Humor 13+</Text>
          <View style={[styles.soundRow, { backgroundColor: currentTheme.darkSquare + '30' }]}>
            <View style={styles.soundInfo}>
              <Text style={[styles.soundSubLabel, { color: currentTheme.textSecondary }]}>
                {matureContentEnabled ? 'Visible in Store' : 'Hidden (13+ only)'}
              </Text>
            </View>
            <Switch
              value={matureContentEnabled}
              onValueChange={handleMatureContentToggle}
              trackColor={{ false: '#767577', true: '#dc2626' }}
              thumbColor={matureContentEnabled ? '#dc2626' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Board Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Board Theme</Text>
          <View style={styles.themeGrid}>
            {BOARD_THEMES.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  selectedTheme === theme.id && { borderColor: currentTheme.accent, borderWidth: 3 },
                ]}
                onPress={() => saveTheme(theme.id)}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.previewSquare, { backgroundColor: theme.lightSquare }]} />
                  <View style={[styles.previewSquare, { backgroundColor: theme.darkSquare }]} />
                  <View style={[styles.previewSquare, { backgroundColor: theme.darkSquare }]} />
                  <View style={[styles.previewSquare, { backgroundColor: theme.lightSquare }]} />
                </View>
                <Text style={[styles.themeName, { color: currentTheme.textPrimary }]}>
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Control */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Time Control</Text>
          <View style={styles.optionList}>
            {TIME_CONTROLS.map(tc => (
              <TouchableOpacity
                key={tc.id}
                style={[
                  styles.optionCard,
                  { backgroundColor: currentTheme.darkSquare + '30' },
                  selectedTimeControl === tc.id && { 
                    backgroundColor: currentTheme.accent + '30',
                    borderColor: currentTheme.accent,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => saveTimeControl(tc.id)}
              >
                <Text style={[
                  styles.optionText,
                  { color: selectedTimeControl === tc.id ? currentTheme.accent : currentTheme.textPrimary },
                ]}>
                  {tc.name}
                </Text>
                {selectedTimeControl === tc.id && (
                  <Text style={[styles.selectedText, { color: currentTheme.accent }]}>Selected</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Difficulty */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>AI Difficulty</Text>
          <View style={styles.optionList}>
            {AI_DIFFICULTIES.map(diff => (
              <TouchableOpacity
                key={diff.id}
                style={[
                  styles.difficultyCard,
                  { backgroundColor: currentTheme.darkSquare + '30' },
                  selectedDifficulty === diff.id && { 
                    backgroundColor: currentTheme.accent + '30',
                    borderColor: currentTheme.accent,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => saveDifficulty(diff.id)}
              >
                <View style={styles.difficultyInfo}>
                  <Text style={[
                    styles.difficultyName,
                    { color: selectedDifficulty === diff.id ? currentTheme.accent : currentTheme.textPrimary },
                  ]}>
                    {diff.name}
                  </Text>
                  <Text style={[styles.difficultyDesc, { color: currentTheme.textSecondary }]}>
                    {diff.description}
                  </Text>
                </View>
                {selectedDifficulty === diff.id && (
                  <Text style={[styles.selectedText, { color: currentTheme.accent }]}>Selected</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Age Verification Modal */}
      <Modal
        visible={showAgeVerification}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelAgeVerification}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.background }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>
              Age Verification
            </Text>
            <Text style={[styles.modalText, { color: currentTheme.textSecondary }]}>
              This content contains crude humor.
            </Text>
            <Text style={[styles.modalText, { color: currentTheme.textSecondary }]}>
              By enabling this, you confirm that you are at least 13 years old.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelAgeVerification}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAgeVerification}
              >
                <Text style={styles.confirmButtonText}>I am 13+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backButton: {
    padding: 8,
  },
  mainMenuText: {
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundLabel: {
    fontSize: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '30%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themePreview: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewSquare: {
    width: 30,
    height: 30,
  },
  themeName: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  optionList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
  soundSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  confirmButton: {
    backgroundColor: '#dc2626',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
