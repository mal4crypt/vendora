# Mobile APK Build Instructions

To convert the Vendora web app into a mobile APK, follow these steps on a machine with the **Android SDK** and **Java (JDK 17+)** installed.

## 📋 Prerequisites
- **Node.js**: Installed
- **Android Studio**: Installed (along with Android SDK)
- **Java**: JDK 17 or later

## 🚀 Build Steps

1.  **Build the Web Project**:
    ```bash
    cd vendora
    npm run build
    ```

2.  **Sync Capacitor**:
    This copies the `dist` folder into the Android project.
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```

4.  **Generate APK in Android Studio**:
    - In Android Studio, go to `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
    - Once finished, a notification will appear with a link to "locate" the APK file.

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
