package com.hinduapp.devotional.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.FormatQuote
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val titleHi: String, val icon: ImageVector? = null) {
    // Bottom Bar tabs
    object Home : Screen("home", "होम", Icons.Default.Home)
    object Categories : Screen("categories", "श्रेणियाँ", Icons.Default.Category)
    object Favorites : Screen("favorites", "पसंदीदा", Icons.Default.Favorite)
    object Quotes : Screen("quotes", "सुविचार", Icons.Default.FormatQuote)
    object Settings : Screen("settings", "सेटिंग्स", Icons.Default.Settings)

    // Inner Screens
    object WallpaperDetail : Screen("wallpaper_detail/{wallpaperId}", "वॉलपेपर") {
        fun createRoute(wallpaperId: String) = "wallpaper_detail/$wallpaperId"
    }

    object CategoryWallpapers : Screen("category_wallpapers/{categoryId}/{categoryName}", "श्रेणी वॉलपेपर") {
        fun createRoute(categoryId: String, categoryName: String) = "category_wallpapers/$categoryId/$categoryName"
    }

    object Search : Screen("search", "खोजें")
}
