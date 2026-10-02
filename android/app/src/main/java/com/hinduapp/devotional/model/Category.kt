package com.hinduapp.devotional.model

import com.google.firebase.firestore.PropertyName

/**
 * Category data model mapping directly to Firestore 'categories' collection
 */
data class Category(
    @PropertyName("id") val id: String = "",
    @PropertyName("nameHi") val nameHi: String = "",
    @PropertyName("nameEn") val nameEn: String = "",
    @PropertyName("slug") val slug: String = "",
    @PropertyName("iconUrl") val iconUrl: String = "",
    @PropertyName("orderIndex") val orderIndex: Int = 0,
    @PropertyName("isActive") val isActive: Boolean = true,
    @PropertyName("createdAt") val createdAt: Long = System.currentTimeMillis()
)
