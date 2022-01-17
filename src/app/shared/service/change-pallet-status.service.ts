import { Helper } from './../util/helper';
import { ServiceConstants } from '../util/service-constants';
import { Observable } from 'rxjs';
import { Cps } from './../models/changePalletStatus';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StringConstant } from '../util/stringconstant';

@Injectable({
  providedIn: 'root'
})
export class ChangePalletStatusService {

  constructor(private http: HttpClient) { }
  getStatus(m: Cps): Observable<any[]> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.GetStatus}?SiteId=${m.details.siteId}`;
    return this.http.get<any[]>(url);
  }
  getpallets(m: Cps): Observable<any> {
    let dynamicParam: string[] = [];
    const param: string[] = [];
    dynamicParam.push(`status eq ${m.details.status.from['value']}`)
    if (m.details.palletId)
      dynamicParam.push(`palletId eq ${m.details.palletId}`)
    if (m.details.mfgDate.from && m.details.mfgDate.to)
      dynamicParam.push(`manufacturingDateTime bt ${Helper.getMomentDate(m.details.mfgDate.from)}|${Helper.getMomentDate(m.details.mfgDate.to)}`)
    else {
      if (m.details.mfgDate.from)
        dynamicParam.push(`manufacturingDateTime ge ${Helper.getMomentDate(m.details.mfgDate.from)}`)
      if (m.details.mfgDate.to)
        dynamicParam.push(`manufacturingDateTime le ${Helper.getMomentDate(m.details.mfgDate.to)}`)
    }
    if(m.details.siteType==3){
      dynamicParam.push(`producerId eq ${m.details.producer.id}`)
    }
    if (m.details.table.filter.query) {
      dynamicParam = dynamicParam.concat(m.details.table.filter.query);
    }
    if (m.details.table.filter) {
      if (m.details.table.filter.limit) {
        param.push(`limit=${m.details.table.filter.limit}`)
        param.push(`offset=${m.details.table.filter.offset}`)
      }
      if (m.details.table.filter.order) {
        param.push(`order=${m.details.table.filter.order}`)
        param.push(`sort=${m.details.table.filter.sort}`)
      }
    }
    param.push(`q=${dynamicParam.join(' and ')}`);
    param.push(`SiteId=${m.details.siteId}`);
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.GetPallets}?${param.join('&')}`;
    return this.http.get<any>(url);
  }
  postPallet(m: Cps): Observable<any> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.UpdateChangePalletStatus}-${m.details.status.from['value'].toLowerCase()}-${m.details.status.to['value'].toLowerCase()}`;
    const body = {
      palletId: m.details.table.data.records.selected.map(pallet => pallet['palletId']),
      siteId: m.details.siteId,
      defects: [],
      incidentId: m.details.table.data.records.selected[0]['expandedQcId']
    };
    return this.http.post(url, body);
  }
  getMaterials(materialId: string, siteId: number): Observable<any> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.GetMaterials}${materialId}/change-materail-list?SiteId=${siteId}`;
    return this.http.get<any>(url);
  }
  getMaterialsDefaultQuantity(materialId: string, siteId: number): Observable<any> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.GetMaterials}${materialId}/rework?SiteId=${siteId}`;
    return this.http.get<any>(url);
  }
  postPalletRework(m: Cps, preview: boolean): Observable<any> {
    let url;
    if (preview) {
      return this.postPalletReworkPreview(m);
    }
    if (m.details.status.from.value == StringConstant.MillClaimParam) {
       url = `${environment.baseUrl}${environment.apiVersion}/pallets/${m.details.status.from.value.toLowerCase()}-rework`;
    } else {
       url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.ReworkPrint}`;
    }

    const params = {
      siteId: m.rework.siteId,
      materialId: m.rework.material.data ? m.rework.material.data['materialId'] : m.rework.table.data.records.actual[0]['materialId'],
      pallets: m.rework.table.data.records.actual.map(m => { return { palletId: m['palletId'], recoveredQty: m['recoveredQty'] } }),
      userSuppliedManufactureDate: m.rework.userSuppliedManufactureDate,
      noOfCopies: m.rework.noOfCopies,
      containerType: m.rework.containerType
    };
    return this.http.post<any>(url, params);
  }
  postPalletReworkPreview(m: Cps): Observable<any> {
    let url;
    if (m.details.status.from.value == StringConstant.MillClaimParam) {
      url = `${environment.baseUrl}${environment.apiVersion}/pallets/${m.details.status.from.value.toLowerCase()}-rework-preview`;
   } else {
      url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.ReworkPreview}`;
   }
    const params = {
      siteId: m.rework.siteId,
      materialId: m.rework.material.data ? m.rework.material.data['materialId'] : m.rework.table.data.records.actual[0]['materialId'],
      pallets: m.rework.table.data.records.actual.map(m => { return { palletId: m['palletId'], recoveredQty: m['recoveredQty'] } }),
    };
    return this.http.post<any>(url, params);
  }
  getIncident(m: Cps): Observable<any[]> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.QCIncidents}?SiteId=${m.details.siteId}`;
    return this.http.get<any[]>(url);
  }
  getDefectCategory(m: Cps): Observable<any[]> {
    const siteId = m.details.siteType == 3?Number(m.details.producer.id):m.details.siteId;
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.DefectCategories}?SiteId=${siteId}&OldStatus=${m.details.status.from['value']}&NewStatus=${m.details.status.to['value']}`;
    return this.http.get<any[]>(url);
  }
  getDefects(m: Cps): Observable<any[]> {
    const siteId = m.details.siteType == 3?Number(m.details.producer.id) :m.details.siteId;
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.DefectCategories}/${m.defects.category['reasonId']}
    /defects?SiteId=${siteId}&moveType=${m.defects.category['moveType']}`;
    return this.http.get<any[]>(url);
  }
  postPalletDefects(m: Cps): Observable<any> {
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.UpdateChangePalletStatus}-${m.details.status.from['value'].toLowerCase()}-${m.details.status.to['value'].toLowerCase()}`;
    console.log(m)
    const body = {
      palletId: m.details.table.data.records.selected.map(pallet => pallet['palletId']),
      siteId: m.defects.siteId,
      defects: m.defects.data.description.selected,
      incidentId: m.defects.incident['expandedQcId'],
      comment: m.defects.comments
    };
    return this.http.post(url, body);
  }
  downloadfile(m:Cps, type) {
    let dynamicParam: string[] = [];
    const param: string[] = [];
    dynamicParam.push(`status eq ${m.details.status.from['value']}`)

    if (m.details.mfgDate.from && m.details.mfgDate.to)
      dynamicParam.push(`manufacturingDateTime bt ${Helper.getMomentDate(m.details.mfgDate.from)}|${Helper.getMomentDate(m.details.mfgDate.to)}`)
    else {
      if (m.details.mfgDate.from)
        dynamicParam.push(`manufacturingDateTime ge ${Helper.getMomentDate(m.details.mfgDate.from)}`)
      if (m.details.mfgDate.to)
        dynamicParam.push(`manufacturingDateTime le ${Helper.getMomentDate(m.details.mfgDate.to)}`)
    }
    param.push(`q=${dynamicParam.join(' and ')}`);
    param.push(`SiteId=${m.details.siteId}`);
    param.push(`fields=${m.details.table.columns.selected.map(m =>{return  m['field']}).toString()}`);
    const url = `${environment.baseUrl}${environment.apiVersion}/${ServiceConstants.changepalletstatus}/${type}?${param.join('&')}`;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set('SiteId', sessionStorage.getItem('siteId'));
    return this.http.get(url, { headers: headers, responseType : 'blob' });
  }
  getProducer(m: Cps): Observable<any> {
    const url = `${environment.baseUrl}${environment.apiVersion}/sites/${m.details.siteId}/producer`;
    return this.http.get(url);
  }
}
