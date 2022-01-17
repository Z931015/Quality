import { AppConfig, Quality } from "../util/appConfig";
import { QualityGridConstants } from "../util/stringconstant";
import { AutoComplete, Dropdown, Message, MultiSelect } from "./commonModel";
// eslint-disable-next-line @typescript-eslint/no-namespace
export class ChangePalletStatusModel {
  private cps: Cps;
  private details: Details;
  private defects: Defects;
  private rework: Rework;
  private appConfig = new AppConfig();
  getDefault(): Cps {
    this.cps = {
      actionCancelled: true,
      actionMessage: '',
      details: this.getDefaultDetails(),
      defects: this.getDefaultDefects(),
      rework: this.getDefaultRework()
    };
    return this.cps;
  }
  getActual(): Cps {
    return this.cps;
  }
  getDefaultDetails(): Details {
    this.details = {
      siteId: Number(sessionStorage.getItem('siteId')),
      siteType: Number(sessionStorage.getItem("siteTypeKey")),
      producer: { id: sessionStorage.getItem('siteId'), description: sessionStorage.getItem('plantName') },
      palletId: '',
      status: { from: 'Available', to: '' },
      mfgDate: { from: new Date(new Date().setHours(0, 0, 0, 0)), to: new Date(new Date().setHours(23, 59, 0, 0)) },
      material: '',
      actionMenu: [],
      message: { show: false, onTop: true, content: {} },
      data: {
        producer: { actual: [] },
        status: { actual: [] },
        material: { actual: [], filtered: [] },
      },
      table: this.appConfig.getTableDefaults(QualityGridConstants.PALLET_STATUS_CHANGE_GRID)
    };
    return this.details;
  }
  getDefaultDefects(): Defects {
    this.defects = {
      siteId: Number(sessionStorage.getItem('siteId')),
      showDefects:true,
      incident: '',
      category: {},
      description: [],
      comments: '',
      data: {
        incident: { actual: [], filtered: [] },
        category: { actual: [], filtered: [] },
        description: { actual: [], selected: [] },
      },
      table: this.appConfig.getTableDefaults(QualityGridConstants.PALLET_STATUS_CHANGE_DEFECTS_GRID)
    };
    return this.defects;
  }
  getDefaultRework(): Rework {
    this.rework = {
      siteId: Number(sessionStorage.getItem('siteId')),
      material: { data: [], reworkQuantity: 0, maxQuantity: 0 },
      quantity: { actual: 0, maxRecover: 0, recover: 0 },
      data: { material: { actual: [], filtered: [] }, containerType: { actual: [], filtered: [] } },
      table: this.appConfig.getTableDefaults(QualityGridConstants.PALLET_REWORK_GRID)
    };
    return this.rework;
  }
}
export interface Cps {
  actionCancelled: boolean;
  actionMessage: string;
  details: Details,
  defects: Defects,
  rework: Rework
}
export interface Details {
  siteId: number;
  siteType: number;
  producer: { id: string, description: string };
  palletId?: string;
  status: { from: any, to: any };
  mfgDate?: { from?: Date, to?: Date };
  material?: string;
  actionMenu: any;
  message: { show: boolean, onTop?: boolean, content: Message };
  data: {  producer: Dropdown, status: Dropdown, material: AutoComplete };
  table: Quality.Table;
}
export interface Defects {
  siteId: number;
  showDefects:boolean;
  incident: any;
  category: Object;
  description: any;
  comments: string;
  data: { incident: AutoComplete, category: AutoComplete, description: MultiSelect };
  table: Quality.Table;
}
export interface Rework {
  siteId: number;
  userSuppliedManufactureDate?: Date;
  containerType?: any;
  noOfCopies?: number;
  material: { data: any, reworkQuantity: number, maxQuantity: number };
  quantity: { actual: number, maxRecover: number, recover: number };
  data: { material: AutoComplete, containerType: AutoComplete };
  table: Quality.Table;
}
