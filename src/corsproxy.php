<?php
    $content = @file_get_contents($_GET["url"]);
    if (@is_array($http_response_header) && !@boolval($_GET["removeheader"])) {
        foreach($http_response_header as $header) {
            header($header);
        }
    }
    header("Access-Control-Allow-Origin: *", true);
    echo $content;