<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "FCconn.php";

if (isset($_GET['callback']))
{
    $callback = filter_var($_GET['callback'], FILTER_SANITIZE_STRING);
}

$return_arr = array();
if (isset($_GET['action']) && !empty($_GET['action'])) {
	$action = $_GET['action'];
}

if ($action == 'localviewlist') {

//$objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB", $FCUID, $FCPWD);

$objConnect = mssql_connect($FCADR,$FCUID,$FCPWD); 
$objDB = mssql_select_db($FCDB);  
  
mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

$strSQL = "SELECT Customer
	,CustItemNo
	,PetItemNo
	,ItemName
	,[Year]
	,[Period]
	,[1]
	,[2]
	,[3]
	,[4]
	,[5]
	,TNR
	,TND
FROM dbo.ForecastData
where [Year]=year(getdate()) and [Period]=month(getdate())
order by TNR desc, Customer"; 

$objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]"); 

$result = $objQuery;
//$result = $objQuery->fetch(PDO::FETCH_ASSOC);

while ( $row = mssql_fetch_assoc( $objQuery ) ) {
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
        $row_array['TNR'] = $row['TNR'];
        $row_array['TND'] = $row['TND'];
    array_push($return_arr,$row_array);
}

echo json_encode($return_arr);
  
mssql_close($objConnect);  
  
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
    $return_arr['Error'] = "nokey";
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
    where a.Key = '$Key'
	and b.PetItemNo = '$ItemNo'"); 

$objQuery->execute();

$Resultat = $objQuery->rowCount();

$return_arr['Resultat'] = $Resultat;
$return_arr['Index'] = $Index;

echo json_encode($return_arr);

  
$objConnect = null;

}

if ($action == 'UpdateM3') { 
    
$divi = 'SE1';
$file = 'O001002';
$dataset = 'SE1F';
$version = '0000';
$type = '33';
$oslevel = '0';

if (isset($_POST['year']) && !empty($_POST['year'])) {
	$year = test_input($_POST['year']);
} else {
	$return_arr['Error'] = "Year måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['period']) && !empty($_POST['period'])) {
	$period = test_input($_POST['period']);
} else {
	$return_arr['Error'] = "Period måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['one']) && !empty($_POST['one'])) {
	$one = test_input($_POST['one']);
} else {
	$return_arr['Error'] = "One måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['two']) && !empty($_POST['two'])) {
	$two = test_input($_POST['two']);
} else {
	$return_arr['Error'] = "Two måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['three']) && !empty($_POST['three'])) {
	$three = test_input($_POST['three']);
} else {
	$return_arr['Error'] = "Three måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['four']) && !empty($_POST['four'])) {
	$four = test_input($_POST['four']);
} else {
	$return_arr['Error'] = "Four måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['five']) && !empty($_POST['five'])) {
	$five = test_input($_POST['three']);
} else {
	$return_arr['Error'] = "Five måste anges";
	echo json_encode($return_arr);
	exit();
}

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://selidm3tdh01.petainer.com:21108/m3api-rest/execute/PMS050MI/RptReceipt?CONO=001&FACI=SE1&MFNO=".$MO."&RPQA=".$quantity."&STAS=".$status."&WHSL=".$location."&CAMU=".$container,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Accept: */*",
    "Authorization: Basic QUdWVVNSQHBldGFpbmVyLmNvbTpMaWRQZXQxMDEw",
    "Cache-Control: no-cache",
    "Connection: keep-alive",
    "Host: selidm3tdh01.petainer.com:21108",
    "accept-encoding: gzip, deflate",
    "cache-control: no-cache"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
	} else {
   		$response = json_decode($response,true);
   		echo $response;
	}

}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>