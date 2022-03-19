<?php
if ($_GET['id']) {
    $data = file('settings.json');
    for($i=0; $i<count(); ++$i) {
        $obj = json_decode($data[$i]);
        if (!array_key_exists('say', $_GET) && $obj->id == $_GET['id']) {
            echo $data[$i];
            break;
        } else {
            
        }
    }
} else {
    $data = json_decode(file_get_contents('php://input'));
    $data->id = time();
    $json = json_encode($data);
    file_put_contents('settings.json', $json.PHP_EOL, FILE_APPEND);
    echo $json;
}