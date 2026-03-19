import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesOffering } from 'react-native-purchases';

// RevenueCat API Key
const REVENUECAT_API_KEY = 'appl_FaCieREwGjzxVPHefCxkQUaKBMI';

// Product IDs - these would match your RevenueCat/App Store product IDs
export const PRODUCTS = {
  PREMIUM_UNLOCK: 'chess_premium_unlock',
  THEME_PACK_BLUE: 'chess_theme_blue',
  THEME_PACK_GREEN: 'chess_theme_green',
  THEME_PACK_PURPLE: 'chess_theme_purple',
  THEME_PACK_DARK: 'chess_theme_dark',
  THEME_PACK_CORAL: 'chess_theme_coral',
  REMOVE_ADS: 'chess_remove_ads',
  SUBSCRIPTION_MONTHLY: 'chess_pro_monthly',
  SUBSCRIPTION_YEARLY: 'chess_pro_yearly',
};

export const PRICES = {
  [PRODUCTS.PREMIUM_UNLOCK]: 4.00,
  [PRODUCTS.THEME_PACK_BLUE]: 1.00,
  [PRODUCTS.THEME_PACK_GREEN]: 1.00,
  [PRODUCTS.THEME_PACK_PURPLE]: 1.00,
  [PRODUCTS.THEME_PACK_DARK]: 1.00,
  [PRODUCTS.THEME_PACK_CORAL]: 1.00,
  [PRODUCTS.REMOVE_ADS]: 2.00,
  [PRODUCTS.SUBSCRIPTION_MONTHLY]: 1.40,
  [PRODUCTS.SUBSCRIPTION_YEARLY]: 3.00,
};

// Free themes available to all users
export const FREE_THEMES = ['classic'];

// Premium themes requiring purchase
export const PREMIUM_THEMES = ['blue', 'green', 'purple', 'dark', 'coral'];

interface PurchaseContextType {
  isPremium: boolean;
  isSubscribed: boolean;
  hasRemovedAds: boolean;
  purchasedThemes: string[];
  purchaseProduct: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  canAccessTheme: (themeId: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  showUpgradePrompt: (feature: string) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasRemovedAds, setHasRemovedAds] = useState(false);
  const [purchasedThemes, setPurchasedThemes] = useState<string[]>([]);

  useEffect(() => {
    loadPurchaseState();
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      // Configure RevenueCat with your API key
      if (Platform.OS !== 'web') {
        try {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
          await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
          console.log('RevenueCat initialized successfully!');
          
          // Check for existing purchases
          const customerInfo = await Purchases.getCustomerInfo();
          if (customerInfo.entitlements.active['premium']) {
            setIsPremium(true);
            setHasRemovedAds(true);
            setPurchasedThemes(PREMIUM_THEMES);
          }
          if (customerInfo.entitlements.active['pro_subscription']) {
            setIsSubscribed(true);
            setHasRemovedAds(true);
            setPurchasedThemes(PREMIUM_THEMES);
          }
        } catch (rcError) {
          // RevenueCat failed to initialize - continue without it
          console.log('RevenueCat unavailable, using offline mode:', rcError);
        }
      } else {
        console.log('RevenueCat: Running in web mode (simulated purchases)');
      }
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      // Don't crash - continue with offline mode
    }
  };

  const loadPurchaseState = async () => {
    try {
      const premium = await AsyncStorage.getItem('chess_isPremium');
      const subscribed = await AsyncStorage.getItem('chess_isSubscribed');
      const noAds = await AsyncStorage.getItem('chess_hasRemovedAds');
      const themes = await AsyncStorage.getItem('chess_purchasedThemes');

      if (premium === 'true') setIsPremium(true);
      if (subscribed === 'true') setIsSubscribed(true);
      if (noAds === 'true') setHasRemovedAds(true);
      if (themes) setPurchasedThemes(JSON.parse(themes));
    } catch (error) {
      console.error('Error loading purchase state:', error);
    }
  };

