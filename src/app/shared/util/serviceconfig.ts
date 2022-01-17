import { Injectable } from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable()
export class ServiceConfig {
  public apiUrl;  
public authUrl;
  constructor() {
    this.apiUrl = environment.baseUrl;
    this.authUrl = environment.authUrl;
  }
}
