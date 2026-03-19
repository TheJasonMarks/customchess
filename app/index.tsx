import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOARD_THEMES, BoardTheme, DEFAULT_THEME } from '../src/utils/themes';
import { soundManager } from '../src/utils/soundManager';
import { usePurchases } from '../src/contexts/PurchaseContext';
import AdBanner from '../src/components/AdBanner';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface PieceSet {
  id: string;
  name: string;
  pieces: Record<string, string>;
}

export default function HomeScreen() {
  const router = useRouter();
  const { isPremium, isSubscribed, hasRemovedAds, canAccessFeature } = usePurchases();
  const [pieceSets, setPieceSets] = useState<PieceSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPieceSetId, setSelectedPieceSetId] = useState<string | null>(null);
  const [theme, setTheme] = useState<BoardTheme>(DEFAULT_THEME);

  const showAds = !hasRemovedAds && !isPremium && !isSubscribed;

  useEffect(() => {
    loadTheme();
    fetchPieceSets();
    soundManager.loadSounds();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('chess_theme');
      if (savedTheme) {
        const foundTheme = BOARD_THEMES.find(t => t.id === savedTheme);
        if (foundTheme) setTheme(foundTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const fetchPieceSets = async () => {
    try {
      // Load piece sets from local storage (standalone mode)
      const savedPieceSets = await AsyncStorage.getItem('custom_piece_sets');
      if (savedPieceSets) {
        const data = JSON.parse(savedPieceSets);
        setPieceSets(data);
        if (data.length > 0) {
          setSelectedPieceSetId(data[0].id);
        }
      }
    } catch (error) {
      console.log('Error loading piece sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (vsAI: boolean) => {
    try {
      soundManager.playGameStart();
      
      // Generate a local game ID
      const gameId = 'game-' + Date.now();
      
      router.push({
        pathname: '/game',
        params: { 
          gameId: gameId, 
          pieceSetId: selectedPieceSetId || '',
          vsAI: vsAI ? 'true' : 'false',
        },
      });
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to start new game');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.storeButton}
          onPress={() => router.push('/web-store')}
        >
          <Text style={[styles.topBarText, { color: theme.textPrimary }]}>Store</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.topBarText, { color: theme.textPrimary }]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Custom Chess</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Family Photos as Pieces!</Text>
          
          {(isPremium || isSubscribed) && (
            <View style={styles.proBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: theme.accent }]} 
            onPress={() => startGame(false)}
          >
            <View style={styles.menuButtonContent}>
              <Text style={[styles.menuButtonText, { color: theme.background }]}>Two Players</Text>
              <Text style={[styles.menuButtonSubtext, { color: theme.background + 'aa' }]}>Pass & Play</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: theme.accent }]} 
            onPress={() => startGame(true)}
          >
            <View style={styles.menuButtonContent}>
              <Text style={[styles.menuButtonText, { color: theme.background }]}>vs Computer</Text>
              <Text style={[styles.menuButtonSubtext, { color: theme.background + 'aa' }]}>Single Player</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButtonSecondary, { borderColor: theme.accent }]}
            onPress={() => router.push('/customize')}
          >
            <Text style={[styles.menuButtonSecondaryText, { color: theme.accent }]}>Customize Pieces</Text>
            {!canAccessFeature('custom_pieces') ? (
              <Text style={[styles.lockText, { color: theme.textSecondary }]}>Locked</Text>
            ) : (
              <Text style={[styles.lockText, { color: theme.textSecondary }]}>Un-locked</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButtonSecondary, { borderColor: theme.accent }]}
            onPress={() => router.push('/tournament')}
          >
            <Text style={[styles.menuButtonSecondaryText, { color: theme.accent }]}>Tournament Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButtonSecondary, { borderColor: '#9333EA' }]}
            onPress={() => {
              if (Platform.OS === 'web') {
                alert('Online Play is Coming Soon! Check back in about a month.');
              } else {
                Alert.alert(
                  'Coming Soon!',
                  'Online multiplayer is coming soon! Check back in about a month.',
                  [{ text: 'OK' }]
                );
              }
            }}
          >
            <Text style={[styles.menuButtonSecondaryText, { color: '#9333EA' }]}>Online Play</Text>
            <Text style={[styles.lockText, { color: '#9333EA' }]}>Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButtonSecondary, { borderColor: theme.accent }]}
            onPress={() => router.push('/saved-games')}
          >
            <Text style={[styles.menuButtonSecondaryText, { color: theme.accent }]}>Saved Games</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButtonSecondary, { borderColor: '#10B981' }]}
            onPress={() => router.push('/tutorial')}
          >
            <Text style={[styles.menuButtonSecondaryText, { color: '#10B981' }]}>How to Play</Text>
            <Text style={[styles.lockText, { color: '#10B981' }]}>Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* Piece Set Selector */}
        {pieceSets.length > 0 && (
          <View style={styles.pieceSetContainer}>
            <Text style={[styles.pieceSetLabel, { color: theme.textSecondary }]}>Selected Piece Set:</Text>
            <View style={styles.pieceSetList}>
              {pieceSets.map((set) => (
                <TouchableOpacity
                  key={set.id}
                  style={[
                    styles.pieceSetChip,
                    { backgroundColor: theme.darkSquare + '30', borderColor: theme.darkSquare },
                    selectedPieceSetId === set.id && { backgroundColor: theme.accent, borderColor: theme.accent },
                  ]}
                  onPress={() => setSelectedPieceSetId(set.id)}
                >
                  <Text
                    style={[
                      styles.pieceSetChipText,
                      { color: theme.textSecondary },
                      selectedPieceSetId === set.id && { color: theme.background, fontWeight: '600' },
                    ]}
                  >
                    {set.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {loading && (
          <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
        )}

        {/* Copyright */}
        <View style={styles.copyrightContainer}>
          <Text style={[styles.copyrightText, { color: theme.textSecondary }]}>
            © 2026 Jason Marks. All rights reserved.
          </Text>
        </View>
        
        {/* Bottom padding for ad */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Ad Banner - Fixed at bottom */}
      <View style={styles.adContainer}>
        <AdBanner 
          showAds={showAds} 
          onUpgradePress={() => router.push('/web-store')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  storeButton: {
    padding: 8,
    position: 'relative',
  },
  saleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  saleBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  proBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 32,
    gap: 12,
  },
  menuButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuButtonContent: {
    flex: 1,
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuButtonSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  menuButtonSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
  },
  menuButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  lockText: {
    fontSize: 12,
    fontWeight: '400',
  },
  topBarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lockBadge: {
    backgroundColor: '#F59E0B20',
    padding: 4,
    borderRadius: 8,
  },
  pieceSetContainer: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
  pieceSetLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  pieceSetList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pieceSetChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  pieceSetChipText: {
    fontSize: 14,
  },
  loader: {
    marginTop: 32,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  bottomPadding: {
    height: 80,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  copyrightContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
