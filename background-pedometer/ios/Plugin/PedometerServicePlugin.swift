import Foundation
import CoreMotion
import Capacitor

@objc(PedometerServicePlugin)
public class PedometerServicePlugin: CAPPlugin {
    
    var service: PedometerService?
    
    @objc func enable(_ call: CAPPluginCall) {
        guard service == nil else {
            let error = "Pedometer service is already running"
            print(error)
            call.reject(error)
            return
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
        notifyListeners("steps", data: data)
    }
}
