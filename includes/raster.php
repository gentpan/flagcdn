<?php
/**
 * 栅格图路径与 URL 常量 — api/flag.php 与页面共用
 */
declare(strict_types=1);

const RASTER_SIZES = [16, 24, 32, 48, 64, 128, 256, 512];
const RASTER_FORMATS = ['png', 'webp', 'avif'];
const RASTER_RATIOS = ['1x1', '4x3'];

function raster_file_path(string $root, string $ratio, int $w, string $cc, string $fmt): string
{
    return $root . '/raster/' . $ratio . '/' . $w . '/' . $cc . '.' . $fmt;
}

/** 公开 CDN 短链 /i/1x1/64/cn.png */
function raster_public_url(string $ratio, int $w, string $cc, string $fmt): string
{
    return '/i/' . $ratio . '/' . $w . '/' . rawurlencode($cc) . '.' . $fmt;
}

function raster_is_preset_size(int $w): bool
{
    return in_array($w, RASTER_SIZES, true);
}

function raster_height(string $ratio, int $w): int
{
    return $ratio === '1x1' ? $w : (int) round($w * 3 / 4);
}
