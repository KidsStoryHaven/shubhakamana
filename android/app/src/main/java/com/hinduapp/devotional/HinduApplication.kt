package com.hinduapp.devotional

import android.app.Application
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.disk.DiskCache
import coil.memory.MemoryCache
import coil.request.CachePolicy
import com.facebook.ads.AudienceNetworkAds

class HinduApplication : Application(), ImageLoaderFactory {

    override fun onCreate() {
        super.onCreate()

        // 1. Initialize Meta Audience Network (Facebook Ads) SDK
        // In debug mode, you can add test devices
        AudienceNetworkAds.initialize(this)

        // 2. Firebase initializes automatically through google-services.json
    }

    /**
     * High performance image caching config for 4K and Thumbnail wallpapers
     */
    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .memoryCache {
                MemoryCache.Builder(this)
                    .maxSizePercent(0.25) // 25% of app memory for cached bitmaps
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("wallpaper_image_cache"))
                    .maxSizeBytes(150L * 1024 * 1024) // 150 MB disk cache for offline viewing
                    .build()
            }
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .respectCacheHeaders(false) // Cache images aggressively for smooth scrolling
            .crossfade(true)
            .build()
    }
}
