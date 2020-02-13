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

$strSQL = "SELECT a.Customer
	,LTRIM(RTRIM(b.OKCUNM)) as 'CustomerName'
	,a.CustItemNo
	,a.PetItemNo
	,a.ItemName
	,a.[Year]
	,a.[Period]
	,a.[1]
	,ISNULL(c.[2],0) as '1-Prev'
	,a.[2]
	,ISNULL(c.[3],0) as '2-Prev'
	,a.[3]
	,ISNULL(c.[4],0) as '3-Prev'
	,a.[4]
	,ISNULL(c.[5],0) as '4-Prev'
	,a.[5]
	,a.TNR
	,a.TND
        ,a.TM3
        ,a.UPDC
FROM dbo.ForecastData a
left join [10.7.14.205].[M3FDBPRD].[MVXJDTA].[OCUSMA] b with(NOLOCK) on a.Customer = b.OKCUNO
left join dbo.ForecastData c on a.Customer=c.Customer and a.PetItemNo=c.PetItemNo and c.Period = month(DATEADD(month, -1, GETDATE())) and c.Year = year(DATEADD(month, -1, GETDATE()))
where a.[Year]=year(getdate()) and a.[Period]=month(getdate())
order by TNR desc, Customer";

$objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]");

$result = $objQuery;
//$result = $objQuery->fetch(PDO::FETCH_ASSOC);

while ( $row = mssql_fetch_assoc( $objQuery ) ) {
	$row_array['Customer'] = $row['Customer'];
        $row_array['CustomerName'] = $row['CustomerName'];
	$row_array['CustItemNo'] = $row['CustItemNo'];
	$row_array['ItemNo'] = $row['PetItemNo'];
  	$row_array['ItemName'] = $row['ItemName'];
	$row_array['Year'] = $row['Year'];
	$row_array['Period'] = $row['Period'];
        $row_array['one'] = $row['1'];
        $row_array['PREV1'] = $row['1-Prev'];
        $row_array['two'] = $row['2'];
        $row_array['PREV2'] = $row['2-Prev'];
  	$row_array['three'] = $row['3'];
        $row_array['PREV3'] = $row['3-Prev'];
        $row_array['four'] = $row['4'];
        $row_array['PREV4'] = $row['4-Prev'];
        $row_array['five'] = $row['5'];
        $row_array['TNR'] = $row['TNR'];
        $row_array['TND'] = $row['TND'];
        $row_array['TM3'] = $row['TM3'];
        $row_array['UPDC'] = $row['UPDC'];
    array_push($return_arr,$row_array);
}

echo json_encode($return_arr);

mssql_close($objConnect);

}

