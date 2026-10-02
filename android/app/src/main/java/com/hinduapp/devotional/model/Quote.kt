package com.hinduapp.devotional.model

import com.google.firebase.firestore.PropertyName

/**
 * Devotional Quote model mapping to Firestore 'quotes' collection
 */
data class Quote(
    @PropertyName("id") val id: String = "",
    @PropertyName("hindiText") val hindiText: String = "",
    @PropertyName("sanskritText") val sanskritText: String = "",
    @PropertyName("englishTranslation") val englishTranslation: String = "",
    @PropertyName("hindiMeaning") val hindiMeaning: String = "",
    @PropertyName("authorSource") val authorSource: String = "",
    @PropertyName("categoryId") val categoryId: String = "",
    @PropertyName("imageUrl") val imageUrl: String = "",
    @PropertyName("isFeatured") val isFeatured: Boolean = false,
    @PropertyName("isActive") val isActive: Boolean = true,
    @PropertyName("likesCount") val likesCount: Long = 0,
    @PropertyName("createdAt") val createdAt: Long = System.currentTimeMillis()
)
