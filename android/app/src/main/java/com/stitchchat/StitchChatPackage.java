package com.stitchchat;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.stitchchat.mqtt.RNMQTTClient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by ramsundar on 9/22/15.
 */
public class StitchChatPackage implements ReactPackage {

    public StitchChatPackage(){
        super();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> appModules = new ArrayList<NativeModule>();
        appModules.add(new RNMQTTClient(reactApplicationContext));
        appModules.add(new DigitsLoginModule(reactApplicationContext));
        return appModules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(
            ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }


}
