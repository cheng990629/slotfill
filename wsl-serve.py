"""Slotfill WSL static server: serves frontend/dist and proxies /api/* to the local slotfill backend.
Binds 0.0.0.0 so Windows/Tailscale can reach it. Stdlib only."""
import json, os, urllib.request, urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")
BACKEND = os.environ.get("SLOTFILL_BACKEND", "http://127.0.0.1:8003")
PORT = int(os.environ.get("SLOTFILL_PORT", "5175"))

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIST, **kw)
    def log_message(self, *a):
        pass
    def do_GET(self):
        if self.path.startswith("/api/"):
            self._proxy()
        else:
            super().do_GET()
    def do_POST(self):
        if self.path.startswith("/api/"):
            self._proxy()
        else:
            self.send_error(404)
    def _proxy(self):
        url = BACKEND + self.path
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        req = urllib.request.Request(url, data=body, method=self.command)
        for k, v in self.headers.items():
            if k.lower() not in ("host", "content-length", "connection"):
                req.add_header(k, v)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
                self.send_response(r.status)
                for k, v in r.headers.items():
                    if k.lower() not in ("connection", "transfer-encoding"):
                        self.send_header(k, v)
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            data = json.dumps({"error": str(e)}).encode()
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
    def send_error(self, code, message=None, explain=None):
        # SPA fallback: unknown paths (not /api, not a file) serve index.html
        if code == 404 and not self.path.startswith("/api/"):
            self.path = "/index.html"
            super().do_GET()
        else:
            super().send_error(code, message, explain)

if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", PORT), H).serve_forever()
