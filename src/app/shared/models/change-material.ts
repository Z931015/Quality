import { AppConfig, Quality } from "../util/appConfig";
import { QualityGridConstants } from "../util/stringconstant";
import { AutoComplete, Dropdown, Message, MultiSelect } from "./commonModel";
export class ChangeMaterial {
  private cms: Cms;
  private details: Details;
  private appConfig = new AppConfig();
  getDefault(): Cms {
    this.cms = {
      actionCancelled: true,
      actionMessage: '',
      details: this.getDefaultDetails()
    };
    return this.cms;
  }
  getActual(): Cms {
    return this.cms;
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
      table: this.appConfig.getTableDefaults(QualityGridConstants.CHANGE_MATERIAL_GRID)
    };
    return this.details;
  }
}
export interface Cms {
  actionCancelled: boolean;
  actionMessage: string;
  details: Details,
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
