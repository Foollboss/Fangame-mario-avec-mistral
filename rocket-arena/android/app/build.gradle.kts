plugins {
    id("com.android.application")
}

// The game itself lives one folder up: copy the built web files into the APK assets.
val webRoot = rootProject.projectDir.parentFile
val copyWebAssets by tasks.registering(Copy::class) {
    from(webRoot) {
        include("index.html", "style.css", "dist/game.js")
    }
    into(layout.projectDirectory.dir("src/main/assets/www"))
}
tasks.named("preBuild") { dependsOn(copyWebAssets) }

android {
    namespace = "com.foollboss.supersonicarena"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.foollboss.supersonicarena"
        minSdk = 26
        targetSdk = 35
        versionCode = 2
        versionName = "1.1"
    }

    signingConfigs {
        create("release") {
            // Public test key so every build can be installed over the previous one. Not for store publishing.
            storeFile = file("../keystore/supersonic-arena.jks")
            storePassword = "supersonic"
            keyAlias = "supersonic"
            keyPassword = "supersonic"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
    }

    lint {
        checkReleaseBuilds = false
        abortOnError = false
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.12.1")
}
