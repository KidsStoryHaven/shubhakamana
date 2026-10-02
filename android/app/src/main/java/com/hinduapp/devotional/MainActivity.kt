package com.hinduapp.devotional

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.hinduapp.devotional.navigation.Screen
import com.hinduapp.devotional.ui.theme.HinduAppTheme
import com.hinduapp.devotional.ui.screens.*

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Check if opened via push notification target
        val targetWallpaperId = intent?.getStringExtra("extra_wallpaper_id")

        setContent {
            HinduAppTheme {
                val navController = rememberNavController()
                val items = listOf(
                    Screen.Home,
                    Screen.Categories,
                    Screen.Favorites,
                    Screen.Quotes,
                    Screen.Settings
                )

                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        val showBottomBar = items.any { it.route == currentRoute }
                        if (showBottomBar) {
                            NavigationBar(
                                containerColor = MaterialTheme.colorScheme.surface,
                                contentColor = MaterialTheme.colorScheme.onSurface
                            ) {
                                items.forEach { screen ->
                                    val isSelected = currentRoute == screen.route
                                    NavigationBarItem(
                                        icon = {
                                            screen.icon?.let { icon ->
                                                Icon(imageVector = icon, contentDescription = screen.titleHi)
                                            }
                                        },
                                        label = { Text(screen.titleHi) },
                                        selected = isSelected,
                                        onClick = {
                                            navController.navigate(screen.route) {
                                                popUpTo(navController.graph.findStartDestination().id) {
                                                    saveState = true
                                                }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            indicatorColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
                                        )
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Home.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Home.route) {
                            HomeScreen(
                                onWallpaperClick = { wallpaperId ->
                                    navController.navigate(Screen.WallpaperDetail.createRoute(wallpaperId))
                                },
                                onCategoryClick = { categoryId, categoryName ->
                                    navController.navigate(Screen.CategoryWallpapers.createRoute(categoryId, categoryName))
                                }
                            )
                        }

                        composable(Screen.Categories.route) {
                            CategoriesScreen(
                                onCategoryClick = { categoryId, categoryName ->
                                    navController.navigate(Screen.CategoryWallpapers.createRoute(categoryId, categoryName))
                                }
                            )
                        }

                        composable(Screen.Favorites.route) {
                            FavoritesScreen(
                                onWallpaperClick = { wallpaperId ->
                                    navController.navigate(Screen.WallpaperDetail.createRoute(wallpaperId))
                                }
                            )
                        }

                        composable(Screen.Quotes.route) {
                            QuotesScreen()
                        }

                        composable(Screen.Settings.route) {
                            SettingsScreen()
                        }

                        composable(Screen.WallpaperDetail.route) { backStackEntry ->
                            val wallpaperId = backStackEntry.arguments?.getString("wallpaperId") ?: ""
                            WallpaperDetailScreen(
                                wallpaperId = wallpaperId,
                                onBackPress = { navController.popBackStack() }
                            )
                        }

                        composable(Screen.CategoryWallpapers.route) { backStackEntry ->
                            val categoryId = backStackEntry.arguments?.getString("categoryId") ?: ""
                            val categoryName = backStackEntry.arguments?.getString("categoryName") ?: ""
                            CategoryWallpapersScreen(
                                categoryId = categoryId,
                                categoryName = categoryName,
                                onWallpaperClick = { wallpaperId ->
                                    navController.navigate(Screen.WallpaperDetail.createRoute(wallpaperId))
                                },
                                onBackPress = { navController.popBackStack() }
                            )
                        }
                    }

                    // Handle deep-link notification jump on launch
                    LaunchedEffect(targetWallpaperId) {
                        if (!targetWallpaperId.isNullOrBlank()) {
                            navController.navigate(Screen.WallpaperDetail.createRoute(targetWallpaperId))
                        }
                    }
                }
            }
        }
    }
}
