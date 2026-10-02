package com.hinduapp.devotional.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class GodCategoryItem(val id: String, val nameHi: String, val icon: String, val count: Int)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoriesScreen(
    onCategoryClick: (String, String) -> Unit
) {
    val categories = listOf(
        GodCategoryItem("shiva", "महादेव शिव", "🔱", 48),
        GodCategoryItem("ram", "प्रभु श्री राम", "🏹", 35),
        GodCategoryItem("krishna", "श्री कृष्ण", "🦚", 42),
        GodCategoryItem("hanuman", "पवनपुत्र हनुमान", "🚩", 50),
        GodCategoryItem("ganesha", "गणेश जी", "🌸", 30),
        GodCategoryItem("durga", "माँ दुर्गा", "🌺", 28),
        GodCategoryItem("lakshmi", "माँ लक्ष्मी", "🪷", 22),
        GodCategoryItem("saraswati", "माँ सरस्वती", "📖", 18),
        GodCategoryItem("vishnu", "श्री हरि विष्णु", "🐚", 26),
        GodCategoryItem("shivling", "द्वादश ज्योतिर्लिंग", "🕉️", 36)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("भगवान श्रेणियाँ", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(categories) { cat ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp)
                        .clickable { onCategoryClick(cat.id, cat.nameHi) },
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(cat.icon, fontSize = 28.sp)
                        Column {
                            Text(cat.nameHi, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("${cat.count} वॉलपेपर", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
