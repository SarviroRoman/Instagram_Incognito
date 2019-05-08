<?php
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
    $request = json_decode($request, true);

    $event = $request["event"];
    $data = $request["data"];

    switch($event){
      case "getProfile":
        if(!getProfile($connection, $data)){
          $json = json_encode((object)[
            "error" => "profile not found"
          ]);
          $connection->send($json);
        }

        break;

      case "getMediaByUserName":
        if(!getMediaByUserName($connection, $data)){
          $json = json_encode((object)[
            "error" => "medias not found"
          ]);
          $connection->send($json);
        };
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
  $instagram = new \InstagramScraper\Instagram();
  $response = $instagram->getPaginateMedias($data);
  $allMedias = [];

  while ($response['hasNextPage'] != null){
    // $medias = array_merge($medias, $response['medias']);
    $medias = $response['medias'];
    $allMedias = array_merge($allMedias, getMedias($medias));
    $response = $instagram->getPaginateMedias($data, $response['maxId']);
  } 

  if($response['hasNextPage'] == null){
    $medias = $response['medias'];
    $allMedias = array_merge($allMedias, getMedias($medias));
  }
  
  $json = json_encode((object)$allMedias);
  $connection->send($json);
  return true;
}
    
function getProfile($connection, $param){
  $instagram = new \InstagramScraper\Instagram();
  try {
    $account = $instagram->getAccount($param);
  } catch(Exception $e) {
    return false;
  }

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
  getMediaByUserName($connection, $param);
  return true;
}

function badAction($connection, $event){
  $connection->send(json_encode(
      (object) [
      "error" => 'bad action',
    ])
  );
}

function getMedias($medias){
  foreach ($medias as $media){
    $elem = (object)[
      "getLink" => $media -> getLink(),
      "getImageHighResolutionUrl" => $media -> getImageHighResolutionUrl(),
      "getCaption" => $media -> getCaption(),
      "getLikesCount" => $media -> getLikesCount(),
      "getCommentsCount" => $media -> getCommentsCount(),
      "id" => $media -> getOwnerId(),
    ];
    $arr[] = $elem;
  }
  return $arr;
}