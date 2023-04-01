package com.isd_sgcu.background_pedometer.plugin;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class ServiceConnection {

    private WebSocket wsConn;
    private String authToken;
    private String wsAddress;
    private boolean tryReconnect = true;

    private static final int RECONNECT_INTERVAL = 15_000;

    public ServiceConnection(String authToken, String wsAddress) {
        this.authToken = authToken;
        this.wsAddress = wsAddress;
        connect();
    }

    private void connect() {
        Log.i("Connection", String.format("Connecting with %s, %s", authToken, wsAddress));
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(0,  TimeUnit.MILLISECONDS)
                .build();

        Request request = new Request.Builder()
                .url(wsAddress)
                .build();

        client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onClosed(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
                super.onClosed(webSocket, code, reason);
                Log.i("Connection", "Closed");
                wsConn = null;
                if (tryReconnect) {
                    scheduleReconnect();
                }
            }

            @Override
            public void onFailure(@NonNull WebSocket webSocket, @NonNull Throwable t, @Nullable Response response) {
                super.onFailure(webSocket, t, response);
                Log.i("Connection", "Failed");
                wsConn = null;
                if (tryReconnect) {
                    scheduleReconnect();
                }
            }

            @Override
            public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
                super.onOpen(webSocket, response);
                Log.i("Connection", "Opened");
                webSocket.send(authToken);
                wsConn = webSocket;
            }
        });
    }

    private void scheduleReconnect() {
        new Handler(Looper.getMainLooper()).postDelayed(this::connect, RECONNECT_INTERVAL);
    }

    public boolean send(String data) {
        if(wsConn == null) {
            return false;
        }
        Log.v("Connection", "Sending " + data);
        return wsConn.send(data);
    }

    public void disconnect() {
        tryReconnect = false;
        wsConn.close(1000, "close");
        wsConn = null;
    }
}
