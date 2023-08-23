package com.test_vpn;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class VPNModule extends ReactContextBaseJavaModule {

    public VPNModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }




    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "VPNModule";
    }

    @ReactMethod
    public void isVPNConnected(Callback callback) {

        ConnectivityManager cm = (ConnectivityManager) getReactApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        Network activeNetwork = cm.getActiveNetwork();
        NetworkCapabilities caps = cm.getNetworkCapabilities(activeNetwork);
        boolean vpnInUse = caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
        callback.invoke(vpnInUse);
    }

}

