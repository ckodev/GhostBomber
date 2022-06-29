<?php




//get contents and decode json into object
$json = file_get_contents('php://input');
$data = json_decode($json);


// store obbject properties in vairables
$name = $data->name;
$score = $data->score;




// connect to database
require_once "dbinfo.php";
$database = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


// insert most recent player score into database. --WORKS.
if ($score > 0){
    $query = "INSERT INTO highscores (name,score) VALUES ('$name','$score')";
    $database->query($query);

    // delete any rows after 20. Only the top 10 will show in the game, but I thought I might like to know the top 20. 
    $query = "DELETE from highscores where score in (select * from ( select score from highscores order by score desc limit 1 OFFSET 20) as t);";
    $database->query($query);
}



// select top 10 from database based on score. --WORKS
$query = "SELECT name, score FROM highscores ORDER BY score DESC LIMIT 10";
$result = $database->query($query);


$arrayOfFieldNames = $result->fetch_fields();
$tally = 0;
$jsonDataToReturn = "[";
while( $oneRecord = $result->fetch_assoc() ){
    $tally++;
	if ( $tally < $result->num_rows ){
        $jsonDataToReturn .= '{"name":"'.$oneRecord['name'].'","score" : '.$oneRecord['score'].'},';
                                                  
    }else {
        $jsonDataToReturn .= '{"name":"'.$oneRecord['name'].'","score" : '.$oneRecord['score'].'}';
    }   
}
$jsonDataToReturn .= "]";



// return object back to string for transferring. 
$dataReturn = json_encode($jsonDataToReturn);
$trimmedData = trim($dataReturn);
// echo so javascript can read 
echo $trimmedData;
















?>