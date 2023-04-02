package com.isd_sgcu.background_pedometer.plugin;

import android.os.Binder;
import android.util.Log;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorManager;
import android.hardware.SensorEventListener;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class PedometerService extends Service implements SensorEventListener {
    private int steps = 0;
    private int localSteps = 0;

    SensorManager sensorManager;
    Sensor stepCounterSensor;
    Sensor stepDetectorSensor;

    WebSocketConnection conn;

    private final static String CHANNEL_NAME = "pedometer_service_channel";
    private final static String NOTIFICATION_TITLE = "CU Wander";
    private final static int IMPORTANCE = NotificationManager.IMPORTANCE_MIN;
    private final static int NOTIFICATION_ID = 312;
    private final static int SENSOR_DELAY = SensorManager.SENSOR_DELAY_UI;

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

        conn = new WebSocketConnection(
                intent.getStringExtra("token"),
                intent.getStringExtra("wsAddress")
        );

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
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

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
            if (conn.send(String.valueOf(dSteps))) {
                steps = newSteps;
            }

            // update for local
            if(isPluginBounded()) {
                dSteps = newSteps - localSteps;
                localSteps = newSteps;
                plugin.fireSteps(dSteps);
            }
        }
    }

    private Notification getNotification() {
        String channel = createChannel();

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, channel)
                .setSmallIcon(android.R.drawable.ic_menu_compass).setContentTitle(NOTIFICATION_TITLE);

        mBuilder.setVisibility(NotificationCompat.VISIBILITY_SECRET);

        return mBuilder
                .setPriority(IMPORTANCE)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setNumber(0)
                .build();
    }

    private synchronized String createChannel() {
        NotificationManager mNotificationManager = (NotificationManager) this
                .getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel mChannel = new NotificationChannel(CHANNEL_NAME, NOTIFICATION_TITLE, IMPORTANCE);

        mChannel.enableLights(true);
        mChannel.setLightColor(Color.BLUE);
        if (mNotificationManager != null) {
            mNotificationManager.createNotificationChannel(mChannel);
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
