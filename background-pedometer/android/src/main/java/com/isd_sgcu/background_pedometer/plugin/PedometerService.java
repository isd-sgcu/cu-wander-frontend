package com.isd_sgcu.background_pedometer.plugin;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import java.time.Duration;
import java.time.Instant;
import org.json.JSONException;
import org.json.JSONObject;

public class PedometerService extends Service implements SensorEventListener {

    private int steps = 0;
    private int localSteps = 0;

    SensorManager sensorManager;
    Sensor stepCounterSensor;
    Sensor stepDetectorSensor;

    WebSocketConnection conn;

    private Instant lastSync = Instant.now();

    private static final String CHANNEL_NAME = "pedometer_service_channel";
    private static final String NOTIFICATION_TITLE = "CU Wander";
    private static final int IMPORTANCE = NotificationManager.IMPORTANCE_MIN;
    private static final int NOTIFICATION_ID = 312;
    private static final int SENSOR_DELAY = SensorManager.SENSOR_DELAY_UI;

    private final IBinder binder = new MyBinder();
    private PedometerServicePlugin plugin;

    public class MyBinder extends Binder {

        PedometerService getService() {
            return PedometerService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("Service", "onCreate");

        Notification notification = getNotification();

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        stepDetectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
        sensorManager.registerListener(this, stepCounterSensor, SENSOR_DELAY);
        sensorManager.registerListener(this, stepDetectorSensor, SENSOR_DELAY);

        startForeground(NOTIFICATION_ID, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        Log.i("Service", "StartCommand");

        conn = new WebSocketConnection(intent.getStringExtra("token"), intent.getStringExtra("wsAddress"));

        return START_REDELIVER_INTENT;
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.i("Service", "onBind");

        return binder;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        conn.disconnect();
        conn = null;

        plugin.setService(null);
        setPlugin(null);

        Log.i("Service", "Destroyed!");
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    public void onSensorChanged(SensorEvent event) {
        // When service is created it's default to 0
        // and when the first packet come it will jump to the
        // last steps it can find
        if (steps == 0) {
            steps = (int) event.values[0];
            localSteps = steps;
            Log.v("Service", "onSensorChanged init " + steps);
            return;
        }
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            int newSteps = (int) event.values[0];
            int dSteps = newSteps - steps;
            Log.v("Service", "onSensorChanged " + dSteps);
            // update to server (only when connection is available).

            JSONObject json = new JSONObject();
            try {
                json.put("step", dSteps);
                if (Duration.between(lastSync, Instant.now()).getSeconds() > 8 && conn.send(json.toString())) {
                    steps = newSteps;
                    lastSync = Instant.now();
                }
            } catch (JSONException e) {
                Log.e("Service", "JSON error: " + e.getMessage());
            }

            // update for local
            if (isPluginBounded()) {
                dSteps = newSteps - localSteps;
                localSteps = newSteps;
                plugin.fireSteps(dSteps);
            }
        }
    }

    private Notification getNotification() {
        String channel = createChannel();

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, channel)
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentTitle(NOTIFICATION_TITLE);

        mBuilder.setVisibility(NotificationCompat.VISIBILITY_SECRET);

        return mBuilder.setPriority(IMPORTANCE).setCategory(Notification.CATEGORY_SERVICE).setNumber(0).build();
    }

    private synchronized String createChannel() {
        NotificationManager mNotificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel mChannel = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            mChannel = new NotificationChannel(CHANNEL_NAME, NOTIFICATION_TITLE, IMPORTANCE);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            mChannel.enableLights(true);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            mChannel.setLightColor(Color.BLUE);
        }
        if (mNotificationManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                mNotificationManager.createNotificationChannel(mChannel);
            }
        } else {
            stopSelf();
        }
        return CHANNEL_NAME;
    }

    public void setPlugin(PedometerServicePlugin plugin) {
        this.plugin = plugin;
    }

    public PedometerServicePlugin getPlugin() {
        return plugin;
    }

    public boolean isPluginBounded() {
        return plugin != null;
    }
}
