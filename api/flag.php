<?php
/**
 * 国旗渲染 API
 *
 * 预设尺寸 (16–512) + PNG/WebP/AVIF：优先读 raster/{ratio}/{size}/{cc}.{fmt}，未命中再渲染落盘
 * SVG / 自定义尺寸：即时处理
 *
 * GET /api/flag.php?ratio=1x1&cc=cn&w=64&fmt=png
 * 公开静态 URL（预生成）: /i/1x1/64/cn.png
 */
declare(strict_types=1);

require __DIR__ . '/../includes/raster.php';

$ratio = isset($_GET['ratio']) ? (string) $_GET['ratio'] : '';
$cc    = isset($_GET['cc'])    ? (string) $_GET['cc']    : '';
$wRaw  = isset($_GET['w'])     ? (string) $_GET['w']     : '';
$fmt   = isset($_GET['fmt'])   ? strtolower((string) $_GET['fmt']) : '';

if (!in_array($ratio, RASTER_RATIOS, true)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    exit('invalid ratio');
}
if (!preg_match('/^[a-z0-9][a-z0-9-]{0,15}$/', $cc)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    exit('invalid cc');
}
if (!preg_match('/^\d{1,4}$/', $wRaw)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    exit('invalid w');
}
$w = (int) $wRaw;
if ($w < 8 || $w > 2048) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    exit('w out of range (8..2048)');
}
if (!in_array($fmt, array_merge(['svg'], RASTER_FORMATS), true)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    exit('invalid fmt');
}

$h = raster_height($ratio, $w);

$root     = dirname(__DIR__);
$srcSvg   = $root . '/flags/' . $ratio . '/' . $cc . '.svg';
$cacheFile = raster_file_path($root, $ratio, $w, $cc, $fmt);

if (!is_file($srcSvg)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    exit('flag not found');
}

$contentTypes = [
    'svg'  => 'image/svg+xml',
    'png'  => 'image/png',
    'webp' => 'image/webp',
    'avif' => 'image/avif',
];
header('Content-Type: ' . $contentTypes[$fmt] . '; charset=utf-8');
header('Cache-Control: public, max-age=31536000, immutable');
header('Access-Control-Allow-Origin: *');

if ($fmt === 'svg') {
    $svg = file_get_contents($srcSvg);
    if ($svg === false) {
        http_response_code(500);
        exit('read failed');
    }
    $svg = preg_replace('/\s(width|height)="[^"]*"/i', '', $svg, 2);
    $svg = preg_replace(
        '/(<svg\b[^>]*?)(>)/i',
        '$1 width="' . $w . '" height="' . $h . '"$2',
        $svg,
        1
    );
    header('ETag: "' . substr(md5($cc . '|' . $ratio . '|' . $w), 0, 16) . '"');
    echo $svg;
    exit;
}

if (is_file($cacheFile) && filesize($cacheFile) > 0) {
    header('Content-Length: ' . filesize($cacheFile));
    header('X-Cache: HIT');
    readfile($cacheFile);
    exit;
}

$cacheDir = dirname($cacheFile);
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0775, true);
}
if (!is_dir($cacheDir) || !is_writable($cacheDir)) {
    $tmpPng = tempnam(sys_get_temp_dir(), 'flag_');
} else {
    $tmpPng = $cacheDir . '/.tmp_' . $cc . '_' . $w . '.png';
}

$cmd = sprintf(
    'rsvg-convert -w %d -h %d -a %s -o %s 2>&1',
    $w,
    $h,
    escapeshellarg($srcSvg),
    escapeshellarg($tmpPng)
);
exec($cmd, $out, $code);
if ($code !== 0 || !is_file($tmpPng) || filesize($tmpPng) === 0) {
    @unlink($tmpPng);
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit('render failed: ' . implode("\n", array_slice($out, 0, 3)));
}

if ($fmt === 'png') {
    $final = $tmpPng;
    if (is_dir($cacheDir) && is_writable($cacheDir)) {
        @rename($tmpPng, $cacheFile);
        $final = $cacheFile;
    }
} elseif ($fmt === 'webp') {
    $tmpFinal = is_writable($cacheDir) ? $cacheDir . '/.tmp_' . $cc . '_' . $w . '.webp' : tempnam(sys_get_temp_dir(), 'flagw_');
    $cmd = sprintf('cwebp -q 90 -quiet -m 6 %s -o %s 2>&1', escapeshellarg($tmpPng), escapeshellarg($tmpFinal));
    exec($cmd, $out2, $code2);
    @unlink($tmpPng);
    if ($code2 !== 0 || !is_file($tmpFinal) || filesize($tmpFinal) === 0) {
        @unlink($tmpFinal);
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        exit('webp encode failed');
    }
    $final = $tmpFinal;
    if (is_writable($cacheDir)) {
        @rename($tmpFinal, $cacheFile);
        $final = $cacheFile;
    }
} else {
    $tmpFinal = is_writable($cacheDir) ? $cacheDir . '/.tmp_' . $cc . '_' . $w . '.avif' : tempnam(sys_get_temp_dir(), 'flaga_');
    $cmd = sprintf('avifenc -q 60 %s %s 2>&1', escapeshellarg($tmpPng), escapeshellarg($tmpFinal));
    exec($cmd, $out3, $code3);
    @unlink($tmpPng);
    if ($code3 !== 0 || !is_file($tmpFinal) || filesize($tmpFinal) === 0) {
        @unlink($tmpFinal);
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        exit('avif encode failed');
    }
    $final = $tmpFinal;
    if (is_writable($cacheDir)) {
        @rename($tmpFinal, $cacheFile);
        $final = $cacheFile;
    }
}

header('X-Cache: MISS');
header('Content-Length: ' . filesize($final));
readfile($final);
