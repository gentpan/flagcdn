#!/usr/bin/env python3
"""Exercise the PHP download API in isolated storage, never on the live counter."""
import concurrent.futures
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.request


class DownloadCountTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="flagcdn-count-test-")
        self.root = Path(self.temp.name)
        (self.root / "api").mkdir()
        self.endpoint = self.root / "api/download-count.php"
        shutil.copyfile(Path(__file__).resolve().parents[1] / "apps/php/api/download-count.php", self.endpoint)
        self.count = self.root / "data/download-count.txt"
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        self.url = f"http://127.0.0.1:{port}/api/download-count.php"
        self.server = subprocess.Popen(
            ["php", "-S", f"127.0.0.1:{port}", "-t", str(self.root)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(100):
            try:
                self.request("GET")
                break
            except urllib.error.URLError:
                time.sleep(0.02)
        else:
            self.tearDown()
            self.fail("PHP test server did not start")

    def tearDown(self):
        self.server.terminate()
        self.server.wait(timeout=5)
        if self.count.is_file():
            self.count.chmod(0o600)
        self.temp.cleanup()

    def request(self, method):
        request = urllib.request.Request(self.url, method=method, data=b"" if method == "POST" else None)
        try:
            response = urllib.request.urlopen(request, timeout=5)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, dict(response.headers), json.loads(response.read())

    def store(self, value):
        self.count.parent.mkdir(exist_ok=True)
        self.count.write_text(value)

    def test_get_without_storage_does_not_create_it(self):
        status, headers, data = self.request("GET")
        self.assertEqual((status, data), (200, {"count": 0}))
        self.assertIn("no-store", headers["Cache-Control"])
        self.assertFalse(self.count.parent.exists())

    def test_initialization_and_existing_total_are_preserved(self):
        self.assertEqual(self.request("POST")[2], {"count": 1})
        self.store("2220")
        self.assertEqual(self.request("GET")[2], {"count": 2220})
        self.assertEqual(self.request("POST")[2], {"count": 2221})
        self.assertEqual(self.count.read_text(), "2221")

    @unittest.skipIf(os.geteuid() == 0, "Root bypasses file permissions")
    def test_read_only_storage_can_be_read_but_failed_write_is_json(self):
        self.store("2220")
        self.count.chmod(0o400)
        self.assertEqual(self.request("GET")[2], {"count": 2220})
        status, _, data = self.request("POST")
        self.assertEqual(status, 500)
        self.assertIn("error", data)
        self.assertEqual(self.count.read_text(), "2220")

    def test_invalid_count_is_not_silently_reset(self):
        self.store("invalid")
        for method in ("GET", "POST"):
            self.assertEqual(self.request(method)[0], 500)
        self.assertEqual(self.count.read_text(), "invalid")

    def test_unsupported_method(self):
        status, headers, _ = self.request("PUT")
        self.assertEqual(status, 405)
        self.assertEqual(headers["Allow"], "GET, POST")

    def test_concurrent_processes_do_not_lose_increments(self):
        self.store("2220")
        code = '$_SERVER["REQUEST_METHOD"] = "POST"; require $argv[1];'
        def increment(_):
            return json.loads(subprocess.check_output(["php", "-r", code, str(self.endpoint)], text=True))
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(increment, range(32)))
        self.assertEqual(sorted(item["count"] for item in results), list(range(2221, 2253)))
        self.assertEqual(self.request("GET")[2], {"count": 2252})


if __name__ == "__main__":
    unittest.main(verbosity=2)
