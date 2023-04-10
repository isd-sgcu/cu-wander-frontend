import Foundation
import CoreMotion
import UserNotifications

class PedometerService: NSObject {
    private var pedometer: CMPedometer?
    private var steps: Int = 0
    private var localSteps: Int = 0

    private let notificationCenter = UNUserNotificationCenter.current()

    func start() {
        pedometer = CMPedometer()
        startStepCounting()
        setupNotification()
    }

    func stop() {
        pedometer?.stopUpdates()
        pedometer = nil
    }

    private func startStepCounting() {
        if CMPedometer.isStepCountingAvailable() {
            pedometer?.startUpdates(from: Date()) { [weak self] pedometerData, error in
                guard let data = pedometerData, error == nil else { return }
                
                DispatchQueue.main.async {
                    self?.steps = data.numberOfSteps.intValue
                    self?.localSteps = self?.steps ?? 0
                    self?.sendStepUpdateNotification()
                }
            }
        }
    }

    private func setupNotification() {
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        notificationCenter.requestAuthorization(options: options) { (granted, error) in
            if !granted {
                print("Notification authorization denied.")
            }
        }
    }

    private func sendStepUpdateNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Step Update"
        content.body = "You have taken \(localSteps) steps."
        content.sound = UNNotificationSound.default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60, repeats: true)
        let request = UNNotificationRequest(identifier: "StepUpdateNotification", content: content, trigger: trigger)

        notificationCenter.add(request) { error in
            if let error = error {
                print("Error adding notification: \(error.localizedDescription)")
            }
        }
    }
}

