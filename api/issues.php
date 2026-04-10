<?php
/**
 * Issues API — JSON 文件存储
 * GET             → 返回所有留言 {"issues": [...]}
 * POST            → 提交新留言，返回 {"ok": true, "issue": {...}}
 *
 * POST 参数（JSON body）：
 *   name     (必填, 1-60)
 *   email    (选填, 有效邮箱)
 *   website  (选填, URL)
 *   type     (必填: flag-fix | new-flag | suggestion | bug | other)
 *   title    (必填, 1-120)
 *   body     (必填, 1-2000)
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$dir  = dirname(__DIR__) . '/data';
$file = $dir . '/issues.json';

// ---------- load .env for GitHub ----------
$ghToken = '';
$ghRepo  = '';
$envFile = dirname(__DIR__) . '/.env';
if (is_file($envFile) && is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (preg_match('/^GITHUB_TOKEN=(.*)$/', $line, $m)) $ghToken = trim($m[1], " \t\"'");
        if (preg_match('/^GITHUB_REPO=(.*)$/', $line, $m))  $ghRepo  = trim($m[1], " \t\"'");
    }
}

// ---------- helpers ----------
function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

function loadIssues($file) {
    if (!is_file($file)) return [];
    $raw = @file_get_contents($file);
    if ($raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function saveIssues($file, $data) {
    file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function sanitize($str, $maxLen) {
    $str = trim((string) $str);
    $str = strip_tags($str);
    if (mb_strlen($str) > $maxLen) $str = mb_substr($str, 0, $maxLen);
    return $str;
}

function publicIssue($issue) {
    unset($issue['email'], $issue['ip']);
    return $issue;
}

function appendIssueAtomic($file, $issueData) {
    $fp = fopen($file, 'c+');
    if ($fp === false) {
        fail('Failed to open issues storage', 500);
    }

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        fail('Failed to lock issues storage', 500);
    }

    $raw = stream_get_contents($fp);
    $issues = json_decode($raw ?: '[]', true);
    if (!is_array($issues)) $issues = [];

    $last = end($issues);
    $nextId = is_array($last) && isset($last['id']) ? (int) $last['id'] + 1 : 1;
    $issue = $issueData;
    $issue['id'] = $nextId;

    $issues[] = $issue;
    $json = json_encode($issues, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($json === false) {
        flock($fp, LOCK_UN);
        fclose($fp);
        fail('Failed to encode issues storage', 500);
    }

    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, $json);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $issue;
}

// ---------- rate limit (simple: per IP, max 5 per 10 min) ----------
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $tmp = sys_get_temp_dir() . '/flagcdn_issues_' . md5($ip);
    $window = 600; // 10 min
    $maxReq = 5;

    $fp = fopen($tmp, 'c+');
    if ($fp === false) {
        fail('Failed to open rate limit storage', 500);
    }
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        fail('Failed to lock rate limit storage', 500);
    }

    $raw = stream_get_contents($fp);
    $timestamps = json_decode($raw ?: '[]', true);
    if (!is_array($timestamps)) {
        $timestamps = [];
    }
    $now = time();
    $timestamps = array_filter($timestamps, function ($t) use ($now, $window) {
        return ($now - $t) < $window;
    });
    if (count($timestamps) >= $maxReq) {
        flock($fp, LOCK_UN);
        fclose($fp);
        fail('Too many submissions. Please try again later.', 429);
    }
    $timestamps[] = $now;
    $json = json_encode(array_values($timestamps));
    if ($json === false) {
        flock($fp, LOCK_UN);
        fclose($fp);
        fail('Failed to encode rate limit storage', 500);
    }

    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, $json);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

// ---------- GET ----------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $issues = loadIssues($file);
    $public = array_map('publicIssue', $issues);
    // 按时间倒序
    usort($public, function ($a, $b) {
        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
    });
    echo json_encode(['issues' => $public]);
    exit;
}

// ---------- POST ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

checkRateLimit();

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) fail('Invalid JSON');

$name    = sanitize($input['name'] ?? '', 60);
$email   = sanitize($input['email'] ?? '', 120);
$website = sanitize($input['website'] ?? '', 200);
$type    = sanitize($input['type'] ?? '', 20);
$title   = sanitize($input['title'] ?? '', 120);
$body    = sanitize($input['body'] ?? '', 2000);

// validate
if ($name === '') fail('Name is required');
if ($title === '') fail('Title is required');
if ($body === '')  fail('Description is required');

$validTypes = ['flag-fix', 'new-flag', 'suggestion', 'bug', 'other'];
if (!in_array($type, $validTypes, true)) fail('Invalid issue type');

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Invalid email');
}
if ($website !== '' && !preg_match('#^https?://#i', $website)) {
    $website = 'https://' . $website;
}
if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
    $website = '';
}

// build issue
$issue = [
    'name'       => $name,
    'email'      => $email,
    'website'    => $website,
    'type'       => $type,
    'title'      => $title,
    'body'       => $body,
    'status'     => 'open',
    'created_at' => gmdate('c'),
];

$issue = appendIssueAtomic($file, $issue);

// ---------- sync to GitHub Issues ----------
if ($ghToken && $ghRepo) {
    $typeLabels = [
        'flag-fix' => 'flag-fix',
        'new-flag' => 'new-flag',
        'suggestion' => 'suggestion',
        'bug' => 'bug',
        'other' => 'other',
    ];
    $ghBody = $body;
    if ($website) $ghBody .= "\n\n**Website:** " . $website;
    $ghBody .= "\n\n---\n*Submitted by " . $name . " via flagcdn.io/issues/ · #" . $issue['id'] . "*";

    $ghPayload = json_encode([
        'title'  => '[' . strtoupper($type) . '] ' . $title,
        'body'   => $ghBody,
        'labels' => [$typeLabels[$type] ?? 'other'],
    ]);

    $ch = curl_init("https://api.github.com/repos/{$ghRepo}/issues");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $ghToken,
            'Accept: application/vnd.github.v3+json',
            'Content-Type: application/json',
            'User-Agent: flagcdn.io',
        ],
        CURLOPT_POSTFIELDS     => $ghPayload,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $ghResponse = curl_exec($ch);
    curl_close($ch);
}

echo json_encode(['ok' => true, 'issue' => publicIssue($issue)]);
