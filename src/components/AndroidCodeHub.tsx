import React, { useState } from 'react';
import { Copy, Check, FileCode, Play, Sparkles, Shield, Layers } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  category: 'build' | 'manifest' | 'kotlin' | 'security';
  description: string;
  code: string;
}

const ANDROID_FILES: CodeFile[] = [
  {
    name: 'app/build.gradle.kts',
    path: 'android/app/build.gradle.kts',
    category: 'build',
    description: 'Android Module Gradle configuration with Jetpack Compose, Firebase BOM, Coil, and Meta Audience Network SDK',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.hinduapp.devotional"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.hinduapp.devotional"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables { useSupportLibrary = true }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // "यहाँ अपनी release keystore configure करें"
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true; buildConfig = true }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.1")

    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("io.coil-kt:coil-compose:2.7.0")

    val firebaseBom = platform("com.google.firebase:firebase-bom:33.8.0")
    implementation(firebaseBom)
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")
    implementation("com.google.firebase:firebase-messaging-ktx")
    implementation("com.google.firebase:firebase-analytics-ktx")

    // Meta Audience Network (Facebook Ads) SDK
    implementation("com.facebook.android:audience-network-sdk:6.18.0")
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'android/app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'Permissions for Wallpaper, Storage, Push Notifications, and Internet',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.SET_WALLPAPER" />
    <uses-permission android:name="android.permission.SET_WALLPAPER_HINTS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".HinduApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.HinduApp"
        tools:targetApi="35">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.HinduApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.HinduFcmService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

    </application>
</manifest>`
  },
  {
    name: 'WallpaperHelper.kt',
    path: 'android/app/src/main/java/com/hinduapp/devotional/util/WallpaperHelper.kt',
    category: 'kotlin',
    description: 'Native helper to set Home/Lock screen wallpapers and save to Gallery with MediaStore',
    code: `package com.hinduapp.devotional.util

import android.app.WallpaperManager
import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import coil.ImageLoader
import coil.request.ImageRequest
import coil.request.SuccessResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

enum class WallpaperTarget { HOME_SCREEN, LOCK_SCREEN, BOTH }

object WallpaperHelper {
    suspend fun setWallpaper(context: Context, imageUrl: String, target: WallpaperTarget): Result<Boolean> = withContext(Dispatchers.IO) {
        runCatching {
            val bitmap = loadBitmapFromUrl(context, imageUrl) ?: throw IllegalStateException("इमेज लोड नहीं हुई")
            val wm = WallpaperManager.getInstance(context)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                when (target) {
                    WallpaperTarget.HOME_SCREEN -> wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
                    WallpaperTarget.LOCK_SCREEN -> wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
                    WallpaperTarget.BOTH -> wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK)
                }
            } else {
                wm.setBitmap(bitmap)
            }
            true
        }
    }

    suspend fun saveWallpaperToGallery(context: Context, imageUrl: String, title: String) = withContext(Dispatchers.IO) {
        runCatching {
            val bitmap = loadBitmapFromUrl(context, imageUrl) ?: throw IllegalStateException("Download failed")
            val filename = "HinduApp_\${System.currentTimeMillis()}.jpg"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                    put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/HinduApp")
                }
                val uri = context.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
                uri?.let { context.contentResolver.openOutputStream(it)?.use { out -> bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, out) } }
            }
        }
    }
}`
  },
  {
    name: 'AdManager.kt (Meta Ads)',
    path: 'android/app/src/main/java/com/hinduapp/devotional/ads/AdManager.kt',
    category: 'kotlin',
    description: 'Meta Audience Network SDK implementation with frequency capping and remote config',
    code: `package com.hinduapp.devotional.ads

import android.app.Activity
import android.content.Context
import com.facebook.ads.*
import com.hinduapp.devotional.model.AdsConfig

object AdManager {
    private var interstitialAd: InterstitialAd? = null
    private var actionClickCounter = 0

    // "यहाँ अपना Meta Interstitial Placement ID जोड़ें"
    fun loadInterstitialAd(context: Context, placementId: String) {
        if (placementId.isBlank()) return
        interstitialAd = InterstitialAd(context, placementId)
        interstitialAd?.loadAd()
    }

    fun showInterstitialIfAllowed(activity: Activity, adsConfig: AdsConfig, onFinished: () -> Unit) {
        if (!adsConfig.isAdsEnabled) { onFinished(); return }
        actionClickCounter++
        val interval = if (adsConfig.interstitialIntervalClicks > 0) adsConfig.interstitialIntervalClicks else 4
        if (actionClickCounter % interval == 0 && interstitialAd?.isAdLoaded == true) {
            interstitialAd?.show()
            onFinished()
        } else {
            onFinished()
        }
    }
}`
  },
  {
    name: 'firestore.rules',
    path: 'firestore.rules',
    category: 'security',
    description: 'Production Firebase Firestore Security Rules for read-only users and authenticated Admin',
    code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // "यहाँ अपनी Admin Email दर्ज करें"
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email == "sudhathawkar7@gmail.com" ||
        request.auth.token.admin == true
      );
    }

    match /wallpapers/{wallpaperId} {
      allow read: if resource.data.isActive == true || isAdmin();
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['downloadsCount', 'viewsCount']) || isAdmin();
      allow create, delete, write: if isAdmin();
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /quotes/{quoteId} {
      allow read: if resource.data.isActive == true || isAdmin();
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likesCount']) || isAdmin();
      allow create, delete, write: if isAdmin();
    }

    match /app_settings/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /ads_config/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`
  }
];

export const AndroidCodeHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Android Studio Source Code & Setup Guide
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Kotlin + Jetpack Compose + Firebase + Meta Audience Network पूर्ण प्रोजेक्ट फाइलें
        </p>
      </div>

      {/* Code Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left File Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            प्रोजेक्ट फाइलें (Project Files):
          </span>
          <div className="space-y-1.5">
            {ANDROID_FILES.map(file => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedFile.name === file.name
                    ? 'border-amber-500 bg-stone-900 text-white'
                    : 'border-stone-800 bg-stone-950/70 text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-mono font-bold line-clamp-1">{file.name}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{file.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-800 bg-stone-900/80 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-stone-950 border-b border-stone-800">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-amber-400">{selectedFile.path}</span>
              <p className="text-[11px] text-stone-400">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'कॉपी हुआ!' : 'कोड कॉपी करें'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-stone-300 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
