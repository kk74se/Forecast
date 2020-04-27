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
    $objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB;charset=UTF8", $FCUID, $FCPWD);
    // set the PDO error mode to exception
    $objConnect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

$objQuery = $objConnect->prepare("SELECT b.Customer ,b.CustItemNo ,b.PetItemNo ,b.ItemName ,b.Year ,b.Period ,b.1 ,b.2 ,b.3 ,b.4 , b.5, b.CustName
        FROM petainer_fcast.Key a 
        JOIN petainer_fcast.ForecastData b on a.Customer = b.Customer and a.Year = b.Year and a.Period = b.Period 
        where a.Key = '$key'"
        . "order by b.PetItemNo");

$objQuery->execute();

//$result = $objQuery->fetch(PDO::FETCH_ASSOC);

while ( $row = $objQuery->fetch(PDO::FETCH_ASSOC) ) {
	$row_array['Customer'] = $row['Customer']; 
	$row_array['CustItemNo'] = $row['CustItemNo']; 
	$row_array['ItemNo'] = $row['PetItemNo']; 
  	$row_array['ItemName'] = $row['ItemName']; 
	$row_array['Year'] = $row['Year']; 
	$row_array['Period'] = $row['Period'];
        $row_array['one'] = $row['1'];    
        $row_array['two'] = $row['2'];
  	$row_array['three'] = $row['3'];    
        $row_array['four'] = $row['4'];  
        $row_array['five'] = $row['5'];
        $row_array['CustName'] = $row['CustName'];
    array_push($return_arr,$row_array);
}

echo json_encode($return_arr);
  
$objConnect = null;  

try {
    $objConnect2 = new PDO("mysql:host=$FCADR;dbname=$FCDB;charset=UTF8", $FCUID, $FCPWD);
    // set the PDO error mode to exception
    $objConnect2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

$objQuery2 = $objConnect2->prepare("UPDATE petainer_fcast.Key a SET a.Status = a.Status+1 where a.Key = '$key'");

$objQuery2->execute();
  
$objConnect2 = null;  

}

if ($action == 'updatelist') { 

$return_arr = array();
//Get Key
if (isset($_POST['Key'])) {
    if (is_numeric(test_input($_POST['Key']))){
        $Key=test_input($_POST['Key']);
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

if (isset($_POST['Index'])) {
    if (is_numeric(test_input($_POST['Index']))){
        $Index=test_input($_POST['Index']);
    }else{
        $return_arr['Error'] = "Index missing";
        echo json_encode($return_arr);
        exit();
    }   
} else {
    $return_arr['Error'] = "no index";
    echo json_encode($return_arr);
    exit();
}

if (isset($_POST['ItemNo'])) {
	$ItemNo = test_input($_POST['ItemNo']);
} else {
	$return_arr['Error'] = "ItemNo missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Year'])) {
	$Year = test_input($_POST['Year']);
} else {
	$return_arr['Error'] = "Year missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Period'])) {
	$Period = test_input($_POST['Period']);
} else {
	$return_arr['Error'] = "Period missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Two'])) {
	$Two = test_input($_POST['Two']);
} else {
	$return_arr['Error'] = "Two missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Three'])) {
	$Three = test_input($_POST['Three']);
} else {
	$return_arr['Error'] = "Three missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Four'])) {
	$Four = test_input($_POST['Four']);
} else {
	$return_arr['Error'] = "Four missing";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['Five'])) {
	$Five = test_input($_POST['Five']);
} else {
	$return_arr['Error'] = "Five missing";
	echo json_encode($return_arr);
	exit();
}

try {
    $objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB;charset=UTF8", $FCUID, $FCPWD);
    // set the PDO error mode to exception
    $objConnect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

$objQuery = $objConnect->prepare("update petainer_fcast.Key a
    JOIN petainer_fcast.ForecastData b on a.Customer = b.Customer
	and a.Year = b.Year
	and a.Period = b.Period
    set b.2 = '$Two'
	,b.3 = '$Three'
	,b.4 = '$Four'
	,b.5 = '$Five'
        ,b.UPDC = 1
    where a.Key = '$Key'
	and b.PetItemNo = '$ItemNo'"); 

$objQuery->execute();

$Resultat = $objQuery->rowCount();

$return_arr['Resultat'] = $Resultat;
$return_arr['Index'] = $Index;

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