if ($action == 'UpdateM3') {

$divi = 'SE1';
$file = 'O001002';
$dataset = 'SE1F'; //SBDS
$version = '0000'; //BVER
$type = '33'; //SSTT
$oslevel = '0'; //OSLE
$url = 'https://selidm3tdh01.petainer.com:21108/m3api-rest/execute';

// DEV	https://selidm3tdh01.petainer.com:22108/m3api-rest/execute
// TST	https://selidm3tdh01.petainer.com:21108/m3api-rest/execute
// PRD	https://selidm3ph01.petainer.com:20108/m3api-rest/execute

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

if (isset($_POST['customer']) && !empty($_POST['customer'])) {
	$customer = test_input($_POST['customer']);
} else {
	$return_arr['Error'] = "Customer måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['item']) && !empty($_POST['item'])) {
	$item = test_input($_POST['item']);
} else {
	$return_arr['Error'] = "Item måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['oneY']) && !empty($_POST['oneY'])) {
	$oneY = test_input($_POST['oneY']);
} else {
	$return_arr['Error'] = "OneY måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['oneP']) && !empty($_POST['oneP'])) {
	$oneP = test_input($_POST['oneP']);
} else {
	$return_arr['Error'] = "OneP måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['oneQ']) && !empty($_POST['oneQ'])) {
	$oneQ = test_input($_POST['oneQ']);
} else {
	$oneQ = 0;
}

if (isset($_POST['twoY']) && !empty($_POST['twoY'])) {
	$twoY = test_input($_POST['twoY']);
} else {
	$return_arr['Error'] = "TwoY måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['twoP']) && !empty($_POST['twoP'])) {
	$twoP = test_input($_POST['twoP']);
} else {
	$return_arr['Error'] = "TwoP måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['twoQ']) && !empty($_POST['twoQ'])) {
	$twoQ = test_input($_POST['twoQ']);
} else {
	$twoQ=0;
}

if (isset($_POST['threeY']) && !empty($_POST['threeY'])) {
	$threeY = test_input($_POST['threeY']);
} else {
	$return_arr['Error'] = "ThreeY måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['threeP']) && !empty($_POST['threeP'])) {
	$threeP = test_input($_POST['threeP']);
} else {
	$return_arr['Error'] = "ThreeP måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['threeQ']) && !empty($_POST['threeQ'])) {
	$threeQ = test_input($_POST['threeQ']);
} else {
	$threeQ=0;
}

if (isset($_POST['fourY']) && !empty($_POST['fourY'])) {
	$fourY = test_input($_POST['fourY']);
} else {
	$return_arr['Error'] = "FourY måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['fourP']) && !empty($_POST['fourP'])) {
	$fourP = test_input($_POST['fourP']);
} else {
	$return_arr['Error'] = "FourP måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['fourQ']) && !empty($_POST['fourQ'])) {
	$fourQ = test_input($_POST['fourQ']);
} else {
	$fourQ=0;
}

if (isset($_POST['fiveY']) && !empty($_POST['fiveY'])) {
	$fiveY = test_input($_POST['fiveY']);
} else {
	$return_arr['Error'] = "FiveY måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['fiveP']) && !empty($_POST['fiveP'])) {
	$fiveP = test_input($_POST['fiveP']);
} else {
	$return_arr['Error'] = "FiveP måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['fiveQ']) && !empty($_POST['fiveQ'])) {
	$fiveQ = test_input($_POST['fiveQ']);
} else {
	$fiveQ=0;
}

$Years = array($oneY, $twoY, $threeY, $fourY, $fiveY);
$Periods = array($oneP, $twoP, $threeP, $fourP, $fiveP);
$Quantity = array($oneQ, $twoQ, $threeQ, $fourQ, $fiveQ);

$x=0;
$resultM3=1;
for ($x = 0; $x < 5; $x++) {

    $curl = curl_init();

        curl_setopt_array($curl, array(
          CURLOPT_URL => $url ."/OSS401MI/SndBudgets?CONO=001&DIVI=".$divi."&SBDS=".$dataset."&FILE=".$file."&BVER=".$version."&SSTT=".$type."&OSLE=".$oslevel."&YEA4=".$Years[$x]."&PERI=".$Periods[$x]."&KEY1=".$divi."&KEY2=".$customer."&KEY3=".$item."&CL01=".$Quantity[$x],
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
            $resultM3++;

        }

    }
        //Update Forecast Db that it has been transfered to M3
        if($resultM3==5){
            $M3Status=1;
        }else{
            $M3Status=2;
        }

        $objConnect = mssql_connect($FCADR,$FCUID,$FCPWD);
        $objDB = mssql_select_db($FCDB);

        mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

        $strSQL = "BEGIN TRANSACTION;
                    DECLARE @ID [int];
                    DECLARE @RE [Int];
                    DECLARE @DT [date];
                    set @DT=(select FORMAT (getdate(), 'yyyy-MM-dd'));
                    update [dbo].[ForecastData]
                    set [TM3]=@DT
                    where [Customer]='".$customer."' and [PetItemNo]='".$item."' and [Year]='".$year."' and [Period]='".$period."';
                    SELECT @RE = CASE WHEN @@ROWCOUNT = 0 THEN 0 ELSE 1 END;
                    select @RE as Resultat;
                    select @DT as UpdateDate;
                    COMMIT;";

        $objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]");

        $result = $objQuery;
        //$result = $objQuery->fetch(PDO::FETCH_ASSOC);

        while ( $row = mssql_fetch_assoc($objQuery)) {
            $return_arr['Resultat'] = $row['Resultat'];
            $return_arr['Index'] = $Index;
            $return_arr['Date'] = $row['Updatedate'];
        }

        echo json_encode($return_arr);

        mssql_close($objConnect);

}

