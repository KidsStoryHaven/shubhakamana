package com.hinduapp.devotional.util

import android.app.WallpaperManager
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import coil.ImageLoader
import coil.request.ImageRequest
import coil.request.SuccessResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

enum class WallpaperTarget {
    HOME_SCREEN,
    LOCK_SCREEN,
    BOTH
}

object WallpaperHelper {

    /**
     * Download bitmap from URL using Coil
     */
    suspend fun loadBitmapFromUrl(context: Context, imageUrl: String): Bitmap? = withContext(Dispatchers.IO) {
        val loader = ImageLoader(context)
        val request = ImageRequest.Builder(context)
            .data(imageUrl)
            .allowHardware(false) // Software bitmap required for WallpaperManager
            .build()
        val result = (loader.execute(request) as? SuccessResult)?.drawable
        (result as? BitmapDrawable)?.bitmap
    }

    /**
     * Set wallpaper to Home Screen, Lock Screen, or Both
     */
    suspend fun setWallpaper(
        context: Context,
        imageUrl: String,
        target: WallpaperTarget
    ): Result<Boolean> = withContext(Dispatchers.IO) {
        runCatching {
            val bitmap = loadBitmapFromUrl(context, imageUrl)
                ?: throw IllegalStateException("इमेज लोड नहीं हो सकी")

            val wallpaperManager = WallpaperManager.getInstance(context)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                when (target) {
                    WallpaperTarget.HOME_SCREEN -> {
                        wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
                    }
                    WallpaperTarget.LOCK_SCREEN -> {
                        wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
                    }
                    WallpaperTarget.BOTH -> {
                        wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK)
                    }
                }
            } else {
                // Older Android version fallback (sets home screen)
                wallpaperManager.setBitmap(bitmap)
            }
            true
        }
    }

    /**
     * Save high-resolution wallpaper to device Media/Gallery
     */
    suspend fun saveWallpaperToGallery(
        context: Context,
        imageUrl: String,
        title: String
    ): Result<Uri?> = withContext(Dispatchers.IO) {
        runCatching {
            val bitmap = loadBitmapFromUrl(context, imageUrl)
                ?: throw IllegalStateException("इमेज डाउनलोड नहीं हो सकी")

            val filename = "HinduApp_${System.currentTimeMillis()}.jpg"
            var outputStream: OutputStream? = null
            var imageUri: Uri? = null

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val contentValues = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                    put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/HinduApp")
                }
                val resolver = context.contentResolver
                imageUri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)
                if (imageUri != null) {
                    outputStream = resolver.openOutputStream(imageUri)
                }
            } else {
                val imagesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).toString() + "/HinduApp"
                val file = File(imagesDir)
                if (!file.exists()) file.mkdirs()
                val imageFile = File(imagesDir, filename)
                outputStream = FileOutputStream(imageFile)
                imageUri = Uri.fromFile(imageFile)
            }

            outputStream?.use {
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, it)
            }

            imageUri
        }
    }

    /**
     * Share wallpaper image via Android Share Sheet
     */
    suspend fun shareWallpaper(
        context: Context,
        imageUrl: String,
        title: String,
        caption: String
    ) = withContext(Dispatchers.IO) {
        val bitmap = loadBitmapFromUrl(context, imageUrl) ?: return@withContext
        val cachePath = File(context.cacheDir, "shared_images")
        cachePath.mkdirs()
        val file = File(cachePath, "shared_wallpaper.jpg")
        val stream = FileOutputStream(file)
        bitmap.compress(Bitmap.CompressFormat.JPEG, 95, stream)
        stream.close()

        val contentUri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            file
        )

        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            setDataAndType(contentUri, context.contentResolver.getType(contentUri))
            putExtra(Intent.EXTRA_STREAM, contentUri)
            putExtra(Intent.EXTRA_TEXT, "$title\n$caption\n\nDownload Hindu App for daily 4K wallpapers!")
            type = "image/jpeg"
        }
        val chooser = Intent.createChooser(shareIntent, "वॉलपेपर शेयर करें").apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(chooser)
    }
}
