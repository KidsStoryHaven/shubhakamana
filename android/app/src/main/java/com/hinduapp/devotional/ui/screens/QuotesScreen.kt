package com.hinduapp.devotional.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hinduapp.devotional.model.Quote

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuotesScreen() {
    val context = LocalContext.current

    val sampleQuotes = listOf(
        Quote(
            id = "1",
            hindiText = "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। फल की चिंता किए बिना निरंतर अपने श्रेष्ठ कर्तव्य का पालन करें।",
            sanskritText = "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            authorSource = "श्रीमद्भगवद्गीता (२.४७)",
            englishTranslation = "You have a right to perform your duties, but you are not entitled to the fruits."
        ),
        Quote(
            id = "2",
            hindiText = "सत्य और मर्यादा का मार्ग कठिन हो सकता है, परंतु अंततः विजय धर्म की ही होती है।",
            sanskritText = "रघुकुल रीति सदा चलि आई। प्राण जाहुं बरु बचनु न जाई॥",
            authorSource = "श्री रामचरितमानस",
            englishTranslation = "Righteousness and truth prevail through all adversity."
        ),
        Quote(
            id = "3",
            hindiText = "जब संकट घेरे, तो पवनपुत्र हनुमान जी का स्मरण करें। सच्ची भक्ति में समस्त बाधाओं को पार करने का सामर्थ्य है।",
            sanskritText = "संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥",
            authorSource = "श्री हनुमान चालीसा"
        )
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("अनमोल सुविचार (Devotional Quotes)", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(sampleQuotes) { quote ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = quote.authorSource,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.primary
                        )

                        if (quote.sanskritText.isNotBlank()) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.background.copy(alpha = 0.6f)
                            ) {
                                Text(
                                    text = quote.sanskritText,
                                    fontSize = 13.sp,
                                    modifier = Modifier.padding(10.dp),
                                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                                )
                            }
                        }

                        Text(
                            text = "\"${quote.hindiText}\"",
                            fontSize = 15.sp,
                            lineHeight = 22.sp,
                            fontWeight = FontWeight.Medium
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                val clip = ClipData.newPlainText("Quote", "${quote.hindiText}\n- ${quote.authorSource}")
                                clipboard.setPrimaryClip(clip)
                                Toast.makeText(context, "सुविचार कॉपी हो गया!", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copy")
                            }

                            IconButton(onClick = {
                                val sendIntent = Intent().apply {
                                    action = Intent.ACTION_SEND
                                    putExtra(Intent.EXTRA_TEXT, "${quote.hindiText}\n\n- ${quote.authorSource}\n(Hindu App)")
                                    type = "text/plain"
                                }
                                context.startActivity(Intent.createChooser(sendIntent, "सुविचार शेयर करें"))
                            }) {
                                Icon(Icons.Default.Share, contentDescription = "Share")
                            }
                        }
                    }
                }
            }
        }
    }
}
