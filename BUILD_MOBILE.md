# Mobile APK Build Instructions

To convert the Vendora web app into a mobile APK, follow these steps on a machine with the **Android SDK** and **Java (JDK 17+)** installed.

## 📋 Prerequisites
- **Node.js**: Installed
- **Android Studio**: Installed (along with Android SDK)
- **Java**: JDK 17 or later

## 🚀 Build Steps (CLI Only - Kali/Terminal)

If you don't have Android Studio, follow these exact steps on your Kali terminal:

1.  **Update Repository & Install Prerequisites**:
    ```bash
    sudo apt update
    sudo apt install openjdk-17-jdk android-sdk-platform-tools android-sdk-common
    ```

2.  **Fix SDK Path (Crucial)**:
    Create/Update the `local.properties` file:
    ```bash
    echo "sdk.dir=/usr/lib/android-sdk" > android/local.properties
    ```

3.  **Install Missing Build Components**:
    Run this to download the necessary tools (approx 100MB):
    ```bash
    sudo sdkmanager "platforms;android-33" "build-tools;33.0.2"
    ```

4.  **Build the Project**:
    ```bash
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleDebug
    ```

4.  **Build the Project**:
    ```bash
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleDebug
    ```

5.  **Locate your APK**:
    The final file will be: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 Build Steps (Using Android Studio)
1.  **Build the Web Project**:
    ```bash
    npm run build
    ```
2.  **Sync Capacitor**:
    ```bash
    npx cap sync
    ```
3.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
4.  **Generate APK**:
    Go to `Build` > `Build APK(s)`.

---

## 🛠️ Configuration Details
- **Package Name**: `com.vendora.app`
- **Native Project folder**: `/android`
- **Web Directory**: `dist` (defined in `capacitor.config.json`)

## 📱 Testing on Emulator
If you want to run it directly from the command line on an open emulator:
```bash
npx cap run android
```
