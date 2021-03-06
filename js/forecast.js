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

$('#customerheader').html("Missing forecast </br>Please use the link provided to you");

moment.updateLocale('en-gb', {
});

var keylist = function(key) {

    var dateStart=moment().date(1);
    var dateEnd=moment().date(10);
    var dateLeft=moment(moment(dateEnd).endOf('day')).calendar();
    
    if(moment().isBetween(moment(dateStart).startOf('day'), moment(dateEnd).endOf('day'))){    
        var row="";
        var tabledata=[];
        $.ajax({
            type: "GET",
            url: "https://forecast.petainer.se/data.php?action=viewlist&key=" +key,
            cache: false,
            dataType: "json",
            success: function(data) {

                if(data.length>0){
                    
                    var CustItemNo="";
                    for (i = 0; i <data.length; i++) {
                        
                        CustItemNo="";
                        if(data[i].CustItemNo!== null){
                            CustItemNo=data[i].CustItemNo;
                        }

                        row={"Customer": data[i].Customer, "CustItemNo":CustItemNo, "ItemNo":data[i].ItemNo, "ItemName":data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period, "One": data[i].one, "Two": data[i].two, "Three": data[i].three, "Four": data[i].four, "Five": data[i].five, "Status": '<i class="fas fa-database" style="color:orange;"></i><a class="itemtabletext"> In Forecast</a>'};

                        tabledata.push(row);
                    }

                    $('#customerheader').html("Welcome: " +CFL(data[0].CustName) + " (" + data[0].Customer + ")" + "</br>Active adjustment period will end: " + dateLeft);

                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'One', title: moment(data[0].Period,"MM").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Two', title: moment(data[0].Period,"MM").add(1,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Three', title: moment(data[0].Period,"MM").add(2,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Four', title: moment(data[0].Period,"MM").add(3,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('updateColumnTitle', {field: 'Five', title: moment(data[0].Period,"MM").add(4,"M").format("YYYY MMMM")});
                    $('#itemtable').bootstrapTable('refreshOptions', {});
                    $('#itemtable').bootstrapTable("load", tabledata);
                    
                    $('#updateforecastbutton').removeClass('d-none');
                    $('#exportbutton').removeClass('d-none');
                    $('#tabsnavigation').removeClass('d-none');
                    $('#tabscontent').removeClass('d-none');
                    
                }
            }
        });
    }else{
        $('#updateforecastbutton').addClass('d-none');
        $('#tabsnavigation').addClass('d-none');
        $('#tabscontent').addClass('d-none');
        $('#customerheader').html("The forecast adjustment period is not valid.</br>Please use the link sent to you between the dates specified.");
    }
};

$("#updateforecastbutton").click(function () {

    var $key=GetKey();
    var count=0;
    data=$('#itemtable').bootstrapTable('getData');

    for (i = 0; i < data.length; i++) {
        console.log(data[i].Status.slice(-12,-4));
        if(data[i].Status.slice(-12,-4)=="Required"){           
        
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
                url: "https://forecast.petainer.se/data.php?action=updatelist",
                type: "POST",
                data: listdata,
                dataType: "json",
                success: function (reply) {
                    if(reply.Resultat=="1"){
                        $('#itemtable').bootstrapTable('updateCell', {
                            index: reply.Index,
                            field: 'Status',
                            value: '<i class="fas fa-upload" style="color:green;"></i><a class="itemtabletext"> Update OK</a>'
                        });
                    }                   
                }
            });
        
        }
        
    }
 
    setTimeout(function() {
        keylist(GetKey());
    }, 3000);                   
      
});

$('#itemtable').on('editable-save.bs.table', function (a,b,c, row) {
    $('#itemtable').bootstrapTable('updateCell', {
        index: row,
        field: 'Status',
        value: '<i class="fas fa-info" style="color:red;"></i><a class="itemtabletext"> Update Required</a>'
    });
  console.log(row);
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

$("#exportbutton").click(function () {
$('#itemtable').tableExport({type:'excel',
    mso: {fileFormat:'xmlss',
    worksheetName: ['Forecast']}});
});

function CFL(string) {
    
    string = string.trim().toUpperCase();
    
    string2=string.slice(-3);
    
    if(string2==="LTD" || string2===" AB" || string2===" AS" || string2===" BV" || string2===" CO" || string2==="A/S" || string2==="LLC"){
        string1=string.slice(0,string.length-3);
    }else{
        string1=string;
        string2="";
    }    
    string3 = string1.toLowerCase().replace(/[^\s_'-]+/g, function (word) { return word.replace(/^./, function (firstLetter) { return firstLetter.toUpperCase(); }); });
    
    return string3 + string2 ;
}
