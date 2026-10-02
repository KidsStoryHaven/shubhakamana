package com.hinduapp.devotional.model

import com.google.firebase.firestore.PropertyName

/**
 * App Settings mapping to Firestore 'app_settings/general' document
 */
data class AppSettings(
    @PropertyName("appName") val appName: String = "Hindu App",
    @PropertyName("contactEmail") val contactEmail: String = "support@hinduapp.com",
    @PropertyName("privacyPolicyUrl") val privacyPolicyUrl: String = "https://hinduapp.com/privacy",
    @PropertyName("shareMessage") val shareMessage: String = "Download divine 4K Hindu wallpapers and daily quotes on Hindu App!",
    @PropertyName("latestAppVersion") val latestAppVersion: String = "1.0.0",
    @PropertyName("isMaintenanceMode") val isMaintenanceMode: Boolean = false,
    @PropertyName("dailyWallpaperId") val dailyWallpaperId: String = "",
    @PropertyName("dailyQuoteId") val dailyQuoteId: String = ""
)

/**
 * Dynamic Ads Configuration mapping to Firestore 'ads_config/main' document
 */
data class AdsConfig(
    @PropertyName("isAdsEnabled") val isAdsEnabled: Boolean = false,
    @PropertyName("adProvider") val adProvider: String = "meta", // "meta" or "admob"
    @PropertyName("metaAppId") val metaAppId: String = "",
    @PropertyName("metaBannerPlacementId") val metaBannerPlacementId: String = "",
    @PropertyName("metaInterstitialPlacementId") val metaInterstitialPlacementId: String = "",
    @PropertyName("metaNativePlacementId") val metaNativePlacementId: String = "",
    @PropertyName("interstitialIntervalClicks") val interstitialIntervalClicks: Int = 4, // Show interstitial every 4 clicks
    @PropertyName("admobBannerId") val admobBannerId: String = "",
    @PropertyName("admobInterstitialId") val admobInterstitialId: String = ""
)
