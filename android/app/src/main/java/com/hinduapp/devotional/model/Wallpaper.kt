package com.hinduapp.devotional.model

import com.google.firebase.firestore.PropertyName

/**
 * Wallpaper data model mapping directly to Firestore 'wallpapers' collection
 */
data class Wallpaper(
    @PropertyName("id") val id: String = "",
    @PropertyName("titleHi") val titleHi: String = "",
    @PropertyName("titleEn") val titleEn: String = "",
    @PropertyName("descriptionHi") val descriptionHi: String = "",
    @PropertyName("categoryId") val categoryId: String = "",
    @PropertyName("categoryName") val categoryName: String = "",
    @PropertyName("thumbnailUrl") val thumbnailUrl: String = "",
    @PropertyName("fullImageUrl") val fullImageUrl: String = "",
    @PropertyName("resolution") val resolution: String = "4K Ultra HD",
    @PropertyName("downloadsCount") val downloadsCount: Long = 0,
    @PropertyName("viewsCount") val viewsCount: Long = 0,
    @PropertyName("isFeatured") val isFeatured: Boolean = false,
    @PropertyName("isLatest") val isLatest: Boolean = true,
    @PropertyName("isActive") val isActive: Boolean = true,
    @PropertyName("orderIndex") val orderIndex: Int = 0,
    @PropertyName("tags") val tags: List<String> = emptyList(),
    @PropertyName("mantraHi") val mantraHi: String = "",
    @PropertyName("createdAt") val createdAt: Long = System.currentTimeMillis()
)
