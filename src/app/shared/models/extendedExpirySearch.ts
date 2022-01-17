import { Quality,AppConfig } from "../util/appConfig";
import { QualityGridConstants } from "../util/stringconstant";
import { AutoComplete, Message } from "./commonModel";

/**
 * Helper calss for EE Search
 */
export class ExtendedExpirySearch {
  private model: IExtendExpiryModel;
  private appConfig = new AppConfig();
  getDefault(): IExtendExpiryModel {
    this.model = {
      siteId: sessionStorage.getItem('siteId'),
      pallet: { from: '', to: '' },
      mfgDate: { from: null, to: null },
      material: '',
      extendExpiryDate: null,
      manualExpiryDate: false,
      message: { show: false, onTop: true, content: {} },
      data: {
        palletFrom: { actual: [], filtered: [] },
        palletTo: { actual: [], filtered: [] },
        material: { actual: [], filtered: [] },
      },
      table: this.appConfig.getTableDefaults(QualityGridConstants.PALLET_INQUIRY_GRID)
    };
    return this.model;
  }
  getActual(): IExtendExpiryModel {
    return this.model;
  }
  SiteId: string;
  MaterialId: number;
  ExtendedDate: string;
  ManualCheckedOrNot: boolean;
  FromPalletId: string;
  ThruPalletId: string;
  FromDate: string;
  ToDate: string;
  Limit: number;
  Offset: number;
  OrderBy: string;
  SortBy: string;
  Query: string[];
}
export interface IExtendExpiryModel {
  siteId: string;
  pallet?: { from?: string, to?: string };
  mfgDate?: { from?: Date, to?: Date };
  material?: string;
  extendExpiryDate?: Date;
  manualExpiryDate?: boolean;
  message: { show: boolean, onTop?: boolean, content: Message };
  data: { palletFrom: AutoComplete, palletTo: AutoComplete, material: AutoComplete };
  table: Quality.Table;
}

