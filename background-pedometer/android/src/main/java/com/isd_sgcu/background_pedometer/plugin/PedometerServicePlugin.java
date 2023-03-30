package com.isd_sgcu.background_pedometer.plugin;

import android.content.Intent;
import android.Manifest;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "PedometerService", permissions = {
    @Permission(alias = "activity_recognition", strings = { Manifest.permission.ACTIVITY_RECOGNITION })
})
public class PedometerServicePlugin extends Plugin {

    private PedometerService implementation = new PedometerService();

    @PluginMethod()
    public void requestPermission(PluginCall call) {
        Log.i("requestPermission", "called");

        if (getPermissionState("activity_recognition") != PermissionState.GRANTED) {
            requestAllPermissions(call, "permissionCallback");
        } else {
            JSObject ret = new JSObject();
            ret.put("value", true);
            ret.put("errMsg", "");
            call.resolve(ret);
        }
    }

    @PluginMethod()
    public void enable(PluginCall call) {
        Log.i("Plugin", "enable");
        if (getPermissionState("activity_recognition") != PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("errMsg", "Not permission");
            call.resolve(ret);

            return;
        }

        Log.i("Register", "permission granted, trying to bind service.");

        Intent intent = new Intent(getContext(), PedometerService.class);
        intent.putExtra("token", call.getString("token"));
        intent.putExtra("wsAddress", call.getString("wsAddress"));
        getContext().startService(intent);

        JSObject ret = new JSObject();
        ret.put("errMsg", "");
        call.resolve(ret);
    }

    @PluginMethod()
    public void disable(PluginCall call) {
        Log.i("Plugin", "disable");

        getContext().stopService(new Intent(getContext(), PedometerService.class));

        JSObject ret = new JSObject();
        ret.put("errMsg", "");
        call.resolve(ret);
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        if (getPermissionState("activity_recognition") != PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("value", false);
            ret.put("errMsg", "Rejected by user");
        } else {
            JSObject ret = new JSObject();
            ret.put("value", true);
            ret.put("errMsg", "");
            call.resolve(ret);
        }
    }
}
