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
                    
                    GenKey(data[i].CustomerNo);
                    
                }
                        
            }
        });
  
};

var GenKey = function(CustomerNo) {
        
        $.ajax({
            type: "GET",
            url: "http://10.7.3.34/forecast/data_local.php?action=genkey&CustomerNo=" +CustomerNo,
            cache: false,
            dataType: "json",
            success: function(data) {
                               
                return;
                
            }
            
        });
  
};

$('#updateallkeys').click(function () {

    GenKeyAll();
    
});