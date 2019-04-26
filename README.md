***InMySeat***

**Requirements:**
Node.js
React Cli

Other dependencies change based on target platform. See the [React Native setup guide](https://facebook.github.io/react-native/docs/getting-started) for other requirements

**To build (Android):**

1. Download or Clone repo
2. Go into repo
3. Run 
    ```
    npm i
    ```
    To install required node modules
4. Run
    ```
    react-native run-android
    ```
    To build
	
**Building an APK**
1. Run the below command in order to create a bundle for the APK to use
```
react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/src/main/res
```
2. Assemble the debug build
```
cd android
gradlew assembleDebug
```
3. Download APK to device and install

To generate a signed APK, follow the [React Native guide] (https://facebook.github.io/react-native/docs/signed-apk-android)

**Known bugs**
#Marker images in APK are much bigger in debug APK#
## In order to fix this, go to .\android\app\src\main\res and copy the images frin drawable-mdpi into drawable-hdpi, drawable-xhdpi, drawable-xxhdpi, and drawable-xxxhdpi ##

#No bundle detected#
## First go to .\android\app\src\main and create a folder called assets. Then move the index.android.bundle from the .\android\app\src\main\res folder into the newly made assets folder##