var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$('#customerheader').html("Local forecast </br>");

moment.updateLocale('en-gb', {
});

var viewlist = function(key) {
   
        var row="";
        var tabledata=[];
        var diff1="";
        var diff2="";
        var diff3="";
        var diff4="";
        var localTM3="";
        
        $.ajax({
            type: "GET",
            url: "http://10.7.3.34/forecast/local_data.php?action=localviewlist",
            cache: false,
            dataType: "json",
            success: function(data) {

                if(data.length>0){

                    for (i = 0; i <data.length; i++) {
                        
                        if(data[i].TM3 !== null){
                            LocalTM3= data[i].TM3;
                        }else{
                            LocalTM3='';
                        }
                        row={"CustNo": data[i].Customer,"CustName": data[i].CustomerName, "CustItemNo":data[i].CustItemNo, "ItemNo":data[i].ItemNo,"ItemName":data[i].ItemNo + " | " + data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period,"UpdateStatus":'', "One": data[i].one, "PREV1":data[i].PREV1,"Two": data[i].two,"PREV2":data[i].PREV2, "Three": data[i].three,"PREV3":data[i].PREV3, "Four": data[i].four,"PREV4":data[i].PREV4, "Five": data[i].five, "TNR": data[i].TNR, "Status":LocalTM3,"UPDC":data[i].UPDC};

                        tabledata.push(row);
                    }
                    $('#customerheader').html("Local forecast </br> Year: " + data[0].Year + " Period: " + data[0].Period);
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'One', title: moment(data[0].Period,"MM").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Two', title: moment(data[0].Period,"MM").add(1,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Three', title: moment(data[0].Period,"MM").add(2,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Four', title: moment(data[0].Period,"MM").add(3,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Five', title: moment(data[0].Period,"MM").add(4,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('refreshOptions', {});
                    $('#itemtable').bootstrapTable("load", tabledata);
                    
                }
            }
        });
};

var viewrecipients = function(key) {
   
        var row="";
        var tabledatarec=[];
        
        $.ajax({
            type: "GET",
            url: "http://10.7.3.34/forecast/local_data.php?action=localviewrecipients",
            cache: false,
            dataType: "json",
            success: function(data) {

                if(data.length>0){
                    
                    var customer="";
                    var status="";
                    var TOemail="";
                    var CCemail="";
                    
                    for (i = 0; i <data.length; i++) {
                        
                        if(data[i].CustomerM3 !== null && data[i].CustomerFC !== null){
                            customer=data[i].CustomerFC;
                            status=1;
                        }
                        else if(data[i].CustomerM3 !== null){
                            customer=data[i].CustomerM3;
                            status=0;
                        }else if(data[i].CustomerFC !== null){
                            customer=data[i].CustomerFC;
                            status=1;
                        }
                        
                        row={"Customer": customer,"CustomerName": data[i].CustomerName,"Status": status, "TOemail":data[i].TOemail, "CCemail":data[i].CCemail};

                        tabledatarec.push(row);
                    }
                    $('#recipientstable').bootstrapTable("load", tabledatarec);
                    
                }
            }
        });
};

$("#updateM3datasetforecastbutton").click(function () {

    var count=0;
    data=$('#itemtable').bootstrapTable('getData');

    for (i = 0; i < data.length; i++) {

        var listdata={
            'Index': i,
            'customer': data[i].CustNo,
            'item': data[i].ItemNo,
            'year': data[i].Year,
            'period': data[i].Period,
            'oneY':  moment(data[0].Period,"MM").add(0,"M").format("YYYY"),
            'oneP':  moment(data[0].Period,"MM").add(0,"M").format("M"),
            'oneQ': data[i].One,
            'twoY':  moment(data[0].Period,"MM").add(1,"M").format("YYYY"),
            'twoP':  moment(data[0].Period,"MM").add(1,"M").format("M"),
            'twoQ': data[i].Two,
            'threeY':  moment(data[0].Period,"MM").add(2,"M").format("YYYY"),
            'threeP':  moment(data[0].Period,"MM").add(2,"M").format("M"),
            'threeQ': data[i].Three,
            'fourY':  moment(data[0].Period,"MM").add(3,"M").format("YYYY"),
            'fourP':  moment(data[0].Period,"MM").add(3,"M").format("M"),
            'fourQ': data[i].Four,
            'fiveY':  moment(data[0].Period,"MM").add(4,"M").format("YYYY"),
            'fiveP':  moment(data[0].Period,"MM").add(4,"M").format("M"),
            'fiveQ': data[i].Five
        };

       $.ajax({
            url: "http://10.7.3.34/forecast/local_data.php?action=UpdateM3",
            type: "POST",
            data: listdata,
            dataType: "json",
            success: function (reply) {
                count++;
                if(reply.Resultat=="1"){
                    $('#itemtable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'Status',
                    value: '<i class="fas fa-arrow-right" style="color:green;"></i>M3 ' + reply.Date
                });
                }
            }
        });
        
    }

});

$('#itemtable').on('editable-save.bs.table', function (a,b,data,row) {
    
    var PrevStatus="";
    
    var listdata={
        'index': row,
        'customer': data.CustNo,
        'item': data.ItemNo,
        'year': data.Year,
        'period': data.Period,
        'one': data.One,
        'two': data.Two,
        'three': data.Three,
        'four': data.Four,
        'five': data.Five,
        'tnr': data.TNR
    };

    $.ajax({
        url: "http://10.7.3.34/forecast/local_data.php?action=UpdateForecast",
        type: "POST",
        data: listdata,
        dataType: "json",
        success: function (reply) {
            
            $('#itemtable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'UpdateStatus',
                    value: '<i class="fas fa-check" style="color:green;"></i>'
                });
            
            setTimeout(function() {
                $('#itemtable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'UpdateStatus',
                    value: ''
                });
            }, 1000); 
            
        }
    });
        
});

