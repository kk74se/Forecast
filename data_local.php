<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once "conn_local.php";

if (isset($_GET['callback']))
{
    $callback = filter_var($_GET['callback'], FILTER_SANITIZE_STRING);
}

$return_arr = array();
if (isset($_GET['action']) && !empty($_GET['action'])) {
	$action = $_GET['action'];
}

if ($action == 'allcustomers') {

$objConnect = mssql_connect($M3ADR,$M3UID,$M3PWD); 
$objDB = mssql_select_db($M3DB);  
  
mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

$strSQL = "SELECT distinct a.UCCUNO as 'CustomerNo'
    FROM MVXJDTA.O001002 a with(NOLOCK)
    where OSBVER='0000' and OSSSTT='33'
    order by a.UCCUNO"; 

$objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]"); 

// Print out rows

$result = $objQuery;

while ( $row = mssql_fetch_assoc( $objQuery ) ) {
    $row_array['CustomerNo'] = $row['CustomerNo'];   
    array_push($return_arr,$row_array);
}
echo json_encode($return_arr);

mssql_close($objConnect);  

$return_arr = null;

}

if ($action == 'genkey') { 

$return_arr = array();
//Get Key

if (isset($_GET['CustomerNo'])) {
	$CustomerNo = test_input($_GET['CustomerNo']);
} else {
	$return_arr['Error'] = "CustomerNo missing";
	echo json_encode($return_arr);
	exit();
}

$objConnect = mssql_connect($REPORTADR,$REPORTUID,$REPORTPWD); 
$objDB = mssql_select_db($REPORTDB);  
  
mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

for ($year = 2020; $year <= 2025; $year++) {
    for ($period = 1; $period <= 12; $period++) {
        $strSQL = "INSERT INTO [dbo].[Key]
		([Key]
		,[Customer]
		,[Year]
		,[Period])
	VALUES
		(floor(RAND()*(1000000000000))
		,'$CustomerNo'
		,$year
		,$period)"; 

        $objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]");
    } 
} 

// Print out rows

    $return_arr['Done'] = '1';   


echo json_encode($return_arr);

mssql_close($objConnect);  

$return_arr = null;

}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>