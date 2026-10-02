package com.hinduapp.devotional.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.hinduapp.devotional.util.WallpaperHelper
import com.hinduapp.devotional.util.WallpaperTarget
import kotlinx.coroutines.launch

@Composable
fun WallpaperDetailScreen(
    wallpaperId: String,
    onBackPress: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var showSetDialog by remember { mutableStateOf(false) }
    var isDownloading by remember { mutableStateOf(false) }
    var isFavorite by remember { mutableStateOf(false) }

    // Placeholder sample URL; in full flow, fetched from repository by wallpaperId
    val imageUrl = "https://images.unsplash.com/photo-1545620956-659f131a9829"

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // Fullscreen wallpaper image
        AsyncImage(
            model = imageUrl,
            contentDescription = "Wallpaper",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Top bar back and favorite
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 40.dp, start = 16.dp, end = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(
                onClick = onBackPress,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.5f))
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            IconButton(
                onClick = {
                    isFavorite = !isFavorite
                    Toast.makeText(context, if (isFavorite) "पसंदीदा में जोड़ा गया" else "हटाया गया", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.5f))
            ) {
                Icon(
                    if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = if (isFavorite) Color.Red else Color.White
                )
            }
        }

        // Bottom Action Controls
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    androidx.compose.ui.graphics.Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.9f))
                    )
                )
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Download Button
                Button(
                    onClick = {
                        coroutineScope.launch {
                            isDownloading = true
                            val result = WallpaperHelper.saveWallpaperToGallery(context, imageUrl, "Hindu Wallpaper")
                            isDownloading = false
                            if (result.isSuccess) {
                                Toast.makeText(context, "वॉलपेपर गैलरी में सेव हो गया! 📱", Toast.LENGTH_LONG).show()
                            } else {
                                Toast.makeText(context, "डाउनलोड त्रुटि", Toast.LENGTH_SHORT).show()
                            }
                        }
                    },
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.Default.Download, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (isDownloading) "डाउनलोड हो रहा है..." else "डाउनलोड करें")
                }

                // Set as Wallpaper Button
                Button(
                    onClick = { showSetDialog = true },
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Icon(Icons.Default.Wallpaper, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("वॉलपेपर सेट करें", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            // Share text button
            TextButton(
                onClick = {
                    coroutineScope.launch {
                        WallpaperHelper.shareWallpaper(context, imageUrl, "Hindu App Wallpaper", "हर हर महादेव 🚩")
                    }
                }
            ) {
                Icon(Icons.Default.Share, contentDescription = null, tint = Color.White)
                Spacer(modifier = Modifier.width(6.dp))
                Text("मित्रों के साथ शेयर करें", color = Color.White)
            }
        }

        // Set Wallpaper Dialog
        if (showSetDialog) {
            AlertDialog(
                onDismissRequest = { showSetDialog = false },
                title = { Text("वॉलपेपर सेट करें") },
                text = { Text("आप इस वॉलपेपर को कहाँ सेट करना चाहते हैं?") },
                confirmButton = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(
                            onClick = {
                                coroutineScope.launch {
                                    val res = WallpaperHelper.setWallpaper(context, imageUrl, WallpaperTarget.HOME_SCREEN)
                                    showSetDialog = false
                                    if (res.isSuccess) Toast.makeText(context, "होम स्क्रीन पर सेट हुआ!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        ) {
                            Text("1. होम स्क्रीन (Home Screen)")
                        }
                        TextButton(
                            onClick = {
                                coroutineScope.launch {
                                    val res = WallpaperHelper.setWallpaper(context, imageUrl, WallpaperTarget.LOCK_SCREEN)
                                    showSetDialog = false
                                    if (res.isSuccess) Toast.makeText(context, "लॉक स्क्रीन पर सेट हुआ!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        ) {
                            Text("2. लॉक स्क्रीन (Lock Screen)")
                        }
                        TextButton(
                            onClick = {
                                coroutineScope.launch {
                                    val res = WallpaperHelper.setWallpaper(context, imageUrl, WallpaperTarget.BOTH)
                                    showSetDialog = false
                                    if (res.isSuccess) Toast.makeText(context, "दोनों स्क्रीन पर सेट हुआ!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        ) {
                            Text("3. दोनों (Both Screen)")
                        }
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showSetDialog = false }) {
                        Text("रद्द करें")
                    }
                }
            )
        }
    }
}
