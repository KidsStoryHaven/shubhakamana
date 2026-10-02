package com.hinduapp.devotional.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Build
import androidx.core.app.NotificationCompat
import coil.ImageLoader
import coil.request.ImageRequest
import coil.request.SuccessResult
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.hinduapp.devotional.MainActivity
import com.hinduapp.devotional.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class HinduFcmService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Token can be sent to backend if per-user targeting is needed
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.data["title"] ?: remoteMessage.notification?.title ?: "Hindu App"
        val body = remoteMessage.data["body"] ?: remoteMessage.notification?.body ?: "नया दिव्य दर्शन उपलब्ध है"
        val imageUrl = remoteMessage.data["imageUrl"] ?: remoteMessage.notification?.imageUrl?.toString()
        val targetWallpaperId = remoteMessage.data["targetWallpaperId"]

        CoroutineScope(Dispatchers.IO).launch {
            var bigBitmap: Bitmap? = null
            if (!imageUrl.isNullOrBlank()) {
                val loader = ImageLoader(applicationContext)
                val req = ImageRequest.Builder(applicationContext)
                    .data(imageUrl)
                    .allowHardware(false)
                    .build()
                val result = (loader.execute(req) as? SuccessResult)?.drawable
                bigBitmap = (result as? android.graphics.drawable.BitmapDrawable)?.bitmap
            }

            showNotification(title, body, bigBitmap, targetWallpaperId)
        }
    }

    private fun showNotification(
        title: String,
        body: String,
        bigPicture: Bitmap?,
        targetWallpaperId: String?
    ) {
        val channelId = "devotional_updates"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "दैनिक दर्शन एवं वॉलपेपर",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "दैनिक नए भगवान वॉलपेपर और सुविचार अपडेट्स"
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            if (!targetWallpaperId.isNullOrBlank()) {
                putExtra("extra_wallpaper_id", targetWallpaperId)
            }
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Replace with R.drawable.ic_notification
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        if (bigPicture != null) {
            builder.setStyle(
                NotificationCompat.BigPictureStyle()
                    .bigPicture(bigPicture)
                    .setSummaryText(body)
            )
        } else {
            builder.setStyle(NotificationCompat.BigTextStyle().bigText(body))
        }

        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }
}
