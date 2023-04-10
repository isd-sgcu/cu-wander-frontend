import Capacitor

@objc(PedometerServicePlugin)
public class PedometerServicePlugin: CAPPlugin {
    private var pedometerService: PedometerService?

    @objc func requestPermission(_ call: CAPPluginCall) {
        // Implement permission request
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        UNUserNotificationCenter.current().requestAuthorization(options: options) { (granted, error) in
            if granted {
                call.resolve()
            } else {
                call.reject("Permission not granted.")
            }
        }
    }

    @objc func enable(_ call: CAPPluginCall) {
        // Implement enabling the service
        if pedometerService == nil {
            pedometerService = PedometerService()
        }
        pedometerService?.start()
        call.resolve()
    }

    @objc func disable(_ call: CAPPluginCall) {
        // Implement disabling the service
        pedometerService?.stop()
        pedometerService = nil
        call.resolve()
    }
}
