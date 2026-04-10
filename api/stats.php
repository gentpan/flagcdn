<?php
/**
 * Cloudflare Analytics proxy — returns total requests & unique visitors.
 * Caches result for 1 hour to avoid hitting Cloudflare rate limits.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ---------- load .env ----------
$envFile = __DIR__ . '/../.env';
$cfToken = '';
$cfZone  = '';
if (is_file($envFile) && is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (preg_match('/^CLOUDFLARE_API_TOKEN=(.*)$/', $line, $m)) $cfToken = trim($m[1], " \t\"'");
        if (preg_match('/^CLOUDFLARE_ZONE_ID=(.*)$/', $line, $m))   $cfZone  = trim($m[1], " \t\"'");
    }
}

if (!$cfToken || !$cfZone) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing Cloudflare credentials']);
    exit;
}

// ---------- cache (1 hour) ----------
$cacheFile = sys_get_temp_dir() . '/flagcdn_cf_stats.json';
if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < 3600) {
    echo file_get_contents($cacheFile);
    exit;
}

// ---------- query Cloudflare GraphQL ----------
$since = date('Y-m-d', strtotime('-30 days'));
$until = date('Y-m-d');

$query = <<<GQL
{
  viewer {
    zones(filter: { zoneTag: "{$cfZone}" }) {
      httpRequests1dGroups(
        limit: 1
        filter: { date_geq: "{$since}", date_leq: "{$until}" }
      ) {
        sum {
          requests
          bytes
          pageViews
        }
        uniq {
          uniques
        }
      }
    }
  }
}
GQL;

$ch = curl_init('https://api.cloudflare.com/client/v4/graphql');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $cfToken,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS     => json_encode(['query' => $query]),
    CURLOPT_TIMEOUT        => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(502);
    echo json_encode(['error' => 'Cloudflare API error']);
    exit;
}

$data = json_decode($response, true);
$groups = $data['data']['viewer']['zones'][0]['httpRequests1dGroups'][0] ?? null;

if (!$groups) {
    http_response_code(502);
    echo json_encode(['error' => 'No analytics data']);
    exit;
}

$result = json_encode([
    'requests' => $groups['sum']['requests'] ?? 0,
    'bytes'    => $groups['sum']['bytes'] ?? 0,
    'pageViews'=> $groups['sum']['pageViews'] ?? 0,
    'visitors' => $groups['uniq']['uniques'] ?? 0,
    'since'    => $since,
    'until'    => $until,
]);

file_put_contents($cacheFile, $result, LOCK_EX);
echo $result;
