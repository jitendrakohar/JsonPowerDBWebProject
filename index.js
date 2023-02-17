

var connToken = "90932575|-31949277808887706|90948894";
var customerDBName = "Customer-DB";
var customerRelationName = "CustomerData";

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";

//Shipment-No., Description, Source, Destination, Shipping-Date, Expected-Delivery-Date

function validateAndGetFormData() {

    var ShipmentNo = $("#Shipment-No").val();
    if (ShipmentNo === "") {
        alert("Shipment-No Required Value");
        $("#Shipment-No").focus();
        return "";
    }
    var Description = $("#Description").val();
    if (Description === "") {
        alert("Description is Required Value");
        $("#Description").focus();
        return "";
    }

    var Source = $("#Source").val();
    if (Source === "") {
        alert("Source is Required Value");
        $("#Source").focus();
        return "";
    }
    var Destination = $("#Destination").val();
    if (Destination === "") {
        alert("Destination is Required Value");
        $("#Destination").focus();
        return "";
    }
    var ShippingDate = $("#Shipping-Date").val();
    if (ShippingDate === "") {
        alert("Shipping-Date is Required Value");
        $("#Shipping-Date").focus();
        return "";
    }
    var ExpectedDeliveryDate = $("#Expected-Delivery-Date").val();
    if (ExpectedDeliveryDate === "") {
        alert("Expected-Delivery-Date is Required Value");
        $("#empDeduction").focus();
        return "";
    }

   
    var jsonStrObj = {
        shipmentNo: ShipmentNo,
        description: Description,
        source: Source,
        destination: Destination,
        shippingDate: ShippingDate,
        expectedDeliveryDate: ExpectedDeliveryDate
    };

    return JSON.stringify(jsonStrObj);
}
 //Shipment-No., Description, Source, Destination, Shipping-Date, Expected-Delivery-Date


function resetForm() {
    $("#Shipment-No").val("")
    $("#Description").val("");
    $("#Source").val("")
    $("#Destination").val("");
    $("#Shipping-Date").val("");
    $("#Expected-Delivery-Date").val("");
    $("#Shipment-No").focus();
    $("#customerSave").prop("disabled", true)
    $("#customerChange").prop("disabled", true)
    $("#customerReset").prop("disabled", true)
}
function saveCustomer() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr == "") {
        return;
    }
    alert("saveCustomer  clicked")
    var putReqStr = createPUTRequest(connToken,
        jsonStr, customerDBName, customerRelationName);
    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,
        jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#Shipment-No").focus()
}

function changeData() {
    $("#customerChange").prop("disabled", true);
    jsonChg = validateAndGetFormData();

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, customerDBName, customerRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetForm();
    $("#Shipment-No").focus()
}

function getEmp() {
    $("#customerSave").prop("disabled", false)
    $("#customerChange").prop("disabled", false)
    $("#customerReset").prop("disabled", false)
    var customerJsonObj = getCustomerSNAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(connToken, customerDBName, customerRelationName, customerJsonObj);
    
    jQuery.ajaxSetup({ async: false });
    
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  
    
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#customerSave").prop("disabled", false);
        $("#customerReset").prop("disabled", false);
        $("#customerChange").prop("disabled", true);
        $("#Description").focus();
        
    }
    else if (resJsonObj.status === 200) {
        fillData(resJsonObj);
        $("#customerChange").prop("disabled", false);
        $("#customerReset").prop("disabled", false);
        $("#customerSave").prop("disabled", true);

    }



}
function getCustomerSNAsJsonObj() {
    var ShipmentNo = $("#Shipment-No").val();
    var jsonStr = {
        shipmentNo: ShipmentNo
    };
    return JSON.stringify(jsonStr);

}
function fillData(jsonObj) {

    alert(JSON.stringify(jsonObj))
    saveRecNoZLS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#Shipment-No").val(record.shipmentNo);
    $("#Description").val(record.description);
    $("#Source").val(record.source);
    $("#Destination").val(record.destination);
    $("#Shipping-Date").val(record.shippingDate);
    $("#Expected-Delivery-Date").val(record.expectedDeliveryDate);
}

function saveRecNoZLS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
    $("#Shipment-No").prop("disabled", false);
}


