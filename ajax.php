<?php    
if($_GET['do'] == 'checkId'){
    $data = file('settings.json');
    for($i=0; $i<count($data); ++$i) {
        $obj = json_decode($data[$i]);
        if ($obj->id == $_GET['id']) {
            echo json_encode($data[$i]);
            return;
            break;
        } else {
            
        }
    }
    echo json_encode('Проверить не получилось');
}
elseif ($_GET['do'] == 'checkMove') {
    $data = file('settings.json');
    for($i=0; $i<count($data); ++$i) {
        $obj = json_decode($data[$i]);
        if ($obj->id == $_GET['id'] && $obj->name != $_GET['user'] && !empty($obj->cords)) {
            $removedCards = json_decode($_GET['removedCards']);
            $intersect = array_intersect($removedCards, $obj->cords);
            if(empty($intersect)){
                echo json_encode($obj->cords);
                return;
                break;
            }
        } else {
            
        }
    }
    echo json_encode('Игрок не походил');
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
 