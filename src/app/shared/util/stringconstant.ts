export class StringConstant {
    //App domain
    public static LocalHost = 'localhost';
    public static NazPwmWebAuth = 'pwmdev.52.154.157.71.nip.io';
    public static NazPwmWebQa = 'pwmqa.20.40.242.129.nip.io';
    public static NazPwmWeb = 'pwmabpg.anheuser-busch.com';
    static prodRedirectUrl: any;

    // Extend Expiry Date
    public static CommomErrorMsg='Something went wrong, please try after sometime';
    public static PalletUrl = '/quality-assurance/palletDetails';
    public static MaterialUrl = '/quality-assurance/materialDetails';
    public static PalletRout = 'quality-assurance/palletDetails';
    public static SelectedRadioExtended = 'Extended Expiration Date';
    public static ExtendedParentPage = '/quality-assurance/extend-expiration-date'
    public static PalletParentPage = 'quality-assurance/pallet-inquiry';
    public static ChangePalletStatus = 'quality-assurance/change-pallet-status';
    public static ChangePalletStatusDefects = '/quality-assurance/change-pallet-status/defects';
    public static ChangePalletStatusReWork = '/quality-assurance/change-pallet-status/rework';
    public static ChangePalletStatusReWorkPrint = 'quality-assurance/change-pallet-status/rework/print';
    public static ConsumePartialPallet = 'quality-assurance/consume-partial-pallets';
    public static SelectedRadioPallet = 'Pallet Inquiry';
    public static ToolTip = 'View Details';
    public static CurrentTittleExtended = 'Extend Expiration Date/Pallet Inquiry';
    public static CurrentTittlePallet = 'Pallet Inquiry';
    public static ExtendedTable = 'extendedTable';
    public static PalletTable = 'palletTable';
    public static FeildPallet = 'palletId';
    public static FeildMaterial = 'materialDisplayText';
    public static SaveMsg = 'Saved successfully for selected PalletId(s): ';
    public static ClearMsg = 'Updated successfully for selected PalletId(s): ';
    // public static NoDate = 'No Data Found.';
    // public static NoDateSelectedMat = 'No Data Found For Selected Material-'
    public static DateZ = 'YYYY-MM-DD HH:mm:ss.SSS';
    public static Date = 'YYYY-MM-DD HH:mm:ss';
    public static DateOnly = 'MM/DD/YYYY';
    public static DateSZ = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
    public static Save = 'Are you sure you want to change the Manual Expiration Date of the selected pallet to {0} ?';
    public static maualDateErr = 'Manual Expiration date need to be a future date from current date '
    public static Qes = ' ?';
    public static Clear = 'Are you sure you want to clear the Manual Override of the Expiration Date for these selected pallets ?';
    public static BttSave = 'save';
    public static BttClear = 'clear';
    public static Header = 'header';
    public static MatExtErrMsg = 'Enter Material and Extend Expiration Date';
    public static MatErrMsg = 'Enter Material';
    public static ExtErrMsg = 'Enter Extend Expiration Date';
    public static PalletIdErrMsg = 'Thru Pallet id cannot be less than From Pallet Id';
    public static DateErrMsg = 'From Date cannot be greater than To Date ';
    public static InvalidDate = 'Invalid Date';
    public static Err = 'error';
    public static Success = 'success';
    public static Characteristics = 'Characteristics';
    public static BOM = 'BOM';
    public static QualityAssurance = 'Quality Assurance';
    public static wariningMsgForCombinePallet='Currently there are no pallets in the selection. Please Scan or Enter a new pallet Id.'
    public static combineErrorMsg= 'All consumed pallet must have same material Id';
    public static palletAlreadyScannedMsg= "This pallet was already scanned";
    public static noDataFoundMsg= "No Records Found";
    public static itemSize="28"
    public static QCOrCategoryAndDefectValidation="Please select an existing QC Incident or specific defects.";
    public static QCOrCategoryValidation="Please select an existing QC Incident or specific defects, but not both.";
    public static StatusValidationMsg = "Please select status";
    public static SuccessMsgForStatusUpdation = "Status successfully changed to {0} for the selected pallet(s): {1}";
    // //Html Constants
    // public static Extended = 'Extended Expiration Date/Pallet Inquiry';
    // public static PalletIdRange = 'Pallet ID Range:';
    // public static From = 'From:';
    // public static Thru = 'Thru:';
    // public static To = 'To:';
    // public static ManDate = 'Manufactured Date:';
    // public static Mat = 'Material:';
    // public static Ext = 'Extended Expiry Date:';
    // public static Manual = 'Manual Expiration Date';
    // public static Reset = 'Reset';
    // public static Search = 'Search';
    // public static ClearBtt = 'Clear Exp.Date';
    // public static SaveBtt = 'Save';
    // public static SelectAll = 'Select ALL';
    // public static Cancel = 'Cancel';
    // public static Ok = 'Ok';
    // public static Back = 'Back';
    // public static Print = 'Print'
    // public static PalletDetails = 'Pallet Details'
    // Consume Partial Pallets
    public static recoveredQtyIsGreater = "Pallet with Recovered quantity greater than Default Quantity cannot be Re-Worked"
    public static recoverdQtyError = "Please check the recovered amount for pallets {0}. A pallet with a recovered quantity of 0 is scrapped, not Re-Worked."
    public static noRecoveredQty = "Pallet with Recovered quantity of 0 cannot be Re-Worked";
    public static qtyGreaterThanRecoveredQty = "Please check the recovered amount for pallet {0} Recovered Quantity cannot be greater than total quantity";
    public static materialIdDifferentMsg = "Pallet with different Material Id cannot be Re-Worked"
    public static noPrintQuantity = "Print quantity cannot be zero"
    public static DateTime = 'MM/dd/yyyy HH:mm:ss';
    public static FieldStatus = 'status';
    public static LineKey = 'lineKey';
    public static LineId = 'lineId';
    public static Description = 'description';
    public static MaterialMismatchOnSelectPallet = 'This pallet does not match the material currently scheduled for this line';
    public static Blocked = 'Blocked';
    public static MillClaim = 'Mill Claim';
    public static MillClaimParam = 'MillClaim';
    public static Hold = 'Hold';
    public static Scrap = 'Scrap';
    public static Void = 'Void';
    public static Dead = 'Dead';
    public static Rework = 'Rework';

    public static MaterialMismatchOnSelectLine  = 'The selected pallet does not match the current material scheduled for this line';
    public static Available = 'A';
    public static StatusAvailable = "Available";
    public static RequestDateFormat = 'yyyy-MM-dd HH:mm:ss';
    public static ConsumePartialPalletMessage = 'Pallet was successfully consumed into line ';
    public static NoActiveMaterial = 'No current material found for line ';
    public static pTableFilterMatchMode: Map<string, string> = new Map([['dateFilter', 'ge'], ['contains', 'lk']]);
    public static ResponseOk = "OK";
    public static Empty = '';
    public static AreYouSureMsg = 'Are you sure want to change the status from';
    public static PalletIdValidationMsg = "Please enter valid Pallet Id";
    public static SelectCategoryValidationMsg = "Please select category and description";
    public static DatewithTime = 'MM/DD/YYYY HH:mm'
    public static Create = "Create";
    public static Edit = "Edit";
    public static SuccessMessageForDelete = 'Record deleted successfully';
    public static DateTimeFormat = 'MM/dd/yyyy HH:mm';
    public static UnformattedDate = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    public static StatusFilterForDSP = 'SendStatus ne D';
    public static Limit = 15;
    public static Offset = 0;
    public static DSPDetails = 'DSP Details';

    public static Block = 'Block';
    public static Re_Work = 'Re-Work';
    public static Release = 'Release';
}

export class RouteConstants {
    public static fromcombinePalletScreen='quality-assurance/combine-pallets';
    public static MaterialRoute = 'quality-assurance/materialDetails';
    public static ChangePalletStatus = 'quality-assurance/change-pallet-status';
    public static ShippingParameterDetails = '/quality-assurance/definable-shipping-parameters/details';
    public static ShippingParameterGrid = 'quality-assurance/definable-shipping-parameters';
}
export class QualityGridConstants {
    public static PALLET_INQUIRY_GRID = "PalletInquiryGrid"
    public static PALLET_STATUS_CHANGE_GRID = "PalletStatusChangeGrid"
    public static PALLET_REWORK_GRID = "PalletReworkGrid"
    public static PALLET_STATUS_CHANGE_DEFECTS_GRID = "PalletStatusChangeDefectsGrid"
    public static COMBINE_PALLET_GRID = "CombinePalletGrid"
    public static DSP_GRID = "DSPGrid"
    public static CHANGE_MATERIAL_GRID = "ChangeMaterialGrid"
}
