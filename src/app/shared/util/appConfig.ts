import { QualityGridConstants } from "./stringconstant"
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Quality {
  export interface Defaults {
    date: Calander;
    autoComplete: AutoComplete;
  }
  export interface Calander {
    min: Date;
    max: Date;
    placeholder: string;
    dateFormat: string;
    hourFormat: string;
    yearRange: string;
  }
  export interface AutoComplete {
    virtualScroll: boolean
    itemSize: number
    emptyMessage: string
  }
  export declare class Table {
    key: string
    show: boolean | false
    rows: number | 15
    lazy: boolean | true
    filterDelay: number | 300 | 400 | 500
    paginator: boolean | true
    autoLayout: boolean | true
    selectionMode: string | 'multiple'
    loading: boolean | false;
    columns: { actual: Columns[] | null, selected: Columns[] | null }
    data: { totalRecords: number | 0, records: { actual: any[] | null, selected: any[] | null } }
    filter?: { query?: string[], limit?: number | 0, offset?: number | 0, order?: string, sort?: string }
    clear(): void;
  }
  export interface Columns {
    field: string
    header: string
    width?: string
    searchWidth?: string
    placeholder?: string
    height?: string
    sort?: boolean
    search?: boolean
    type?: string
  }

}

export class AppConfig {
  readonly defaults: Quality.Defaults = {
    date: { min: new Date(1990, 0, 1), max: new Date(2100, 11, 31), placeholder: 'MM/DD/YYYY HH:MM', dateFormat: 'mm/dd/yy', hourFormat: '24', yearRange: '1990:2100' },
    autoComplete: { virtualScroll: true, itemSize: 32, emptyMessage: '' }
  };
  private palletInquiryGrid: Quality.Columns[] = [
    { field: "status", header: "Status", width: '6%', searchWidth: '66px', height: '22px', placeholder: 'Enter Status' },
    { field: "palletId", header: "Pallet ID", width: '8%', searchWidth: '84px', height: '22px', placeholder: 'Enter Pallet ID' },
    { field: "materialDisplayText", width: '17%', header: "Material Description", searchWidth: '160px', height: '22px', placeholder: 'Enter Material Description' },
    { field: "qcIncident", header: "QC", width: '2%', height: '22px', placeholder: 'Enter QC' },
    { field: "manufacturingDateTime", width: '10%', header: "Manufactured Date", },
    { field: "lineId", header: "Line", width: '5%', searchWidth: '52px', height: '22px', placeholder: 'Enter Line' },
    { field: "shiftId", header: "Shift", width: '5%', searchWidth: '55px', height: '22px', placeholder: 'Enter Shift' },
    { field: "crewId", header: "Crew", width: '5%', searchWidth: '62px', height: '22px', placeholder: 'Enter Crew' },
    { field: "quantity", header: "Quantity", width: '7%' },
    { field: "overridableExpirationDateTime", width: '10%', header: "Overridable Expiration", height: '22px', placeholder: 'Enter Overridable Expiration' },
    { field: "nonOverridableExpirationDateTime", width: '10%', header: "Non-Overridable Expiration", height: '22px', placeholder: 'Enter Non-Overridable Expiration' },
    { field: "expirationDateTime", header: "Expiration Date Override", width: '10%', height: '22px', placeholder: 'Enter "Expiration Date Override' },
    { field: "producerId", header: "Producer", width: '6%', searchWidth: '85px', height: '22px', placeholder: 'Enter Producer' },
    { field: "reserved", header: "Reserved", width: '6%', searchWidth: '75px', height: '22px', placeholder: 'Enter Picked' }]

  private dspGrid: Quality.Columns[] = [{ field: 'dspNumber', header: 'DSP Number', sort: true, placeholder: 'Enter DSP Number', width: '10%', search: true },
  { field: 'status', header: 'Status', sort: true, placeholder: 'Enter Status', width: '10%', search: true },
  { field: 'producerId', header: 'Producer', sort: true, placeholder: 'Enter Producer ID', width: '10%', search: true },
  { field: 'comments', header: 'Comments', sort: true, placeholder: 'Enter Comments', search: true },
  { field: 'lastUser', header: 'Last User', sort: true, width: '10%', search: false },
  { field: 'lastUpdateDateTime', header: 'Last Updated', sort: true, width: '10%', search: false }
  ]

