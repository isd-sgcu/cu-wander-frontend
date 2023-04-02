package com.isd_sgcu.background_pedometer.plugin;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.Manifest;
import android.content.ServiceConnection;
import android.os.IBinder;
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

    private PedometerService service;

    private ServiceConnection connection = new ServiceConnection() {
        public void onServiceConnected(ComponentName name, IBinder binder) {
            Log.i("Binder", "Bound Service");
            PedometerService.MyBinder mBinder = (PedometerService.MyBinder) binder;
            setService(mBinder.getService());
            service.setPlugin(PedometerServicePlugin.this);
        }

        public void onServiceDisconnected(ComponentName name) {
            Log.i("Binder", "Bound Service");
            service.setPlugin(null);
            setService(null);
        }
    };

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
        getContext().bindService(intent, connection, Context.BIND_AUTO_CREATE);

        JSObject ret = new JSObject();
        ret.put("errMsg", "");
        call.resolve(ret);
    }

    @PluginMethod()
    public void disable(PluginCall call) {
        Log.i("Plugin", "disable");

        getContext().unbindService(connection);

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

    public void fireSteps(int steps) {
        JSObject ret = new JSObject();
        ret.put("steps", steps);

        notifyListeners("steps", ret);
    }

    public boolean isServiceBounded() {
        return service != null;
    }

    public void setService(PedometerService service) {
        this.service = service;
    }

    public PedometerService getService() {
        return service;
    }
}
