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
    # Choice A: Standard Java 21
    sudo apt install openjdk-21-jdk android-sdk-platform-tools android-sdk-common
    
    # Choice B: Professional way (Recommended if apt fails)
    curl -s "https://get.sdkman.io" | bash
    source "$HOME/.sdkman/bin/sdkman-init.sh"
    sdk install java 21.0.2-tem
    ```

2.  **Fix SDK Path (Crucial)**:
    Create/Update the `local.properties` file:
    ```bash
    echo "sdk.dir=/usr/lib/android-sdk" > android/local.properties
    ```

3.  **Accept Licenses (Crucial)**:
    Run this and type `y` for all prompts (or use the one-liner):
    ```bash
    yes | sudo sdkmanager --licenses
    ```

4.  **Install/Update Build Components**:
    Ensure the specific tools the build is asking for are installed:
    ```bash
    sudo sdkmanager "platforms;android-35" "build-tools;34.0.0"
    ```

5.  **Build the Project**:
    ```bash
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleDebug
    ```

6.  **Locate your APK**:
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
