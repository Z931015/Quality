import { PwmSpinnerService } from './../shared/service/pwm-spinner.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { PwmDialogService } from '../shared/service/pwm-dialog.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class QualityInterceptor implements HttpInterceptor {
  constructor(private spinnerService: PwmSpinnerService, private dialogService: PwmDialogService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({
      headers: req.headers.set('siteId', sessionStorage.getItem('siteId'))
    });

    /* ------------------------- Request Modification ----------------------------
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.

        const clonedReq = req.clone({
          headers: req.headers.set('siteId', sessionStorage.getItem('siteId'))
        });


      -------------------------  Loging ---------------------------
    const started = Date.now();
        let ok: string;

        // extend server response observable with logging
        return next.handle(req)
          .pipe(
            tap(
              // Succeeds when there is a response; ignore other events
              event => ok = event instanceof HttpResponse ? 'succeeded' : '',
              // Operation failed; error is an HttpErrorResponse
              error => ok = 'failed'
            ),
            // Log when response observable either completes or errors
            finalize(() => {
              const elapsed = Date.now() - started;
              const msg = `${req.method} "${req.urlWithParams}"
                 ${ok} in ${elapsed} ms.`;
              this.messenger.add(msg);
            })
          );
        */
    return this.handle(clonedReq, next);
  }

  handle(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const guid = GuidGenerator.newGuid();
    const started = Date.now();
    let logMessage: string;
    this.spinnerService.spin(guid);
    let map = new Map([
      [401, "You don't have permission to perform this operation"],
      [500, "Something went wrong, please try again after sometime"]//general Error
    ]);
    return next.handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          event => {
            if (event instanceof HttpResponse) {
              this.spinnerService.unSpin(guid);
              logMessage = 'success';
            }
          },
          // Operation failed; error is an HttpErrorResponse
          errorResponse => {
            this.spinnerService.reset();
            logMessage = errorResponse;
            if (map.get(errorResponse.status)) { // map.get(error.status)
              this.dialogService.errorMessage.next(map.get(errorResponse.status))
              this.dialogService.show();
            } else if (errorResponse.status > 400 && errorResponse.status < 500) {
              this.dialogService.errorMessage.next(errorResponse.error)
              this.dialogService.show();
            }else{
              this.dialogService.errorMessage.next(map.get(500))
              this.dialogService.show();
             }
          }
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${logMessage} in ${elapsed} ms.`;
          console.log(msg);
        })
      );
  }
}
class GuidGenerator {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
