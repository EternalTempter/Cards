<?php
if (!empty($_GET['id']) && empty($_GET['say'])) {
    $data = file('settings.json');
    for($i=0; $i<count($data); ++$i) {
        $obj = json_decode($data[$i]);
        if ($obj->id == $_GET['id']) {
            echo json_encode($data[$i]);
            break;
        } else {
            
        }
    }
}
elseif (!empty($_GET['say'])) {
    $data = file('settings.json');
    for($i=0; $i<count($data); ++$i) {
        $obj = json_decode($data[$i]);
        if ($obj->id == $_GET['id'] && $obj->name != $_GET['user'] && !isset($obj->cords)) {
            echo json_encode($data[$i]);
            break;
        } else {
            
        }
    }
}    
else {
    $data = json_decode(file_get_contents('php://input'));
    if(empty($data->id)){
        $data->id = time();
    }
    $json = json_encode($data);
    file_put_contents('settings.json', $json.PHP_EOL, FILE_APPEND);
    echo json_encode($json);
}
 