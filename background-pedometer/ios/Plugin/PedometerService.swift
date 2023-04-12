import Foundation
import CoreMotion

class PedometerService: NSObject {
    
    var pedometer: CMPedometer?
    var localSteps: Int = 0
    weak var plugin: PedometerServicePlugin?
    
    override init() {
        super.init()
        if CMPedometer.isStepCountingAvailable() {
            pedometer = CMPedometer()
            pedometer?.startUpdates(from: Date()) { [weak self] (data, error) in
                if let error = error {
                    print("Pedometer error: \(error.localizedDescription)")
                    return
                }
                
                guard let data = data else {
                    print("No pedometer data found")
                    return
                }
                
                if let localSteps = self?.localSteps {
                    let dSteps = data.numberOfSteps.intValue - localSteps
                    self?.localSteps = data.numberOfSteps.intValue
                    print("self?.localSteps \(String(describing: self?.localSteps))")
                    print("dSteps \(String(describing: dSteps))")
                    self?.plugin?.fireSteps(dSteps)
                }
            }
        } else {
            print("Step counting is not available")
        }
    }
    
    func stop() {
        pedometer?.stopUpdates()
        pedometer = nil
    }
    
}
