import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PwmPalletInquiryService } from '../../service/pwm-pallet-inquiry.service';
import { ServiceConstants } from '../../util/service-constants';
import { StringConstant } from '../../util/stringconstant';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'quality-assurance-pwm-material-details',
  templateUrl: './pwm-material-details.component.html',
  styleUrls: ['./pwm-material-details.component.css']
})
export class PwmMaterialDetailsComponent implements OnInit {
  public selectedTab = 'CR';
  public tabs: any;
  public materialConstants: Map<string, string>;
  rowData;
  rowDataBomDetails;
  materialNum: string;
  rowDataChar = [];
  rowDataBOM = [];
  cols: any[];
  bomCols: any[];
  totalRecordsBom: number = 0;
  totalRecordsChar: number = 0;
  selectedRecords: any[] = [];
  materialId;
  siteId;
  message: any;
  messageBom: any;
  error_message: boolean;
  error_messageBom: boolean;
  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private palletInquriyService: PwmPalletInquiryService,
  ) { }

  updateDisplayText() {
    this.materialConstants = new Map([
      ['materialID', 'Material ID'],
      ['materialDescription', 'Material Description'],
      ['oldProductCode', 'Old Product Code'],
      ['abProductCode', 'AB Product Code'],
      ['canGauge', 'Can Gauge'],
      ['layersPerPallet', 'Layers Per Pallet'],
      ['cansPerLayer', 'Cans Per Layer'],
      ['fillType', 'Fill Type'],
      ['canPalletType', 'Can Pallet Type'],
      ['topFrameType', 'Top Frame Type'],
      ['slipSheetType', 'Slip Sheet Type'],
      ['canSize', 'Can Size'],
      ['productType', 'Product Type'],
      ['defaultQuantity', 'Default Quantity'],
      ['shelfLife', 'Shelf Life'],
      ['canDiameter', 'Can Diameter'],
      ['canBottomProfile', 'Can Bottom Profile'],
      ['canShape', 'Can Shape'],
      ['canNeckType', 'Can Neck Type'],
      ['lidsPerBag', 'Lids Per Bag'],
      ['bagsPerPallet', 'Bags Per Pallet'],
      ['lidLabel', 'Lid Label'],
      ['lidDiameter', 'Lid Diameter'],
      ['lidGauge', 'Lid Gauge'],
      ['lidProfile', 'Lid Profile'],
      ['lidOpening', 'Lid Opening'],
      ['lidTabType', 'Lid Tab Type'],
      ['lidTabGauge', 'Lid Tab Gauge'],
      ['lidTabColor', 'Lid Tab Color'],
      ['lidIncising', 'Lid Incising'],
      ['lidCoating', 'Lid Coating'],
      ['shellLabel', 'Shell Label'],
      ['shellDiameter', 'Shell Diameter'],
      ['shellLidGauge', 'Shell Lid Gauge'],
      ['shellLidProfile', 'Shell Lid Profile'],
      ['shellCoating', 'Shell Coating'],
      ['shellColor', 'Shell Color'],
      ['coatingType', 'Coating Type'],
      ['shellLined', 'Shell Lined'],
      ['displayText', 'Display Text']
    ]);
  }

  ngOnInit(): void {
    this.updateDisplayText();
    this.getCols();
    this.getTab();
    this.getDetailsFromParent();
  }

  getCols() {
    this.cols = [
      { field: 'attribute', header: 'Attribute' },
      { field: 'value', header: 'Value' }
    ];
    this.bomCols = [
      { field: 'materialDisplayText', header: 'Material', width: '120px' },
      { field: 'componentID', header: 'Component', width: '80px' },
      { field: 'componentDescription', header: 'Description', width: '185px' },
      { field: 'componentQuantity', header: 'Component Qty', width: '100px' },
      { field: 'componentUOM', header: 'Component UOM', width: '100px' }
    ];
  }

  getTab() {
    this.tabs = [
      { tabName: StringConstant.Characteristics, tabCode: 'CR' },
      { tabName: StringConstant.BOM, tabCode: 'BOM' }
    ];
  }

  getDetailsFromParent() {
    this.materialId = []
    this.activatedRoute.queryParams.subscribe(params => {
      this.siteId = params.siteId
      this.materialId = params.materialId
    });
    this.palletInquriyService.getMaterialCharacteristics(ServiceConstants.GetMaterials, this.materialId, this.siteId).subscribe((res: any) => {
      if (res) {
        this.rowDataChar = res;
        this.totalRecordsChar = this.rowDataChar.length;

        // const objs = res;
        // console.log(objs)
        // this.getMaterials(objs);
        this.materialNum =this.materialId;
        this.message = [];
        this.error_message = false;
      }
      else if (res == null) {
        this.message = 'No Characteristics Data Found For Selected Material Id -' + this.materialId;
        this.error_message = true;
        this.rowDataChar = [];
      }
    });
    this.palletInquriyService.onMaterialHyperLinkBom(ServiceConstants.GetMaterials, this.materialId, this.siteId).subscribe((res: any) => {
      if (res && res['records']) {
        let obj = res['records'];
        this.getBom(obj)
        this.messageBom = [];
        this.error_messageBom = false;
      } else if (res == null) {
        this.messageBom = 'No BOM Data Found For Selected Material Id -' + this.materialId;
        this.error_messageBom = true;
        this.rowDataBOM = [];
      }
    });
  }
  // getAttrValue(attribute: string, value: any) {
  //   let attr = this.materialConstants.has(attribute) ? this.materialConstants.get(attribute) : attribute;
  //   let val = value;
  //   if (attribute.toLocaleLowerCase().endsWith('datetime')) {
  //     val = moment(new Date(value)).format('MM/DD/YYYY HH:MM')
  //   }
  //   return { attribute: attr, value: val };
  // }
  // getMaterials(obj) {
  //   if (obj) {
  //     this.rowDataChar = Object.entries(obj).map(
  //       o => this.getAttrValue(o[0], o[1]))
  //   }
  //   this.totalRecordsChar = this.rowDataChar ? this.rowDataChar.length : 0;
  // }

  getBom(obj) {
    this.rowDataBOM = obj;
    this.totalRecordsBom = this.rowDataBOM ? this.rowDataBOM.length : 0;
  }

  back(event) {
    if (event.type === 'click') {
      this.location.back();
    }
  }

  onPrint(type) {
    let data = {
      'siteId': sessionStorage.getItem('siteId'),
      'materialId': this.materialNum,
    }
    if (type === 'CR') {
      this.palletInquriyService.printGridCrPdf(ServiceConstants.GetMaterials, data).subscribe(data => {
        const downloadFile = (data, fileName) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(data);
          link.download = fileName;
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(link.href), 7000);
        };
        downloadFile(new Blob([data]), 'characteristics.pdf');
      });
    } else {
      this.palletInquriyService.printGridBomPdf(ServiceConstants.GetMaterials, data).subscribe(data => {
        const downloadFile = (data, fileName) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(data);
          link.download = fileName;
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(link.href), 7000);
        };
        downloadFile(new Blob([data]), 'bom.pdf');
      });
    }
  }

}
