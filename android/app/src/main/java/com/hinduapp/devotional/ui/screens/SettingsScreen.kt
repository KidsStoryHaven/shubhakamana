package com.hinduapp.devotional.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen() {
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("सेटिंग्स (Settings)", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // App Branding card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("🕉️", fontSize = 40.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Hindu App", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Text("संस्करण: 1.0.0 (Production Ready)", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            // Setting items list
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("मित्रों के साथ शेयर करें") },
                        supportingContent = { Text("Hindu App को अपने परिवार व मित्रों को भेजें") },
                        leadingContent = { Icon(Icons.Default.Share, contentDescription = null) },
                        modifier = Modifier.clickable {
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, "Download Hindu App for daily 4K wallpapers & quotes! https://play.google.com/store/apps/details?id=com.hinduapp.devotional")
                            }
                            context.startActivity(Intent.createChooser(intent, "शेयर करें"))
                        }
                    )

                    HorizontalDivider()

                    ListItem(
                        headlineContent = { Text("गोपनीयता नीति (Privacy Policy)") },
                        supportingContent = { Text("Play Store के लिए अनिवार्य प्राइवेसी पालिसी") },
                        leadingContent = { Icon(Icons.Default.PrivacyTip, contentDescription = null) },
                        modifier = Modifier.clickable {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://hinduapp.com/privacy"))
                            context.startActivity(intent)
                        }
                    )

                    HorizontalDivider()

                    ListItem(
                        headlineContent = { Text("संपर्क एवं सहायता (Contact)") },
                        supportingContent = { Text("support@hinduapp.com") },
                        leadingContent = { Icon(Icons.Default.Email, contentDescription = null) },
                        modifier = Modifier.clickable {
                            val intent = Intent(Intent.ACTION_SENDTO).apply {
                                data = Uri.parse("mailto:support@hinduapp.com")
                                putExtra(Intent.EXTRA_SUBJECT, "Hindu App Feedback")
                            }
                            context.startActivity(intent)
                        }
                    )
                }
            }
        }
    }
}
