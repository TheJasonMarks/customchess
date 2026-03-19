import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePurchases, PRODUCTS, PRICES } from '../src/contexts/PurchaseContext';

export default function StoreScreen() {
  const router = useRouter();
  const { 
    isPremium, 
    isSubscribed, 
    hasRemovedAds, 
    purchasedThemes,
    purchaseProduct,
    restorePurchases 
  } = usePurchases();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const renderProduct = (
    id: string,
    title: string,
    description: string,
    icon: string,
    isPurchased: boolean
  ) => (
    <TouchableOpacity
      key={id}
      style={[
        styles.productCard,
        isPurchased && styles.productCardPurchased,
      ]}
      onPress={() => !isPurchased && purchaseProduct(id)}
      disabled={isPurchased}
    >
      <View style={styles.productIcon}>
        <Ionicons name={icon as any} size={32} color={isPurchased ? '#4CAF50' : '#E8D5B7'} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productDescription}>{description}</Text>
      </View>
      <View style={styles.productPrice}>
        {isPurchased ? (
          <View style={styles.purchasedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.purchasedText}>Owned</Text>
          </View>
        ) : (
          <Text style={styles.priceText}>{formatPrice(PRICES[id])}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E8D5B7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store</Text>
        <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Banner */}
        {!isPremium && !isSubscribed && (
          <View style={styles.premiumBanner}>
            <Ionicons name="star" size={40} color="#F59E0B" />
            <Text style={styles.premiumTitle}>Custom Chess Premium</Text>
            <Text style={styles.premiumDescription}>
              Turn family game night into something special!
            </Text>
            <View style={styles.premiumFeatures}>
              <Text style={styles.featureItem}>✓ All 6 Board Themes</Text>
              <Text style={styles.featureItem}>✓ Advanced AI (Medium & Hard)</Text>
              <Text style={styles.featureItem}>✓ Unlimited Family Photo Uploads</Text>
              <Text style={styles.featureItem}>✓ No Ads Forever</Text>
              <Text style={styles.featureItem}>✓ Unlimited Saved Games</Text>
            </View>
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => purchaseProduct(PRODUCTS.PREMIUM_UNLOCK)}
            >
              <Text style={styles.premiumButtonText}>Get Premium - $4.00</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Subscriptions */}
        <Text style={styles.sectionTitle}>Subscriptions</Text>
        <View style={styles.subscriptionRow}>
          <TouchableOpacity
            style={[
              styles.subscriptionCard,
              isSubscribed && styles.subscriptionCardActive,
            ]}
            onPress={() => !isSubscribed && purchaseProduct(PRODUCTS.SUBSCRIPTION_MONTHLY)}
            disabled={isSubscribed}
          >
            <Text style={styles.subscriptionPeriod}>Monthly</Text>
            <Text style={styles.subscriptionPrice}>$1.40</Text>
            <Text style={styles.subscriptionNote}>per month</Text>
            {isSubscribed && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subscriptionCard,
              styles.subscriptionCardBest,
              isSubscribed && styles.subscriptionCardActive,
            ]}
            onPress={() => !isSubscribed && purchaseProduct(PRODUCTS.SUBSCRIPTION_YEARLY)}
            disabled={isSubscribed}
          >
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>Best Value</Text>
            </View>
            <Text style={styles.subscriptionPeriod}>Yearly</Text>
            <Text style={styles.subscriptionPrice}>$3.00</Text>
            <Text style={styles.subscriptionNote}>per year</Text>
            <Text style={styles.savings}>Save 82%!</Text>
            {isSubscribed && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Individual Purchases */}
        <Text style={styles.sectionTitle}>One-Time Purchases</Text>
        
        {renderProduct(
          PRODUCTS.REMOVE_ADS,
          'Remove Ads',
          'Remove all advertisements forever',
          'eye-off',
          hasRemovedAds
        )}

        {/* Theme Packs */}
        <Text style={styles.sectionTitle}>Theme Packs</Text>
        
        {renderProduct(
          PRODUCTS.THEME_PACK_BLUE,
          'Ocean Blue Theme',
          'Cool blue color scheme',
          'water',
          purchasedThemes.includes('blue') || isPremium || isSubscribed
        )}
        
        {renderProduct(
          PRODUCTS.THEME_PACK_GREEN,
          'Forest Green Theme',
          'Natural green color scheme',
          'leaf',
          purchasedThemes.includes('green') || isPremium || isSubscribed
        )}
        
        {renderProduct(
          PRODUCTS.THEME_PACK_PURPLE,
          'Royal Purple Theme',
          'Elegant purple color scheme',
          'sparkles',
          purchasedThemes.includes('purple') || isPremium || isSubscribed
        )}
        
        {renderProduct(
          PRODUCTS.THEME_PACK_DARK,
          'Midnight Theme',
          'Dark mode color scheme',
          'moon',
          purchasedThemes.includes('dark') || isPremium || isSubscribed
        )}
        
        {renderProduct(
          PRODUCTS.THEME_PACK_CORAL,
          'Coral Sunset Theme',
          'Warm sunset color scheme',
          'sunny',
          purchasedThemes.includes('coral') || isPremium || isSubscribed
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Purchases are processed securely through the app store.
            Subscriptions auto-renew unless cancelled.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E8D5B7',
  },
  restoreButton: {
    padding: 8,
  },
  restoreText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  premiumBanner: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginTop: 12,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  premiumFeatures: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  featureItem: {
    color: '#E8D5B7',
    fontSize: 14,
    marginVertical: 4,
  },
  premiumButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  premiumButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8D5B7',
    marginTop: 16,
    marginBottom: 12,
  },
  subscriptionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subscriptionCard: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subscriptionCardBest: {
    borderColor: '#4CAF50',
  },
  subscriptionCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#2d4a2d',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bestValueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subscriptionPeriod: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
  },
  subscriptionPrice: {
    color: '#E8D5B7',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subscriptionNote: {
    color: '#6B7280',
    fontSize: 12,
  },
  savings: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  productCardPurchased: {
    opacity: 0.7,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    color: '#E8D5B7',
    fontSize: 16,
    fontWeight: '600',
  },
  productDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  purchasedText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  footer: {
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