  const savePurchaseState = async () => {
    try {
      await AsyncStorage.setItem('chess_isPremium', isPremium.toString());
      await AsyncStorage.setItem('chess_isSubscribed', isSubscribed.toString());
      await AsyncStorage.setItem('chess_hasRemovedAds', hasRemovedAds.toString());
      await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(purchasedThemes));
    } catch (error) {
      console.error('Error saving purchase state:', error);
    }
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    try {
      // For native platforms, use RevenueCat
      if (Platform.OS !== 'web') {
        try {
          const { customerInfo } = await Purchases.purchaseProduct(productId);
          
          // Check entitlements after purchase
          if (customerInfo.entitlements.active['premium']) {
            setIsPremium(true);
            setHasRemovedAds(true);
            setPurchasedThemes(PREMIUM_THEMES);
            await AsyncStorage.setItem('chess_isPremium', 'true');
            await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
            await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(PREMIUM_THEMES));
          }
          if (customerInfo.entitlements.active['pro_subscription']) {
            setIsSubscribed(true);
            setHasRemovedAds(true);
            setPurchasedThemes(PREMIUM_THEMES);
            await AsyncStorage.setItem('chess_isSubscribed', 'true');
            await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
            await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(PREMIUM_THEMES));
          }
          if (customerInfo.entitlements.active['no_ads']) {
            setHasRemovedAds(true);
            await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
          }
          
          Alert.alert('Success!', 'Purchase completed successfully!');
          return true;
        } catch (purchaseError: any) {
          if (!purchaseError.userCancelled) {
            Alert.alert('Error', 'Purchase failed. Please try again.');
          }
          return false;
        }
      }
      
      // For web, simulate purchase (for testing)
      console.log(`Simulating purchase of: ${productId}`);
      
      switch (productId) {
        case PRODUCTS.PREMIUM_UNLOCK:
          setIsPremium(true);
          setHasRemovedAds(true);
          setPurchasedThemes(PREMIUM_THEMES);
          await AsyncStorage.setItem('chess_isPremium', 'true');
          await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(PREMIUM_THEMES));
          break;
          
        case PRODUCTS.REMOVE_ADS:
          setHasRemovedAds(true);
          await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
          break;
          
        case PRODUCTS.SUBSCRIPTION_MONTHLY:
        case PRODUCTS.SUBSCRIPTION_YEARLY:
          setIsSubscribed(true);
          setHasRemovedAds(true);
          setPurchasedThemes(PREMIUM_THEMES);
          await AsyncStorage.setItem('chess_isSubscribed', 'true');
          await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(PREMIUM_THEMES));
          break;
          
        case PRODUCTS.THEME_PACK_BLUE:
          const newThemesBlue = [...purchasedThemes, 'blue'];
          setPurchasedThemes(newThemesBlue);
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(newThemesBlue));
          break;
          
        case PRODUCTS.THEME_PACK_GREEN:
          const newThemesGreen = [...purchasedThemes, 'green'];
          setPurchasedThemes(newThemesGreen);
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(newThemesGreen));
          break;
          
        case PRODUCTS.THEME_PACK_PURPLE:
          const newThemesPurple = [...purchasedThemes, 'purple'];
          setPurchasedThemes(newThemesPurple);
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(newThemesPurple));
          break;
          
        case PRODUCTS.THEME_PACK_DARK:
          const newThemesDark = [...purchasedThemes, 'dark'];
          setPurchasedThemes(newThemesDark);
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(newThemesDark));
          break;
          
        case PRODUCTS.THEME_PACK_CORAL:
          const newThemesCoral = [...purchasedThemes, 'coral'];
          setPurchasedThemes(newThemesCoral);
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(newThemesCoral));
          break;
      }
      
      Alert.alert('Success!', 'Purchase completed successfully!');
      return true;
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
      return false;
    }
  };

  const restorePurchases = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { customerInfo } = await Purchases.restorePurchases();
        
        // Check restored entitlements
        if (customerInfo.entitlements.active['premium']) {
          setIsPremium(true);
          setHasRemovedAds(true);
          setPurchasedThemes(PREMIUM_THEMES);
          await AsyncStorage.setItem('chess_isPremium', 'true');
          await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
          await AsyncStorage.setItem('chess_purchasedThemes', JSON.stringify(PREMIUM_THEMES));
        }
        if (customerInfo.entitlements.active['pro_subscription']) {
          setIsSubscribed(true);
          setHasRemovedAds(true);
          setPurchasedThemes(PREMIUM_THEMES);
          await AsyncStorage.setItem('chess_isSubscribed', 'true');
        }
        if (customerInfo.entitlements.active['no_ads']) {
          setHasRemovedAds(true);
          await AsyncStorage.setItem('chess_hasRemovedAds', 'true');
        }
        
        Alert.alert('Restore Complete', 'Your purchases have been restored.');
      } else {
        Alert.alert('Restore Complete', 'Your purchases have been restored.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Could not restore purchases.');
    }
  };

  const canAccessTheme = (themeId: string): boolean => {
    if (FREE_THEMES.includes(themeId)) return true;
    if (isPremium || isSubscribed) return true;
    return purchasedThemes.includes(themeId);
  };

  const canAccessFeature = (feature: string): boolean => {
    switch (feature) {
      case 'custom_pieces':
        return isPremium || isSubscribed;
      case 'hard_ai':
        return isPremium || isSubscribed;
      case 'medium_ai':
        return isPremium || isSubscribed;
      case 'unlimited_saves':
        return isPremium || isSubscribed;
      case 'no_ads':
        return hasRemovedAds || isPremium || isSubscribed;
      default:
        return true;
    }
  };

  const showUpgradePrompt = (feature: string) => {
    let message = '';
    switch (feature) {
      case 'custom_pieces':
        message = 'Custom piece uploads are a premium feature.';
        break;
      case 'hard_ai':
      case 'medium_ai':
        message = 'Advanced AI difficulty is a premium feature.';
        break;
      case 'premium_theme':
        message = 'This theme requires a purchase.';
        break;
      default:
        message = 'This is a premium feature.';
    }
    
    Alert.alert(
      'Premium Feature',
      `${message}\n\nUpgrade to Premium for just $4 to unlock all features!`,
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'View Options', onPress: () => {} }, // Navigate to store
      ]
    );
  };

  return (
    <PurchaseContext.Provider
      value={{
        isPremium,
        isSubscribed,
        hasRemovedAds,
        purchasedThemes,
        purchaseProduct,
        restorePurchases,
        canAccessTheme,
        canAccessFeature,
        showUpgradePrompt,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
}
