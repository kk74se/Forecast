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
                    
                    row={"Customer": data[i].Customer, "CustItemNo":data[i].CustItemNo, "PetItemNo":data[i].PetItemNo, "ItemName":data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period, "1": data[i].one, "2": data[i].two, "3": data[i].three, "4": data[i].four, "5": data[i].five};
                    
                    tabledata.push(row);
                }
                
                $('#customerheader').html("Welcome Customer: " +data[0].Customer + "</br> Please validate / update your forecast");
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: '1', title: moment(data[0].Period,"MM").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: '2', title: moment(data[0].Period,"MM").add(1,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: '3', title: moment(data[0].Period,"MM").add(2,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: '4', title: moment(data[0].Period,"MM").add(3,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('updateColumnTitle', {field: '5', title: moment(data[0].Period,"MM").add(4,"M").format("YYYY MMMM")});
                $('#itemtable').bootstrapTable('refreshOptions', {});
                $('#itemtable').bootstrapTable("load", tabledata);
                test=$('#itemtable').bootstrapTable('getData');
                console.log(test.length);
                        
            }
        });
  
};

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

