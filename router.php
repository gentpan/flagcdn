<?php
// router.php — 让 `php -S` 支持 .htaccess 风格的 clean URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = '/' . ltrim($uri, '/');

// 预生成栅格图 /i/1x1/64/cn.png → raster/1x1/64/cn.png
if (preg_match('#^/i/(1x1|4x3)/(\d+)/([a-z0-9][a-z0-9-]{0,15})\.(png|webp|avif)$#', $uri, $m)) {
    $fsPath = __DIR__ . '/raster/' . $m[1] . '/' . $m[2] . '/' . $m[3] . '.' . $m[4];
    if (is_file($fsPath)) {
        $types = ['png' => 'image/png', 'webp' => 'image/webp', 'avif' => 'image/avif'];
        header('Content-Type: ' . $types[$m[4]]);
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Access-Control-Allow-Origin: *');
        readfile($fsPath);
        return true;
    }
    // 未预生成则 fallback 到 API
    $_GET = ['ratio' => $m[1], 'w' => $m[2], 'cc' => $m[3], 'fmt' => $m[4]];
    require __DIR__ . '/api/flag.php';
    return true;
}

// 已有文件直接服务（包括 PHP 入口）
$fsPath = __DIR__ . $uri;
if ($uri !== '/' && is_file($fsPath)) {
    // 静态文件走 PHP 服务器默认行为
    return false;
}

// 把 clean URL 映射到 PHP
$routes = [
    '#^/docs/?$#'                => '/docs.php',
    '#^/issues/?$#'              => '/issues.php',
    '#^/changelog/?$#'           => '/changelog.php',
    '#^/flags/?$#'               => '/flags.php',
    '#^/flag/([a-z0-9][a-z0-9-]{0,15})/?$#' => '/flag.php?cc=$1',
    '#^/i/(1x1|4x3)/(\d+)/([a-z0-9][a-z0-9-]{0,15})\.(png|webp|avif)$#' => '/raster/$1/$2/$3.$4',
];
foreach ($routes as $pattern => $target) {
    if (preg_match($pattern, $uri)) {
        $new = preg_replace($pattern, $target, $uri);
        // 拆 path 和 query
        $parts = explode('?', $new, 2);
        $_SERVER['SCRIPT_NAME'] = $parts[0];
        $_SERVER['PHP_SELF']    = $parts[0];
        if (isset($parts[1])) {
            parse_str($parts[1], $qs);
            $_GET = array_merge($_GET, $qs);
        }
        // 包含真正的 PHP
        require __DIR__ . $parts[0];
        return true;
    }
}
// 未匹配：让 PHP 服务器自己处理（通常 404）
return false;