if ($action == 'UpdateForecast') {

if (isset($_POST['index'])) {
    if (is_numeric(test_input($_POST['index']))){
        $index=test_input($_POST['index']);
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

if (isset($_POST['customer']) && !empty($_POST['customer'])) {
	$customer = test_input($_POST['customer']);
} else {
	$return_arr['Error'] = "Customer måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['item']) && !empty($_POST['item'])) {
	$item = test_input($_POST['item']);
} else {
	$return_arr['Error'] = "Item måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['one'])) {
	$one = test_input($_POST['one']);
} else {
	$return_arr['Error'] = "One måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['two'])) {
	$two = test_input($_POST['two']);
} else {
	$return_arr['Error'] = "Two måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['three'])) {
	$three = test_input($_POST['three']);
} else {
	$return_arr['Error'] = "Three måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['four'])) {
	$four = test_input($_POST['four']);
} else {
	$return_arr['Error'] = "four måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['five'])) {
	$five = test_input($_POST['five']);
} else {
	$return_arr['Error'] = "Five måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['tnr'])) {
	$tnr = test_input($_POST['tnr']);
} else {
	$return_arr['Error'] = "TNR måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['ChangedFCPeriod']) && !empty($_POST['ChangedFCPeriod'])) {
	$ChangedFCPeriod = test_input($_POST['ChangedFCPeriod']);
} else {
	$return_arr['Error'] = "ChangedFCPeriod måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['QuantityFrom']) && !empty($_POST['QuantityFrom'])) {
	$QuantityFrom = test_input($_POST['QuantityFrom']);
} else {
	$return_arr['Error'] = "QuantityFrom måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['QuantityTo']) && !empty($_POST['QuantityTo'])) {
	$QuantityTo = test_input($_POST['QuantityTo']);
} else {
	$return_arr['Error'] = "QuantityTo måste anges";
	echo json_encode($return_arr);
	exit();
}

if (isset($_POST['ChangeDateTime']) && !empty($_POST['ChangeDateTime'])) {
	$ChangeDateTime = test_input($_POST['ChangeDateTime']);
} else {
	$return_arr['Error'] = "ChangeDateTime måste anges";
	echo json_encode($return_arr);
	exit();
}

        $objConnect = mssql_connect($FCADR,$FCUID,$FCPWD);
        $objDB = mssql_select_db($FCDB);

        mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

        $strSQL = "BEGIN TRANSACTION;
                    DECLARE @ID [int];
                    DECLARE @RE [Int];
                    DECLARE @RE2 [Int];
                    UPDATE [dbo].[ForecastData]
                    SET [1] = '".$one."'
                            ,[2] = '".$two."'
                            ,[3] = '".$three."'
                            ,[4] = '".$four."'
                            ,[5] = '".$five."'
                    WHERE [Customer] = '".$customer."'
                            and [PetItemNo] = '".$item."'
                            and [Year] = '".$year."'
                            and [Period] = '".$period."'
                            and [TNR] = '".$tnr."';
                    SELECT @RE = CASE 
                                    WHEN @@ROWCOUNT = 0
                                            THEN 0
                                    ELSE 1
                                    END;	
                    INSERT INTO [dbo].[FCChanges]
                                    ([Customer]
                                    ,[PetItemNo]
                                    ,[Year]
                                    ,[ActiveFCPeriod]
                                    ,[ChangedFCPeriod]
                                    ,[QuantityFrom]
                                    ,[QuantityTo]
                                    ,[ChangedBy]
                                    ,[ChangeDateTime])
                            VALUES
                                    ('".$customer."'
                                    ,'".$item."'
                                    ,'".$year."'
                                    ,'".$period."'
                                    ,'".$ChangedFCPeriod."'
                                    ,'".$QuantityFrom."'
                                    ,'".$QuantityTo."'
                                    ,''
                                    ,'".$ChangeDateTime."');
                    SELECT @RE2 = CASE 
                                    WHEN @@ROWCOUNT = 0
                                            THEN 0
                                    ELSE 1
                                    END;
                    select @RE+@RE2 as Resultat;
                    COMMIT;";

        $objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]");

        $result = $objQuery;
        //$result = $objQuery->fetch(PDO::FETCH_ASSOC);

        while ( $row = mssql_fetch_assoc($objQuery)) {
            $return_arr['Resultat'] = $row['Resultat'];
            $return_arr['Index'] = $index;
        }

        echo json_encode($return_arr);

        mssql_close($objConnect);

}


if ($action == 'localviewrecipients') {

//$objConnect = new PDO("mysql:host=$FCADR;dbname=$FCDB", $FCUID, $FCPWD);

$objConnect = mssql_connect($FCADR,$FCUID,$FCPWD);
$objDB = mssql_select_db($FCDB);

mssql_query("SET ANSI_NULLS ON"); mssql_query("SET ANSI_WARNINGS ON");

$strSQL = "SELECT distinct b.UCCUNO as 'CustomerM3'
	,a.Customer as 'CustomerFC'
    ,LTRIM(RTRIM(case when c.OKCUNM is null then d.OKCUNM else c.OKCUNM end)) as 'CustomerName'
	,ISNULL(TOemail,'-') as 'TOemail'
	,ISNULL(CCemail,'-') as 'CCemail'
        FROM dbo.Recipients a
        full join [10.7.14.205].[M3FDBPRD].[MVXJDTA].[O001002] b with(NOLOCK) on a.Customer = b.UCCUNO
        left join [10.7.14.205].[M3FDBPRD].[MVXJDTA].[OCUSMA] c with(NOLOCK) on a.Customer = c.OKCUNO
        left join [10.7.14.205].[M3FDBPRD].[MVXJDTA].[OCUSMA] d with(NOLOCK) on b.UCCUNO = d.OKCUNO";

$objQuery = mssql_query($strSQL) or die ("Error Query [".$strSQL."]");

$result = $objQuery;
//$result = $objQuery->fetch(PDO::FETCH_ASSOC);

while ( $row = mssql_fetch_assoc( $objQuery ) ) {
	$row_array['CustomerM3'] = $row['CustomerM3'];
        $row_array['CustomerFC'] = $row['CustomerFC'];
	$row_array['TOemail'] = $row['TOemail'];
	$row_array['CCemail'] = $row['CCemail'];
    array_push($return_arr,$row_array);
}

echo json_encode($return_arr);

mssql_close($objConnect);

}


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>