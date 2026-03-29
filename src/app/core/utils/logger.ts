import { environment } from '../../../environments/environment';

export class Logger {
  static log(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.log(message, ...optionalParams);
    }
  }

  static error(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.error(message, ...optionalParams);
    }
  }

  static warn(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.warn(message, ...optionalParams);
    }
  }

  static info(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.info(message, ...optionalParams);
    }
  }
}
