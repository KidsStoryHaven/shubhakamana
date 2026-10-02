package com.hinduapp.devotional.ads

import android.app.Activity
import android.content.Context
import android.view.View
import android.widget.LinearLayout
import com.facebook.ads.*
import com.hinduapp.devotional.model.AdsConfig

/**
 * Meta Audience Network (Facebook Ads) Manager
 * Architected with remote frequency capping and graceful fallback
 */
object AdManager {

    private var interstitialAd: InterstitialAd? = null
    private var isInterstitialLoaded = false
    private var actionClickCounter = 0

    /**
     * Load Interstitial Ad
     * "यहाँ अपना Meta Interstitial Placement ID जोड़ें"
     */
    fun loadInterstitialAd(context: Context, placementId: String) {
        if (placementId.isBlank()) return

        interstitialAd = InterstitialAd(context, placementId)
        val listener = object : InterstitialAdListener {
            override fun onInterstitialDisplayed(ad: Ad?) {
                isInterstitialLoaded = false
            }

            override fun onInterstitialDismissed(ad: Ad?) {
                // Preload next ad
                loadInterstitialAd(context, placementId)
            }

            override fun onError(ad: Ad?, error: AdError?) {
                isInterstitialLoaded = false
            }

            override fun onAdLoaded(ad: Ad?) {
                isInterstitialLoaded = true
            }

            override fun onAdClicked(ad: Ad?) {}
            override fun onLoggingImpression(ad: Ad?) {}
        }

        interstitialAd?.loadAd(
            interstitialAd?.buildLoadAdConfig()
                ?.withAdListener(listener)
                ?.build()
        )
    }

    /**
     * Show interstitial ad based on remote frequency clicks (e.g. every 4th wallpaper click)
     */
    fun showInterstitialIfAllowed(
        activity: Activity,
        adsConfig: AdsConfig,
        onAdClosedOrSkipped: () -> Unit
    ) {
        if (!adsConfig.isAdsEnabled) {
            onAdClosedOrSkipped()
            return
        }

        actionClickCounter++
        val targetInterval = if (adsConfig.interstitialIntervalClicks > 0) adsConfig.interstitialIntervalClicks else 4

        if (actionClickCounter % targetInterval == 0 && isInterstitialLoaded && interstitialAd?.isAdLoaded == true) {
            interstitialAd?.show()
            onAdClosedOrSkipped()
        } else {
            onAdClosedOrSkipped()
        }
    }

    /**
     * Create Banner Ad View for Home or Wallpaper Screen
     * "यहाँ अपना Meta Banner Placement ID जोड़ें"
     */
    fun createBannerAd(context: Context, placementId: String): View? {
        if (placementId.isBlank()) return null

        val adView = AdView(context, placementId, AdSize.BANNER_HEIGHT_50)
        adView.loadAd()
        return adView
    }
}
