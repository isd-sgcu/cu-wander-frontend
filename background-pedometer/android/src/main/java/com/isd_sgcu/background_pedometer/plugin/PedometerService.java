package com.isd_sgcu.background_pedometer.plugin;

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
    int steps = 0;
    SensorManager sensorManager;
    Sensor stepCounterSensor;
    Sensor stepDetectorSensor;

    ServiceConnection conn;

    private final static String CHANNEL_NAME = "pedometer_service_channel";
    private final static String NOTIFICATION_TITLE = "Step Tracker";
    private final static int IMPORTANCE = NotificationManager.IMPORTANCE_MIN;
    private final static int NOTIFICATION_ID = 312;
    private final static int SENSOR_DELAY = SensorManager.SENSOR_DELAY_UI;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("Service", "Created");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        Log.i("Service", "StartCommand");
        Notification notification = getNotification();

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        stepDetectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
        sensorManager.registerListener(this, stepCounterSensor, SENSOR_DELAY);
        sensorManager.registerListener(this, stepDetectorSensor, SENSOR_DELAY);

        startForeground(NOTIFICATION_ID, notification);
        conn = new ServiceConnection(
                intent.getStringExtra("token"),
                intent.getStringExtra("wsAddress")
        );

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        conn.disconnect();
        conn = null;

        Log.i("Service", "Destroyed!");
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (steps == 0) {
            steps = (int) event.values[0];
            Log.v("Service", "onSensorChanged init " + steps);
            return;
        }
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            int newSteps = (int) event.values[0];
            int dSteps = newSteps - steps;
            Log.v("Service", "onSensorChanged " + dSteps);
            // only update delta what connection is available.
            if (conn.send(String.valueOf(dSteps))) {
                steps = newSteps;
            }
        }
    }

    private Notification getNotification() {
        String channel = createChannel();

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, channel)
                .setSmallIcon(android.R.drawable.ic_menu_mylocation).setContentTitle(NOTIFICATION_TITLE);

        // Uncomment to remove visible notification.
        // mBuilder.setVisibility(NotificationCompat.VISIBILITY_SECRET);

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
}
