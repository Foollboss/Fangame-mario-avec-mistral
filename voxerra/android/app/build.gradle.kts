plugins {
    id("com.android.application")
}

// Le jeu (fichier HTML autonome) est copié dans les ressources de l'appli.
val copyGame by tasks.registering(Copy::class) {
    from(rootProject.file("../Voxerra.html"))
    into(layout.buildDirectory.dir("generated/game/assets"))
    rename { "index.html" }
}

android {
    namespace = "io.github.fullboss971.voxerra"
    compileSdk = 36

    defaultConfig {
        applicationId = "io.github.fullboss971.voxerra"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        // clé de développement publique (voir android/README.md)
        create("voxerra") {
            storeFile = file("voxerra.keystore")
            storePassword = "voxerra"
            keyAlias = "voxerra"
            keyPassword = "voxerra"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("voxerra")
        }
        debug {
            signingConfig = signingConfigs.getByName("voxerra")
        }
    }

    sourceSets["main"].assets.srcDir(layout.buildDirectory.dir("generated/game/assets"))

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

tasks.named("preBuild") { dependsOn(copyGame) }

dependencies {
    implementation("androidx.webkit:webkit:1.17.1")
    implementation("androidx.activity:activity:1.13.0")
}