  private palletStatusChangeGrid: Quality.Columns[] = [
    { field: 'palletId', header: 'Pallet ID', type: 'string', placeholder: 'Enter Pallet ID', searchWidth: '84px', sort: true, search: true, width: '8%' },
    { field: 'status', header: 'Status', type: 'string', placeholder: 'Enter', searchWidth: '66px', sort: false, search: false, width: '6%' },
    { field: 'materialDisplayText', header: 'Material Description', placeholder: 'Enter Material Description', searchWidth: '160px', type: 'string', sort: true, search: true, width: '17%' },
    { field: 'qcIncident', header: 'QA#', type: 'number', placeholder: 'Enter', sort: true, search: false, width: '2%' },
    { field: 'manufacturingDateTime', header: 'Manufactured Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '10%' },
    { field: 'lineId', header: 'Line', type: 'string', placeholder: 'Enter Line', searchWidth: '52px', sort: true, search: true, width: '5%' },
    { field: 'shiftId', header: 'Shift', type: 'string', placeholder: 'Enter Shift', searchWidth: '55px', sort: true, search: true, width: '5%' },
    { field: 'crewId', header: 'Crew', type: 'string', placeholder: 'Enter Crew', searchWidth: '62px', sort: true, search: true, width: '5%' },
    { field: 'quantity', header: 'Quantity', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'expirationDateTime', header: 'Expiration Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '10%' },
    { field: 'producerId', header: 'Producer', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'reserved', header: 'Picked', type: 'string', placeholder: 'Enter Picked', searchWidth: '75px', sort: true, search: true, width: '6%' },
    { field: 'fakeId', header: 'Pallet Ticket', type: 'string', placeholder: 'Enter Pallet Ticket', searchWidth: '84px', sort: true, search: true, width: '9%' }
  ];
  private palletReworkChangeGrid: Quality.Columns[] = [
    { field: 'recoveredQty', header: 'Recovered Quantity', type: 'number', placeholder: 'Enter recovered quantity', searchWidth: '84px', sort: true, search: true, width: '10%' },
    { field: 'palletId', header: 'Pallet ID', type: 'string', placeholder: 'Enter Pallet ID', searchWidth: '84px', sort: true, search: true, width: '8%' },
    { field: 'qcIncident', header: 'QA#', type: 'number', placeholder: 'Enter', sort: true, search: false, width: '2%' },
    { field: 'manufacturingDateTime', header: 'Manufactured Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '10%' },
    { field: 'lineId', header: 'Line', type: 'string', placeholder: 'Enter Line', searchWidth: '52px', sort: true, search: true, width: '5%' },
    { field: 'shiftId', header: 'Shift', type: 'string', placeholder: 'Enter Shift', searchWidth: '55px', sort: true, search: true, width: '5%' },
    { field: 'crewId', header: 'Crew', type: 'string', placeholder: 'Enter Crew', searchWidth: '62px', sort: true, search: true, width: '5%' },
    { field: 'quantity', header: 'Quantity', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'expirationDateTime', header: 'Expiration Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '10%' },
    { field: 'producerId', header: 'Producer', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'status', header: 'Status', type: 'string', placeholder: 'Enter', searchWidth: '66px', sort: false, search: false, width: '6%' },
    { field: 'reserved', header: 'Picked', type: 'string', placeholder: 'Enter Picked', searchWidth: '75px', sort: true, search: true, width: '6%' },
    { field: 'fakeId', header: 'Pallet Ticket', type: 'string', placeholder: 'Enter Pallet Ticket', searchWidth: '84px', sort: true, search: true, width: '9%' }
  ];

  private combinePalletGrid: Quality.Columns[] = [
    { header: 'Pallet', field: 'palletId', sort: true },
    { header: 'Manufactured Date', field: 'manufacturingDateTime', sort: true },
    { header: 'Version', field: 'versionId', sort: true },
    { header: 'Batch Number', field: 'batchNumber', sort: true },
    { header: 'Line', field: 'crewId', sort: true },
    { header: 'Shift', field: 'shiftId', sort: true },
    { header: 'Crew', field: 'crewId', sort: true },
    { header: 'Quantity', field: 'quantity', sort: true },
    { header: 'Pallet Ticket', field: 'palletId', sort: true }
  ]

  private palletStatusChangeDefectsGrid: Quality.Columns[] = [
    { field: 'palletId', header: 'Pallet ID', type: 'string', placeholder: 'Enter Pallet ID', searchWidth: '84px', sort: true, search: true, width: '7%' },
    { field: 'status', header: 'Status', type: 'string', placeholder: 'Enter', searchWidth: '66px', sort: false, search: false, width: '5%' },
    { field: 'materialDisplayText', header: 'Material Description', placeholder: 'Enter Material Description', searchWidth: '160px', type: 'string', sort: true, search: true, width: '15%' },
    { field: 'qcIncident', header: 'QA#', type: 'number', placeholder: 'Enter', sort: true, search: false, width: '4%' },
    { field: 'manufacturingDateTime', header: 'Manufactured Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '12%' },
    { field: 'lineId', header: 'Line', type: 'string', placeholder: 'Enter Line', searchWidth: '52px', sort: true, search: true, width: '5%' },
    { field: 'shiftId', header: 'Shift', type: 'string', placeholder: 'Enter Shift', searchWidth: '55px', sort: true, search: true, width: '5%' },
    { field: 'crewId', header: 'Crew', type: 'string', placeholder: 'Enter Crew', searchWidth: '62px', sort: true, search: true, width: '5%' },
    { field: 'quantity', header: 'Quantity', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'expirationDateTime', header: 'Expiration Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '11%' },
    { field: 'producerId', header: 'Producer', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'reserved', header: 'Picked', type: 'string', placeholder: 'Enter Picked', searchWidth: '75px', sort: true, search: true, width: '5%' },
    { field: 'fakeId', header: 'Pallet Ticket', type: 'string', placeholder: 'Enter Pallet Ticket', searchWidth: '84px', sort: true, search: true, width: '9%' }
  ];
  private changeMaterialGrid: Quality.Columns[] = [
    { field: 'palletId', header: 'Pallet ID', type: 'string', placeholder: 'Enter Pallet ID', searchWidth: '84px', sort: true, search: true, width: '7%' },
    { field: 'materialDisplayText', header: 'Material Description', placeholder: 'Enter Material Description', searchWidth: '160px', type: 'string', sort: true, search: true, width: '15%' },
    { field: 'qcIncident', header: 'QA#', type: 'number', placeholder: 'Enter', sort: true, search: false, width: '4%' },
    { field: 'manufacturingDateTime', header: 'Manufactured Date', placeholder: 'Enter', type: 'string', sort: true, search: false, width: '12%' },
    { field: 'lineId', header: 'Line', type: 'string', placeholder: 'Enter Line', searchWidth: '52px', sort: true, search: true, width: '5%' },
    { field: 'shiftId', header: 'Shift', type: 'string', placeholder: 'Enter Shift', searchWidth: '55px', sort: true, search: true, width: '5%' },
    { field: 'crewId', header: 'Crew', type: 'string', placeholder: 'Enter Crew', searchWidth: '62px', sort: true, search: true, width: '5%' },
    { field: 'quantity', header: 'Quantity', type: 'string', placeholder: 'Enter', searchWidth: '85px', sort: true, search: false, width: '7%' },
    { field: 'batch', header: 'Batch Number', type: 'string', placeholder: 'Enter', searchWidth: '66px', sort: false, search: false, width: '5%' },
    { field: 'status', header: 'Status', type: 'string', placeholder: 'Enter', searchWidth: '66px', sort: false, search: false, width: '5%' },
    { field: 'reserved', header: 'Picked', type: 'string', placeholder: 'Enter Picked', searchWidth: '75px', sort: true, search: true, width: '5%' },
    { field: 'fakeId', header: 'Pallet Ticket', type: 'string', placeholder: 'Enter Pallet Ticket', searchWidth: '84px', sort: true, search: true, width: '9%' }
  ];
  private gridColumns: Map<string, Array<Quality.Columns>> = new Map([
    [QualityGridConstants.PALLET_INQUIRY_GRID, this.palletInquiryGrid],
    [QualityGridConstants.PALLET_STATUS_CHANGE_GRID, this.palletStatusChangeGrid],
    [QualityGridConstants.COMBINE_PALLET_GRID, this.combinePalletGrid],
    [QualityGridConstants.DSP_GRID, this.dspGrid],
    [QualityGridConstants.PALLET_STATUS_CHANGE_DEFECTS_GRID, this.palletStatusChangeDefectsGrid],
    [QualityGridConstants.PALLET_REWORK_GRID, this.palletReworkChangeGrid],
    [QualityGridConstants.CHANGE_MATERIAL_GRID,this.changeMaterialGrid]
  ]);
  getTableDefaults(key: string): Quality.Table {
    const columns = this.gridColumns.get(key);
    return {
      key: key,
      show: false,
      rows: 15,
      autoLayout: true,
      lazy: true,
      filterDelay: 500,
      paginator: true,
      loading: false,
      selectionMode: 'multiple',
      data: { totalRecords: 0, records: { actual: [], selected: [] } },
      columns: { actual: columns, selected: columns },
      filter: { query: [], limit: 15, offset: 0 },
      clear: function () {
        this.loading = false;
        this.data.records.actual = [];
        this.data.records.selected = [];
        this.data.totalRecords = 0,
        this.filter= { query: [], limit: 15, offset: 0 }
      }
    };
  }
}


