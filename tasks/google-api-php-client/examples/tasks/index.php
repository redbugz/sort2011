<?php
/*
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
session_start();
require_once '../../src/apiClient.php';
require_once '../../src/contrib/apiTasksService.php';

$client = new apiClient();
// Visit https://code.google.com/apis/console to generate your
// oauth2_client_id, oauth2_client_secret, and to register your oauth2_redirect_uri.
// $client->setClientId('insert_your_oauth2_client_id');
// $client->setClientSecret('insert_your_oauth2_client_secret');
// $client->setRedirectUri('insert_your_oauth2_redirect_uri');
// $client->setApplicationName("Tasks_Example_App");
$tasksService = new apiTasksService($client);

if (isset($_REQUEST['logout'])) {
  unset($_SESSION['access_token']);
}

if (isset($_SESSION['access_token'])) {
  $client->setAccessToken($_SESSION['access_token']);
} else {
  $client->setAccessToken($client->authenticate());
  $_SESSION['access_token'] = $client->getAccessToken();
}

if (isset($_GET['code'])) {
  header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF']);
}
?>
<!doctype html>
<html>
<head>
  <title>Tasks API Sample</title>
  <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Droid+Serif|Droid+Sans:regular,bold' />
  <link rel='stylesheet' href='css/style.css' />
</head>
<body>
<div id='container'>
  <div id='top'><h1>Tasks API Sample</h1></div>
  <div id='main'>
<?php
  $lists = $tasksService->tasklists->listTasklists();
  foreach ($lists['items'] as $list) {
    print "<h3>{$list['title']}</h3>";
//    print_r($list);
    $tasks = $tasksService->tasks->listTasks($list['id']);
    foreach ($tasks['items'] as $task) {
//      $updated = new Task($task);
//      $updated->setNotes('Test');
//      $updated->setTitle($task['title'] + ' ' . time());
//      $tasksService->tasks->update($list['id'], $task['id'], $updated);
      print "<p id='post'>{$task['title']}</p>";
      print_r($task);
    }
    print_r($_SESSION['access_token']);
  }
?>
  </div>
</div>
</body>
</html>
<?php $_SESSION['access_token'] = $client->getAccessToken(); ?>