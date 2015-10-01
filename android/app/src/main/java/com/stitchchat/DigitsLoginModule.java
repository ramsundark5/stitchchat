package com.stitchchat;

import com.digits.sdk.android.AuthCallback;
import com.digits.sdk.android.Digits;
import com.digits.sdk.android.DigitsException;
import com.digits.sdk.android.DigitsSession;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class DigitsLoginModule extends ReactContextBaseJavaModule {

    public DigitsLoginModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    final AuthCallback digitsCallback = new AuthCallback() {
        @Override
        public void success(DigitsSession session, String phoneNumber) {
            // Do something on success
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("registrationSuccess", session.getPhoneNumber());
        }

        @Override
        public void failure(DigitsException exception) {
            if(exception.getErrorCode() == 1){
                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("registrationCancelled", exception.getMessage());
            }
            // Do something on failure
        }
    };

    @ReactMethod
    public void startLoginProcess(){
        Digits.authenticate(digitsCallback);
    }

    @ReactMethod
    public void logout(){
        Digits.getSessionManager().clearActiveSession();
    }

    @Override
    public String getName() {
        return "DigitsLogin";
    }
}
