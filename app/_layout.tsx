import { Stack } from 'expo-router';
import { PurchaseProvider } from '../src/contexts/PurchaseContext';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { syncPurchasesToCookie } from '../src/utils/crossSubdomainStorage';

export default function RootLayout() {
  // Sync purchases to cross-subdomain cookie on app load
  useEffect(() => {
    if (Platform.OS === 'web') {
      syncPurchasesToCookie();
    }
  }, []);

  return (
    <PurchaseProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="customize" />
        <Stack.Screen name="saved-games" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="store" />
      </Stack>
    </PurchaseProvider>
  );
}
