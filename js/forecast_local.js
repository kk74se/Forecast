var GenKeyAll = function() {
        
        var row="";
        var tabledata=[]
;        $.ajax({
            type: "GET",
            url: "http://10.7.3.34/forecast/data_local.php?action=allcustomers",
            cache: false,
            dataType: "json",
            success: function(data) {
                               
                for (i = 0; i <data.length; i++) {
                    
                    for (year = 2019; year<=2025; year++) {
                        for (month = 1; i <=12; month++){
                            
                        }
                    }
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

