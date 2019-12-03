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

$('#customerheader').html("Welcome</br> Please validate / update your forecast");

moment.updateLocale('en', {
});

var Timer=function() {
    var timerId = 0;  
    timerId = setInterval(function() {listorders(); }, 20000);
};

var keylist = function(key) {
        
        var row="";
        var tabledata=[]
;        $.ajax({
            type: "GET",
            url: "http://localhost:8080/forecast/data.php?action=viewlist&key=" +key,
            cache: false,
            dataType: "json",
            success: function(data) {
                               
                for (i = 0; i <data.length; i++) {
                    
                    row={"Customer": data[i].Customer, "CustItemNo":data[i].CustItemNo, "ItemNo":data[i].ItemNo, "ItemName":data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period, "One": data[i].one, "Two": data[i].two, "Three": data[i].three, "Four": data[i].four, "Five": data[i].five, "Status": '<i class="fas fa-database" style="color:orange;"></i><a class="itemtabletext"> In Forecast</a>'};
                    
                    tabledata.push(row);
                }
                
                $('#customerheader').html("Welcome Customer: " +data[0].Customer + "</br> Please validate / update your forecast");
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'One', title: moment(data[0].Period,"MM").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Two', title: moment(data[0].Period,"MM").add(1,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Three', title: moment(data[0].Period,"MM").add(2,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Four', title: moment(data[0].Period,"MM").add(3,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Five', title: moment(data[0].Period,"MM").add(4,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('refreshOptions', {});
                $('#itemtable').bootstrapTable("load", tabledata);
                        
            }
        });
  
};

$("#updateforecastbutton").click(function () {

    var $key=GetKey();
    var count=0;
    data=$('#itemtable').bootstrapTable('getData');

    for (i = 0; i < data.length; i++) {

        var listdata={
            'Key': $key,
            'Index': i,
            'ItemNo': data[i].ItemNo,
            'Year': data[i].Year,
            'Period': data[i].Period,
            'Two': data[i].Two,
            'Three': data[i].Three,
            'Four': data[i].Four,
            'Five': data[i].Five
        };

       $.ajax({
            url: "http://localhost:8080/forecast/data.php?action=updatelist",
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
                if(count==data.length){
                    setTimeout(function() {
                        keylist(GetKey());
                    }, 4000);                   
                }
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

