package com.hinduapp.devotional.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.hinduapp.devotional.model.Category
import com.hinduapp.devotional.model.Wallpaper
import com.hinduapp.devotional.model.Quote
import com.hinduapp.devotional.model.AppSettings
import com.hinduapp.devotional.model.AdsConfig
import kotlinx.coroutines.tasks.await

class HinduRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    private val categoriesCollection = firestore.collection("categories")
    private val wallpapersCollection = firestore.collection("wallpapers")
    private val quotesCollection = firestore.collection("quotes")
    private val settingsDoc = firestore.collection("app_settings").document("general")
    private val adsDoc = firestore.collection("ads_config").document("main")

    suspend fun getCategories(): Result<List<Category>> = runCatching {
        val snapshot = categoriesCollection
            .whereEqualTo("isActive", true)
            .orderBy("orderIndex", Query.Direction.ASCENDING)
            .get()
            .await()
        snapshot.toObjects(Category::class.java)
    }

    suspend fun getFeaturedWallpapers(limit: Long = 10): Result<List<Wallpaper>> = runCatching {
        val snapshot = wallpapersCollection
            .whereEqualTo("isActive", true)
            .whereEqualTo("isFeatured", true)
            .orderBy("orderIndex", Query.Direction.ASCENDING)
            .limit(limit)
            .get()
            .await()
        snapshot.toObjects(Wallpaper::class.java)
    }

    suspend fun getLatestWallpapers(limit: Long = 20): Result<List<Wallpaper>> = runCatching {
        val snapshot = wallpapersCollection
            .whereEqualTo("isActive", true)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(limit)
            .get()
            .await()
        snapshot.toObjects(Wallpaper::class.java)
    }

    suspend fun getWallpapersByCategory(categoryId: String): Result<List<Wallpaper>> = runCatching {
        val snapshot = wallpapersCollection
            .whereEqualTo("isActive", true)
            .whereEqualTo("categoryId", categoryId)
            .orderBy("orderIndex", Query.Direction.ASCENDING)
            .get()
            .await()
        snapshot.toObjects(Wallpaper::class.java)
    }

    suspend fun getWallpaperById(id: String): Result<Wallpaper?> = runCatching {
        val doc = wallpapersCollection.document(id).get().await()
        doc.toObject(Wallpaper::class.java)
    }

    suspend fun incrementWallpaperDownloads(id: String) {
        runCatching {
            wallpapersCollection.document(id)
                .update("downloadsCount", com.google.firebase.firestore.FieldValue.increment(1))
                .await()
        }
    }

    suspend fun incrementWallpaperViews(id: String) {
        runCatching {
            wallpapersCollection.document(id)
                .update("viewsCount", com.google.firebase.firestore.FieldValue.increment(1))
                .await()
        }
    }

    suspend fun getQuotes(limit: Long = 30): Result<List<Quote>> = runCatching {
        val snapshot = quotesCollection
            .whereEqualTo("isActive", true)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(limit)
            .get()
            .await()
        snapshot.toObjects(Quote::class.java)
    }

    suspend fun getAppSettings(): Result<AppSettings> = runCatching {
        val doc = settingsDoc.get().await()
        doc.toObject(AppSettings::class.java) ?: AppSettings()
    }

    suspend fun getAdsConfig(): Result<AdsConfig> = runCatching {
        val doc = adsDoc.get().await()
        doc.toObject(AdsConfig::class.java) ?: AdsConfig()
    }
}
