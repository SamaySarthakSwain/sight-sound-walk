# Sight Sound Walk App (Flutter)

This is the Flutter port of the **Sight Sound Walk** React web application.

## 🚀 Features
- **Cross-Platform Responsive UI:** Supports iOS, Android, and Web using `ResponsiveLayout` and `ScaffoldWithNavBar` (BottomNavigation for Mobile, NavigationRail for Web/Desktop).
- **GoRouter:** Persistent and deep-linked routing setup mirroring `react-router-dom`.
- **Riverpod:** Scalable state management to replace `react-query`.
- **Supabase Connected:** Configured to instantly connect to your existing backend data.

## 🛠️ Project Structure
- `lib/core/` -> Configurations, layout widgets, constants.
- `lib/features/` -> Feature-based breakdown matching pages (home, explore, food, profile).

## 🏃‍♂️ How to Run

1. Open a terminal in this directory (`sight_sound_walk_app`).
2. Run `flutter pub get` to ensure all packages are downloaded.

### Run on Web (Desktop Layout)
```bash
flutter run -d chrome
```

### Run on Mobile (Android Emulator / iOS Simulator)
*Make sure your emulator is running, or a physical device is connected.*
```bash
# General
flutter run

# Explicitly Android
flutter run -d android

# Explicitly iOS
flutter run -d ios
```

## 🏗️ How to Build
To generate the production APK or bundle:

**Android APK:**
```bash
flutter build apk --release
```
*(Find it in `build/app/outputs/flutter-apk/app-release.apk`)*

**iOS App:**
```bash
flutter build ios --release
```
*(Requires Xcode on macOS. Once built, open `ios/Runner.xcworkspace` in Xcode to archive and submit).*

**Web App:**
```bash
flutter build web --release
```
*(Deploy the `build/web` folder to Vercel/Netlify for your responsive web portal).*

## 📌 Next Steps
The app currently has detailed placeholder UI based on your exact React designs. The next steps for development include:
1. Converting `react-leaflet` Maps to `flutter_map` within the Explore Tab.
2. Integrating the AR/Camera detection plugins (e.g., using `camera` and a local TFLite model or bridging the JS implementations).
3. Writing the Riverpod providers that fetch from the already-initialized `Supabase.instance.client` instance.
