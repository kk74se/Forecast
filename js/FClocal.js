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

moment.updateLocale('en', {
});

var viewlist = function(key) {
   
        var row="";
        var tabledata=[];
        $.ajax({
            type: "GET",
            url: "http://10.7.3.34/forecast/local_data.php?action=localviewlist",
            cache: false,
            dataType: "json",
            success: function(data) {

                if(data.length>0){

                    for (i = 0; i <data.length; i++) {

                        row={"CustNo": data[i].Customer,"CustName": data[i].CustomerName, "CustItemNo":data[i].CustItemNo, "ItemNo":data[i].ItemNo,"ItemName":data[i].ItemNo + " | " + data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period, "One": data[i].one, "Two": data[i].two, "Three": data[i].three, "Four": data[i].four, "Five": data[i].five, "Status": '<i class="fas fa-database" style="color:orange;"></i><a class="itemtabletext"> In Forecast</a>',"UpdateDBStatus":"0","UpdateM3Status":"0"};

                        tabledata.push(row);
                    }

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

$("#updateM3datasetforecastbutton").click(function () {

    var count=0;
    data=$('#itemtable').bootstrapTable('getData');

    for (i = 0; i < data.length; i++) {

        var listdata={
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
                        value: '<i class="fas fa-upload" style="color:green;"></i><a class="itemtabletext"> Update OK</a>'
                    });
                }
                console.log(count);

            }
        });
        
    }
    
});

$('#itemtable').on('editable-save.bs.table', function (a,b,c, row) {
    $('#itemtable').bootstrapTable('updateCell', {
        index: row,
        field: 'Status',
        value: '<i class="fas fa-info" style="color:red;"></i><a class="itemtabletext"> Update Required</a>'
    });
  console.log(row);
});

function TableActions (value, row, index) {

    return [
        '<button type="button" class="btn btn-danger btn-block" data-unique-id="',row.Order,'">',
        '<span style="color:white;">Avbryt</span>',
        '</button>'
    ].join('');
}

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

