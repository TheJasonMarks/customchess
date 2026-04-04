// Cross-subdomain storage utility for web
// Uses cookies with .customchess.net domain to share data across subdomains

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COOKIE_DOMAIN = '.customchess.net';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// Set a cookie that works across all subdomains
export const setCrossSubdomainCookie = (key: string, value: string): void => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      // On localhost, just use regular cookie without domain
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    } else {
      // On production, set cookie for all subdomains
      document.cookie = `${key}=${encodeURIComponent(value)}; domain=${COOKIE_DOMAIN}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
    }
  }
};

// Get a cookie value
export const getCrossSubdomainCookie = (key: string): string | null => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.trim().split('=');
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
  }
  return null;
};

// Save purchases to both AsyncStorage and cross-subdomain cookie
export const savePurchasesCrossSubdomain = async (purchases: string[]): Promise<void> => {
  const purchasesJson = JSON.stringify(purchases);
  
  // Save to AsyncStorage (for native and current domain)
  await AsyncStorage.setItem('web_purchases', purchasesJson);
  
  // Save to cross-subdomain cookie (for web across subdomains)
  setCrossSubdomainCookie('cc_purchases', purchasesJson);
};

// Load purchases from either cookie or AsyncStorage
export const loadPurchasesCrossSubdomain = async (): Promise<string[]> => {
  // First try to get from cross-subdomain cookie
  const cookieValue = getCrossSubdomainCookie('cc_purchases');
  if (cookieValue) {
    try {
      const purchases = JSON.parse(cookieValue);
      // Also sync to AsyncStorage for this domain
      await AsyncStorage.setItem('web_purchases', cookieValue);
      return purchases;
    } catch (e) {
      console.error('Error parsing cookie purchases:', e);
    }
  }
  
  // Fall back to AsyncStorage
  try {
    const saved = await AsyncStorage.getItem('web_purchases');
    if (saved) {
      const purchases = JSON.parse(saved);
      // Sync to cookie for cross-subdomain access
      setCrossSubdomainCookie('cc_purchases', saved);
      return purchases;
    }
  } catch (e) {
    console.error('Error loading purchases from AsyncStorage:', e);
  }
  
  return [];
};

// Sync existing purchases to cross-subdomain cookie (call this on app load)
export const syncPurchasesToCookie = async (): Promise<void> => {
  if (Platform.OS !== 'web') return;
  
  try {
    const saved = await AsyncStorage.getItem('web_purchases');
    if (saved) {
      setCrossSubdomainCookie('cc_purchases', saved);
    }
  } catch (e) {
    console.error('Error syncing purchases to cookie:', e);
  }
};
