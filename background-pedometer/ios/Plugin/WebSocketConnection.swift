import Foundation
import Starscream

class WebSocketConnection {
    private let authToken: String
    private let wsAddress: String
    private var webSocket: WebSocket?
    private var tryReconnect = true
    
    private let RECONNECT_INTERVAL: TimeInterval = 15_000
    
    init(authToken: String, wsAddress: String) {
        self.authToken = authToken
        self.wsAddress = wsAddress
        connect()
    }
    
    private func connect() {
        guard let url = URL(string: wsAddress) else {
            print("Invalid WebSocket address: \(wsAddress)")
            return
        }
        
        print("Connecting to WebSocket at: \(wsAddress)")
        
        var request = URLRequest(url: url)
        request.setValue(authToken, forHTTPHeaderField: "Authorization")
        let socket = WebSocket(request: request)
        webSocket = socket
        
        socket.onEvent = { [weak self] (event: WebSocketEvent) in
            switch event {
            case .connected(let _):
                print("WebSocket connected")
                self?.webSocket?.write(string: self?.authToken ?? "")
                break
            case .disconnected(let reason, let _):
                print("WebSocket disconnected with error: \(reason)")
                self?.webSocket = nil
                if self?.tryReconnect ?? true {
                    self?.scheduleReconnect()
                }
                break
            case .text(let text):
                print("WebSocket received text message: \(text)")
                break
        case .binary(let data):
                print("Received data: \(data.count)")
            case .ping(_):
                break
            case .pong(_):
                break
            case .viabilityChanged(_):
                break
            case .reconnectSuggested(_):
                break
            case .cancelled:
                break
            case .error(let _):
                break
            }
        }

//        socket.onConnect = { [weak self] in
//            print("WebSocket connected")
//            self?.webSocket?.write(string: self?.authToken ?? "")
//        }
        
//        socket.onDisconnect = { (error: Error?) in
//            print("WebSocket disconnected with error: \(String(describing: error))")
//            self.webSocket = nil
//            if self.tryReconnect {
//                self.scheduleReconnect()
//            }
//        }
        
//        socket.onText = { (text: String) in
//            print("WebSocket received text message: \(text)")
//        }
        
        socket.connect()
    }
    
    private func scheduleReconnect() {
        DispatchQueue.main.asyncAfter(deadline: .now() + RECONNECT_INTERVAL) {
            self.connect()
        }
    }
    
    func send(data: String) -> Bool {
        guard let socket = webSocket else {
            print("WebSocket is not connected")
            return false
        }
        
        socket.write(string: data)
        print("Sent data to WebSocket: \(data)")
        return true
    }
    
    func disconnect() {
        tryReconnect = false
        webSocket?.disconnect()
        webSocket = nil
    }
}
