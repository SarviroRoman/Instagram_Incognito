<?php
//ILoveYouMitya
//S_I_M_U_L_A_C_R
require_once __DIR__ . '/../../vendor/autoload.php';
use Workerman\Worker;
include "/../d.local/index.php";
// Create a Websocket server
$ws_worker = new Worker("websocket://localhost:8082");

// 4 processes
$ws_worker->count = 4;

// Emitted when new connection come
$ws_worker->onConnect = function($connection)
{
    $message = json_encode(
        (object)[
        "msg" => "Hello. I'm server. You connected",
    ]);
    $connection->send($message);

    echo "New connection\n";
 };

// Emitted when data received
$ws_worker->onMessage = function($connection, $request)
{
    //echo "get: {$request}" .PHP_EOL;
    $request = json_decode($request, true);
    //echo "get: " .PHP_EOL;
    //print_r($request);
    $event = $request["event"];
    $data = $request["data"];

    //echo $event .PHP_EOL;
    //echo $data .PHP_EOL;

    switch($event){
      case "getProfile":
        getProfile($connection, $data);
        break;
      case "getMediaByUserName":
        if(getMediaByUserName($connection, $data)){
            echo "Media user {$data} sent".PHP_EOL;
        }else{
            echo "WARNING Media user {$data} has not been sent".PHP_EOL;
        };
        break;

      case "getStories":
        getStories($connection);
        break;
      case "getS":
        getS($connection, $data);
        break;
      default:
        badAction($connection, $event);
        break;
  }
};

// Emitted when connection closed
$ws_worker->onClose = function($connection)
{
    echo "Connection closed\n";
};

// Run worker
Worker::runAll();

function getMediaByUserName($connection, $data){
    $instagram = \InstagramScraper\Instagram::withCredentials('pashka.as', 'TIGRas3375745', '/path/to/cache/folder');
    $instagram->login();
    $response = $instagram->getPaginateMedias($data);

    while ($response['hasNextPage'] != null){
        // $medias = array_merge($medias, $response['medias']);
        $medias = $response['medias'];
        sendMedias($connection, $medias);
        $response = $instagram->getPaginateMedias($data, $response['maxId']);
    }

    if($response['hasNextPage'] == null){
        $medias = $response['medias'];
        sendMedias($connection, $medias);
    }
    return true;
}
    
function getProfile($connection, $param){
  $instagram = new \InstagramScraper\Instagram();
  $account = $instagram->getAccount($param);
  
  //print_r(get_class_methods($account));

  $info = (object)[
    "username" => $account->getUsername(),
    "fullName" => $account->getFullName(),
    "profilePicUrlHd" => $account->getProfilePicUrlHd(),
    "biography" => $account->getBiography(),
    "followsCount" => $account->getFollowsCount(),
    "followedByCount" => $account->getFollowedByCount(),
    "mediaCount" => $account->getMediaCount(),
    "isPrivate" => $account->isPrivate()
  ];

  $json = json_encode($info);
  $connection->send($json);
}

function sendMedias($connection, $medias){
    foreach ($medias as $media){
        $elem = (object)[
            "createdTime" => $media->getCreatedTime(),
            "commecntsCount" => $media->getCommentsCount(),
            "likesCount" => $media->getLikesCount(),
            "link" => $media->getLink(),
            "linkUrl" => $media->getImageHighResolutionUrl(),
            "type" => $media->getType(),
        ];
        $arr[] = $elem;
    }

    $json = json_encode((object)$arr);

    $connection->send($json);
}

function getS($connection, $data){
    $instagram = new \InstagramScraper\Instagram();
    $account = $instagram->getAccount($data);
    $a = $account -> getColumns($data);
    print_r($a);
}

function getStories($connection, $data){
    $instagram = \InstagramScraper\Instagram::withCredentials('S_I_M_U_L_A_C_R', 'ILoveYouMitya', '/path/to/cache/folder');
    $instagram->login();
    //print_r(get_class_methods($instagram));
    //print_r(get_class_vars($instagram));

    $stories = $instagram->getStories();



    //$a = $instagram->withCredentials();
    //echo $stories;
    print_r($stories);

    /*$stories = $instagram->getStories();
    print_r($stories);

    $elem = (object)[
        "username" => $stories[0]["owner"]["username"],
        "profilePicUrl" => $stories[0]["owner"]["profilePicUrl"],
        "imgVidLowResolutionUrl" => $stories[0]["stories"][0]["imageLowResolutionUrl"],
        "imgVidThumbnailUrl" => $stories[0]["stories"][0]["imageThumbnailUrl"],
        "imgVidStandardResolutionUrl" => $stories[0]["stories"][0]["imageStandardResolutionUrl"],
        "imgVidHighResolutionUrl" => $stories[0]["stories"][0]["imageHighResolutionUrl"],
    ];

    echo $stories[0]["owner"]["username"].PHP_EOL;
    echo $stories[0]["owner"]["profilePicUrl"].PHP_EOL;
    echo $stories[0]["stories"][0]["imageLowResolutionUrl"].PHP_EOL;
    echo $stories[0]["stories"][0]["imageThumbnailUrl"].PHP_EOL;
    echo $stories[0]["stories"][0]["imageStandardResolutionUrl"].PHP_EOL;
    echo $stories[0]["stories"][0]["imageHighResolutionUrl"].PHP_EOL;


    $json = json_encode($elem);
    $connection->send($json);*/
}


function badAction($connection, $event){
    $connection->send(json_encode(
        (object) [
        "msg" => 'bad action',
      ])
    );
}

