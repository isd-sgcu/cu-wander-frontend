import Foundation

@objc public class PedometerService: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        print("Hello Test")
        return value
    }
}
