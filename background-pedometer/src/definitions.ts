export interface PedometerServicePlugin {
  /**
    * Asking for permission
    * return true only if user already have permission or user approve permission
    */
  requestPermission(): Promise<CallResponse<boolean>>;

  /**
    * Start pedometer background service
    * The service should be unable to start when permission is not granted
    * The service should be connected to the websocket server
    */
  enable(option: EnableOption): Promise<CallResponse<void>>;

  /**
    * Stop pedometer background service
    */
  disable(): Promise<void>;
}


/**
  * value indicated the response body
  * errMsg contain error message 
  * error can be check by checking whether `errMsg` is empty
  */
export interface CallResponse<T> {
    value: T;
    errMsg: string;
}

export interface EnableOption {
    token: string;
    wsAddress: string;
}
