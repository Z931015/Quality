import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceConfig } from 'src/app/shared/util/serviceconfig';
import { RouterService } from 'src/app/shared/service/router.service';
import { catchError, map, filter } from 'rxjs/operators';
import { StringConstant } from '../util/stringconstant';
import { IExtendExpiryModel } from '../models/extendedExpirySearch';
import { Helper } from '../util/helper';

@Injectable({
  providedIn: 'root'
})
export class PwmPalletInquiryService {
  retainSearch: any;
  finalExtStr;
  finalExtQuery;
  qaMenuName: any;
  selectedradio: any;
  private baseUrl: string;
  screenToNavigate: string;
  printUrl: any;
  headers = new HttpHeaders().set("SiteId", sessionStorage.getItem('siteId'));
  screenType: any;
  message: string;
  isSuccess: boolean;
  dspNumber: any;
  isExtended = true;
  constructor(
    private http: HttpClient,
    private serviceConfig: ServiceConfig,
    private routerService: RouterService,
  ) {
    this.baseUrl = serviceConfig.apiUrl + 'v1/';
  }
  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }
  onPalletHyperlinkClick(link, siteId, palletId) {
    return this.http.get(this.baseUrl + link + palletId + '?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  getAllPalletsList(link, siteId) {
    return this.http.get(this.baseUrl + link + 'fields?fields=palletid,fakeId' + '&SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  getPalletByFakeID(data)
  {
    const apiUrl = `${this.baseUrl}pallets?SiteId=${data.SiteId}&q=fakeId eq ${data.PalletId}`;
    return this.http.get(apiUrl,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  getMaterialbasedOnselectedPallet(link, data) {
    let palletId = data.PalletId;
    let siteId = data.SiteId;
    return this.http.get(this.baseUrl + link + palletId + '?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  getPalletPreferFakeId(link, data) {
    return this.http.get(this.baseUrl + link + data.PalletId + '?SiteId=' +  data.SiteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  getAllActivePalletsList(link, siteId) {

    return this.http.get(this.baseUrl + link + 'fields?fields=palletid,materialid,fakeId' + '&SiteId=' + siteId + '&q=status eq available',

      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  getAllMaterialsList(link, siteId) {
    return this.http.get(this.baseUrl + link + 'fields' + '?SiteId=' + siteId + '&fields=materialId,MaterialDescription',
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  onMaterialHyperLinkMatDetails(link, materialId, siteId) {
    return this.http.get(this.baseUrl + link + materialId + '?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  getMaterialCharacteristics(link, materialId, siteId) {
    return this.http.get(this.baseUrl + link + materialId + '/characteristics?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  getPalletCharacteristics(link, palletId, siteId) {
    return this.http.get(this.baseUrl + link + palletId + '/characteristics?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  onMaterialHyperLinkBom(link, materialId, siteId,) {
    return this.http.get(this.baseUrl + link + materialId + '/bom?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }


  setSelectedRadio(data) {
    return this.selectedradio = data;
  }
  getSelectedRadio() {
    let temp = this.selectedradio;
    return temp;
  }

  setSearValues(data) {
    this.retainSearch = data;
  }
  getSearValues() {
    let temp = this.retainSearch;
    return temp;
  }
  loadPalletMainPageSearch(link, data) {
    let siteId = data.SiteId;
    let fromPalletId = data.FromPalletId;
    let toPalletId = data.ThruPalletId;
    let fromManufactureDatetime = data.FromDate;
    let toManufactureDateTime = data.ToDate;
    let material = data.MaterialId;
    let limit = data.Limit;
    let offset = data.Offset;
    let orderBy = data.OrderBy;
    let sortBy = data.SortBy;
    let gridQuery = data.Query;
    let query: string[] = [];
    let queryStr = [];
    query.push(`SiteId=${siteId}`)
    if (limit) {
      query.push(`limit=${limit}`)
      query.push(`offset=${offset}`)
    }
    if (orderBy) {
      query.push(`order=${orderBy}`)
      query.push(`sort=${sortBy}`)
    }

    if (fromPalletId && toPalletId)
      queryStr.push(`palletId bt ${fromPalletId}|${toPalletId}`)
    else {
      if (fromPalletId)
        queryStr.push(`palletId ge ${fromPalletId}`)
      if (toPalletId)
        queryStr.push(`palletId le ${toPalletId}`)
    }

    if (fromManufactureDatetime && toManufactureDateTime)
      queryStr.push(`manufacturingDateTime bt ${fromManufactureDatetime}|${toManufactureDateTime}`)
    else {
      if (fromManufactureDatetime)
        queryStr.push(`manufacturingDateTime ge ${fromManufactureDatetime}`)
      if (toManufactureDateTime)
        queryStr.push(`manufacturingDateTime le ${toManufactureDateTime}`)
    }
    if (material)
      queryStr.push(`materialId lk ${material}`)
    if (gridQuery) {
      queryStr = queryStr.concat(gridQuery);
    }
    let finalStr = 'q=' + queryStr.join(' and ')
    query.push(finalStr)
    let finalQuery = query.join('&');
    const url = `${this.baseUrl}${link}?${finalQuery}`;
    return this.http.get(url, { headers: this.headers });
  }

  saveOrClearExtendExpiryDate(link, data) {
    return this.http.put(this.baseUrl + link + 'update-expiration-date/', data, { headers: this.headers }).pipe(
      map(data => { return data; }), catchError(this.handleError));
  }
  getPalletsExtendedSearch(link: string, data: IExtendExpiryModel): Observable<unknown> {

    const param = this.getParamsForExtendExpity(data);
    const apiUrl = `${this.baseUrl}${link}extend-expiry?${param.join('&')}`;
    return this.http.get(apiUrl,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError)
      );
  }

  printGridCrPdf(method, data) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set("content-type", "application/json").set("SiteId", sessionStorage.getItem('siteId'));
    return this.http.get(this.baseUrl + method + data.materialId + '/pdf?siteId=' + data.siteId,
      {
        headers: headers,
        responseType: 'blob'
      })
  }
  printGridBomPdf(method, data) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set("content-type", "application/json").set("SiteId", sessionStorage.getItem('siteId'));
    return this.http.get(this.baseUrl + method + data.materialId + '/bom/pdf?SiteId=' + data.siteId,
      {
        headers: headers,
        responseType: 'blob'
      })
  }

  getDetails(link, id, siteId) {
    return this.http.get(this.baseUrl + link + id + '?SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  getAllDetails(link, fields, siteId) {
    return this.http.get(this.baseUrl + link + 'fields?fields=' + fields + '&SiteId=' + siteId,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }

  getDetailsBasedOnCriteria(link, fields, siteId, query) {
    return this.http.get(this.baseUrl + link + 'fields?fields=' + fields + '&SiteId=' + siteId + '&q=' + query,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  post(method, payload) {
    return this.http.post(this.baseUrl + method, payload, { headers: this.headers }).pipe(
      map(data => { return data; }), catchError(this.handleError));
  }
  getDetailsBasedOnQuery(method, siteId, query, queryStr) {
    return this.http.get(this.baseUrl + method + '?SiteId=' + siteId + '&' + query + '&' + queryStr,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }
  delete(method, id, siteId) {
    return this.http.delete(this.baseUrl + method + id + '?SiteId=' + siteId, { headers: this.headers }).pipe(
      map(data => { return data; }), catchError(this.handleError));
  }
  printGridDetails(method, siteId, query,cols) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set("content-type", "application/json").set("SiteId", sessionStorage.getItem('siteId'));
    return this.http.get(this.baseUrl + method + '/pdf?SiteId=' + siteId + '&q=' + query + '&fields=' + cols,
      {
        headers: headers,
        responseType: 'blob'
      })
  }

  downloadFiles(link, type, cols: string[],model:IExtendExpiryModel) {
    const param = this.getParamsForExtendExpity(model);
    param.push(`fields=${cols.join(',')}`);
    const apiUrl = `${this.baseUrl}${link}extend-expiry/${type}?${param.join('&')}`;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set('SiteId', sessionStorage.getItem('siteId'));
    return this.http.get(apiUrl, { headers: headers, responseType: 'blob' });
  }
  put(method, payload) {
    return this.http.put(this.baseUrl + method, payload, { headers: this.headers }).pipe(
      map(data => { return data; }), catchError(this.handleError));
  }
  postWithQuery(method, id, payload) {
    return this.http.post(this.baseUrl + method + id, payload,
      { headers: this.headers }).pipe(
        map(data => { return data; }), catchError(this.handleError));
  }


  private getParamsForExtendExpity(data: IExtendExpiryModel): string[] {
    let dynamicParam: string[] = [];
    const param: string[] = [];
    if (data.pallet.from && data.pallet.to)
      dynamicParam.push(`palletId bt ${data.pallet.from['palletId']}|${data.pallet.to['palletId']}`)
    else {
      if (data.pallet.from)
        dynamicParam.push(`palletid ge ${data.pallet.from['palletId']}`)
      if (data.pallet.to)
        dynamicParam.push(`palletid le ${data.pallet.to['palletId']}`)
    }
    if (data.mfgDate.from && data.mfgDate.to)
      dynamicParam.push(`manufacturingDateTime bt ${Helper.getMomentDate(data.mfgDate.from)}|${Helper.getMomentDate(data.mfgDate.to)}`)
    else {
      if (data.mfgDate.from)
        dynamicParam.push(`manufacturingDateTime ge ${Helper.getMomentDate(data.mfgDate.from)}`)
      if (data.mfgDate.to)
        dynamicParam.push(`manufacturingDateTime le ${Helper.getMomentDate(data.mfgDate.to)}`)
    }
    if (data.table.filter.query) {
      dynamicParam = dynamicParam.concat(data.table.filter.query);
    }
    dynamicParam.push('status eq Available');
    param.push(`MaterialId=${data.material['materialID']}`)
    param.push(`ExtendedExpirationDateTime=${Helper.getMomentDate(data.extendExpiryDate)}`)
    param.push(`ManualExpiration=${data.manualExpiryDate}`)
    if (data.table.filter) {
      if (data.table.filter.limit) {
        param.push(`limit=${data.table.filter.limit}`)
        param.push(`offset=${data.table.filter.offset}`)
      }
      if (data.table.filter.order) {
        param.push(`order=${data.table.filter.order}`)
        param.push(`sort=${data.table.filter.sort}`)
      }
    }
    param.push(`q=${dynamicParam.join(' and ')}`);
    param.push(`SiteId=${data.siteId}`);
    return param;
  }
  printDSP(method, siteId, query) {
    const apiUrl = `${this.baseUrl}${method}/pdf?SiteId=${siteId}&q=${query}`;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set('SiteId', sessionStorage.getItem('siteId'));
    return this.http.get(apiUrl, { headers: headers, responseType: 'blob' });
  }
}

