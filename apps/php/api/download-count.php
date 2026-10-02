<?php
/**
 * Total clicks on the site's ZIP download button, across all visitors.
 * GET reads the count; POST records one download click.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
ini_set('display_errors', '0');

function downloadCountError($message) {
    http_response_code(500);
    echo json_encode(['error' => $message]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST') {
    header('Allow: GET, POST');
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$dir = dirname(__DIR__) . '/data';
$file = $dir . '/download-count.txt';

// Reading a count must not require write permission or create a file.
if ($method === 'GET' && !file_exists($file)) {
    echo json_encode(['count' => 0]);
    exit;
}
if ($method === 'POST' && !is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
    downloadCountError('Failed to initialize download storage');
}

$fp = @fopen($file, $method === 'GET' ? 'r' : 'c+');
if ($fp === false) {
    downloadCountError('Failed to open download storage');
}
if (!flock($fp, $method === 'GET' ? LOCK_SH : LOCK_EX)) {
    fclose($fp);
    downloadCountError('Failed to lock download storage');
}

try {
    $raw = stream_get_contents($fp);
    if ($raw === false) {
        downloadCountError('Failed to read download storage');
    }
    $raw = trim($raw);
    if ($raw !== '' && (!ctype_digit($raw) || (float) $raw >= PHP_INT_MAX)) {
        downloadCountError('Invalid download count');
    }
    $count = $raw === '' ? 0 : (int) $raw;

    if ($method === 'POST') {
        $next = (string) ($count + 1);
        if (!rewind($fp) || @fwrite($fp, $next) !== strlen($next) || !@ftruncate($fp, strlen($next)) || !@fflush($fp)) {
            downloadCountError('Failed to save download count');
        }
        $count += 1;
    }
} finally {
    flock($fp, LOCK_UN);
    fclose($fp);
}

echo json_encode(['count' => $count]);
