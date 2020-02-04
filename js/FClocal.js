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
                        
                        if(data[i].DIFF1>0){
                            diff1='<style="background-color:green;"> ';
                        }else if(data[i].DIFF1<0){
                            diff1='<style="background-color:red;"> ';
                        }else {
                            diff1='<style="bgcolor:red"> ';
                        }
                        
                        if(data[i].TM3 !== null){
                            LocalTM3='<i class="fas fa-arrow-right" style="color:green;"></i>M3: ' + data[i].TM3;
                        }else{
                            LocalTM3='';
                        }
                        row={"CustNo": data[i].Customer,"CustName": data[i].CustomerName, "CustItemNo":data[i].CustItemNo, "ItemNo":data[i].ItemNo,"ItemName":data[i].ItemNo + " | " + data[i].ItemName, "Year": data[i].Year, "Period": data[i].Period, "One": data[i].one, "DIFF1":data[i].DIFF1,"Two": data[i].two,"DIFF2":data[i].DIFF2, "Three": data[i].three,"DIFF3":data[i].DIFF3, "Four": data[i].four,"DIFF4":data[i].DIFF4, "Five": data[i].five, "TNR": data[i].TNR, "Status":LocalTM3,"UPDC":data[i].UPDC};

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

$('#itemtable').on('editable-save.bs.table', function (a,b,data, row) {
    
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
            
            PrevStatus=data.Status;
            
            $('#itemtable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'Status',
                    value: 'Update OK'
                });
            
            setTimeout(function() {
                $('#itemtable').bootstrapTable('updateCell', {
                    index: reply.Index,
                    field: 'Status',
                    value: PrevStatus
                });
            }, 3000); 
            
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
    if (row.DIFF1>0) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.DIFF1<0) {
      return {
        css: {
          'background-color': 'Tomato'
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
    if (row.DIFF2>0) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.DIFF2<0) {
      return {
        css: {
          'background-color': 'Tomato'
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
    if (row.DIFF3>0) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.DIFF3<0) {
      return {
        css: {
          'background-color': 'Tomato'
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
    if (row.DIFF4>0) {
      return {
        css: {
          'background-color': 'LightGreen'
        }
      };
    }else if (row.DIFF4<0) {
      return {
        css: {
          'background-color': 'Tomato'
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