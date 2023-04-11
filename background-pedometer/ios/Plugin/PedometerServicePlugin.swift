import Foundation
import CoreMotion
import Capacitor

@objc(PedometerServicePlugin)
public class PedometerServicePlugin: CAPPlugin {
    
    var service: PedometerService?
    var webSocket: WebSocketConnection?
    
    @objc func requestPermission(_ call: CAPPluginCall) {
        var data = Dictionary<String, Any>()
        data["value"] = true
        call.resolve(data)
    }

    
    @objc func enable(_ call: CAPPluginCall) {
        guard service == nil else {
            let error = "Pedometer service is already running"
            print(error)
            call.reject(error)
            return
        }
        
        let token = call.getString("token")
        let wsAddress = call.getString("wsAddress")
      
        if token != nil && wsAddress != nil {
            self.webSocket = WebSocketConnection(authToken: String(describing: token!), wsAddress: String(describing: wsAddress!))
        }
        
        service = PedometerService()
        service?.plugin = self
        
        call.resolve()
    }
    
    @objc func disable(_ call: CAPPluginCall) {
        service?.stop()
        service = nil
        call.resolve()
    }
    
    func fireSteps(_ steps: Int) {
        let data: [String: Any] = ["steps": steps]
        if(self.webSocket !== nil) {
            self.webSocket?.send(data: String(describing: steps))
        }
        notifyListeners("steps", data: data)
    }
}
