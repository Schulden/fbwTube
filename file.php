<?php
    if (isset($_POST['filedata'])){
        $data = $_POST['filedata'];
        $fileName = $_POST['filename'];
        //DOCUMENT_ROOT ist public_html (hier data als Folder eingeben)
        $file = fopen($_SERVER['DOCUMENT_ROOT'].'/'.$fileName.'.json', 'w+');
        fwrite($file, $data);
        fclose($file);
    }
?>