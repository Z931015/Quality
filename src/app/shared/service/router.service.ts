import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ServiceConstants } from '../util/service-constants';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  public headers: any;
  private previousUrl: string;
  private currentUrl: string;
  constructor(private router: Router, private http: HttpClient) {
    this.headers = new HttpHeaders().set("SiteId", sessionStorage.getItem('siteId'));
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
   }

   public getPreviousUrl() {
    return this.previousUrl;
  }
  public getCurrentUrl() {
    return this.currentUrl;
  }
   //authorization
 getAuthorizedUrlList(payload){
  const url = `${environment.authUrl}${environment.apiVersion}/${ServiceConstants.AuthorizationUrl}${payload}`;
  return this.http.get<any>(url);
 }
 lock(id,type):Observable<any>{
  const url = `${environment.authUrl}${environment.apiVersion}/${type}/${id}/lock`;
  return this.http.post<any>(url,null);
 }
 releaseAllMenuLock():Observable<any>{
  const url = `${environment.authUrl}${environment.apiVersion}/menu/release-all-lock`;
  return this.http.post<any>(url,null);
 }
 releaseAllActionLock():Observable<any>{
  const url = `${environment.authUrl}${environment.apiVersion}/authourization/action/release-all-lock`;
  return this.http.post<any>(url,null);
 }
}
