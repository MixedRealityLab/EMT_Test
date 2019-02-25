package com.inmyseat;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.rnfs.RNFSPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCWebViewPackage(),
          new RNGestureHandlerPackage(),
          new MapsPackage(),
          new RNFusedLocationPackage(),
          new RNFSPackage()
          //new RNNotificationsPackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