$('#recipientstable').on('editable-save.bs.table', function (a,b,data,row) {
       
    var listdata={
        'index': row,
        'customer': data.Customer,
        'toemail': data.TOemail,
        'ccemail': data.CCemail
    };

    $.ajax({
        url: "http://10.7.3.34/forecast/local_data.php?action=UpdateRecipients",
        type: "POST",
        data: listdata,
        dataType: "json",
        success: function (reply) {
            
            $('#recipientstable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'UpdateStatus',
                    value: '<i class="fas fa-check" style="color:green;"></i>'
                });
            
            setTimeout(function() {
                $('#recipientstable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'UpdateStatus',
                    value: ''
                });
            }, 1000); 
            
            viewrecipients();
            
        }
    });
        
});

function GetKey(){
    if (location.search.indexOf('key=')>=0){
        var key = getUrlParameter('key');  
            if(key !==null){

                return key;

            }else{

            }
        }else{

    }
    
}

function InM3Formatter (value, row, index) {
    if(row.UpdateM3Status =="2"){
        return [
            '<i class="fas fa-exclamation" style="color:red;"></i>'].join('');
    }else if(row.UpdateM3Status == "1"){
        return [
            '<i class="fas fa-check" style="color:green;"></i>'
        ].join('');
    }else {
        return [
            '' 
        ].join('');
    }
}

function UPDCFormatter (value, row, index) {
    if(row.UPDC =="1"){
        return ['OK'].join('');
    }else if(row.UpdateM3Status == "0"){
        return ['-'].join('');
    }else {
        return [
            '' 
        ].join('');
    }
}
  
  function cellStyle1(value, row, index) {
    if (row.One>row.PREV1) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.One<row.PREV1) {
      return {
        css: {
          'background-color': '#ff9999'
        }
      };
    }else {
      return {
        css: {
          'background-color': 'transparent'
        }
      };
    }
  }

function cellStyle2(value, row, index) {
    if (row.Two>row.PREV2) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.Two<row.PREV2) {
      return {
        css: {
          'background-color': '#ff9999'
        }
      };
    }else {
      return {
        css: {
          'background-color': 'transparent'
        }
      };
    }
  }
  
  function cellStyle3(value, row, index) {
    if (row.Three>row.PREV3) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.Three<row.PREV3) {
      return {
        css: {
          'background-color': '#ff9999'
        }
      };
    }else {
      return {
        css: {
          'background-color': 'transparent'
        }
      };
    }
  }
  
  function cellStyle4(value, row, index) {
    if (row.Four>row.PREV4) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.Four<row.PREV4) {
      return {
        css: {
          'background-color': '#ff9999'
        }
      };
    }else {
      return {
        css: {
          'background-color': 'transparent'
        }
      };
    }
  }
  
  function TableActions (value, row, index) {
    if(row.Status>0){
            return [
        '<button type="button" class="btn btn-danger btn-block" data-unique-id="',row.Customer,'">',
        '<span style="color:white;">Delete</span>',
        '</button>'
    ].join(''); 
}}


$('#recipientstable').on('click',".btn", function(){
    $('#Recipientsmodalheader').attr('data-customer-id',$(this).attr('data-unique-id'));
    $('#Recipientsmodalheadertext').html("Recipients for Customer: " + $(this).attr('data-unique-id'));
    $('#Recipientsmodal').modal('show'); 
    });
    
$('#DeleteRecipientsButton').click(function(){
    
    var deleterecipient=$('#Recipientsmodalheader').attr('data-customer-id');
    
    if(deleterecipient!=''){        
        var listdata={
        'customer': deleterecipient
    };

    $.ajax({
        url: "http://10.7.3.34/forecast/local_data.php?action=DeleteRecipients",
        type: "POST",
        data: listdata,
        dataType: "json",
        success: function (reply) {
            
            $('#Recipientsmodal').modal('hide');
            viewrecipients();
            
        }
    });   
    }
});