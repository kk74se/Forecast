<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "conn.php";

if (isset($_GET['callback']))
{
    $callback = filter_var($_GET['callback'], FILTER_SANITIZE_STRING);
}

$return_arr = array();
if (isset($_GET['action']) && !empty($_GET['action'])) {
	$action = $_GET['action'];
}


if ($action == 'viewlist') {

//Get Key
if (isset($_GET['key'])) {
    if (is_numeric(test_input($_GET['key']))){
        $key=test_input($_GET['key']);
    }else{
        $return_arr['Error'] = "nologin";
        echo json_encode($return_arr);
        exit();
    }   
} else {
    $return_arr['Error'] = "nokey";
    echo json_encode($return_arr);
    exit();
}

//$objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB", $FCUID, $FCPWD);

try {
    $objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB", $FCUID, $FCPWD);
    // set the PDO error mode to exception
    $objConnect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

$strSQL = "SELECT b.Customer ,b.CustItemNo ,b.PetItemNo ,b.ItemName ,b.Year ,b.Period ,b.1 ,b.2 ,b.3 ,b.4 ,b.5 
        FROM petainer_fcast.Key a 
        JOIN petainer_fcast.ForecastData b on a.Customer = b.Customer and a.Year = b.Year and a.Period = b.Period 
        where a.Key = '$key'";

$objQuery = $objConnect->prepare("SELECT b.Customer ,b.CustItemNo ,b.PetItemNo ,b.ItemName ,b.Year ,b.Period ,b.1 ,b.2 ,b.3 ,b.4 ,b.5 
        FROM petainer_fcast.Key a 
        JOIN petainer_fcast.ForecastData b on a.Customer = b.Customer and a.Year = b.Year and a.Period = b.Period 
        where a.Key = '$key'");

$objQuery->execute();

//$result = $objQuery->fetch(PDO::FETCH_ASSOC);

while ( $row = $objQuery->fetch(PDO::FETCH_ASSOC) ) {
	$row_array['Customer'] = $row['Customer']; 
	$row_array['CustItemNo'] = $row['CustItemNo']; 
	$row_array['PetItemNo'] = $row['PetItemNo']; 
  	$row_array['ItemName'] = $row['ItemName']; 
	$row_array['Year'] = $row['Year']; 
	$row_array['Period'] = $row['Period'];
        $row_array['one'] = $row['1'];    
        $row_array['two'] = $row['2'];
  	$row_array['three'] = $row['3'];    
        $row_array['four'] = $row['4'];  
        $row_array['five'] = $row['5'];
    array_push($return_arr,$row_array);
}

echo json_encode($return_arr);
  
$objConnect = null;  
  
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>