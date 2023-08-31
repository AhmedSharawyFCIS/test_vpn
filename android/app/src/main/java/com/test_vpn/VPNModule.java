package com.test_vpn;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.content.Intent;
import com.facebook.react.bridge.WritableNativeMap;
import com.test_vpn.ConnectivityReceiver;


public class VPNModule extends ReactContextBaseJavaModule  implements AmazonFireDeviceConnectivityPoller.ConnectivityChangedCallback {
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver vpnStatusReceiver;
    private final ConnectivityReceiver mConnectivityReceiver;
    private final AmazonFireDeviceConnectivityPoller mAmazonConnectivityChecker;

    public VPNModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        // Create the connectivity receiver based on the API level we are running on
        //
        mConnectivityReceiver = new NetworkCallbackConnectivityReceiver(reactContext);


        mAmazonConnectivityChecker = new AmazonFireDeviceConnectivityPoller(reactContext, this);
    }
    @Override
    public void initialize() {
        mConnectivityReceiver.register();
        mAmazonConnectivityChecker.register();
    }

    @Override
    public void onCatalystInstanceDestroy() {
        mAmazonConnectivityChecker.unregister();
        mConnectivityReceiver.unregister();
    }

    @Override
    public String getName() {
        return "VPNModule";
    }

    @Override
    public void onAmazonFireDeviceConnectivityChanged(boolean isConnected) {
        mConnectivityReceiver.setIsInternetReachableOverride(isConnected);

    }
}

