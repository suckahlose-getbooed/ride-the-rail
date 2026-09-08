#!/usr/bin/env python3
"""Serve the app on http://localhost:8000

A service worker will not register from a file:// URL, so double-clicking
index.html gives you the game but not the installable app. Run this instead:

    python3 serve.py

then open http://localhost:8000 in Chrome or Edge and use the install button
in the address bar.
"""
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.webmanifest': 'application/manifest+json',
        '.js': 'text/javascript',
    }

    def end_headers(self):
        # never cache during development, or the worker will serve you
        # yesterday's build and you will chase a bug that is not there
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Ride the Rail  ->  http://localhost:{PORT}")
    print("Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print()
