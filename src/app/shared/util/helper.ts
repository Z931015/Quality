import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Message } from 'primeng/api';

export class Helper {
  constructor(public datepipe: DatePipe) { }

  public static hasValue(val): boolean {
    if (val == null || val == '' || val == undefined)
      return false;
    else
      return true;
  }
  public static getMomentDate(value: number | string | Date, format = 'YYYY-MM-DD HH:mm:ss.SSS'): string {
    if (!value)
      return '';
    return moment(new Date(value)).format(format)
  }
  public static showMessage(type: string, message: string): Message[] {
    let strMessage: Message[] = [];
    strMessage = [{ severity: type, summary: message }];
    return strMessage;
  }
  public static StringFormat = (str: string, ...args: string[]): string =>
    str.replace(/{(\d+)}/g, (match, index) => args[index] || '')
  /**
   *
   * @param dateObj date object need to be formated for sending to backend
   * @summary API needs date in iso format. In Build toISOString() method
   * gives date in UTC zone. But we need date time in current zone. So we
   * could use this method to format date without converting into UTC
   */
  public static formatDate(dateObj: Date): string {
    const pad = function (num) {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };
    return dateObj.getFullYear() +
      '-' + pad(dateObj.getMonth() + 1) +
      '-' + pad(dateObj.getDate()) +
      'T' + pad(dateObj.getHours()) +
      ':' + pad(dateObj.getMinutes()) +
      ':' + pad(dateObj.getSeconds());
  }
}
