---
layout: layout.pug
title: Example Snippets
navigationTitle: Example Snippets
menuWeight: -1
---

# Annotated multi-pod with all parameters

```bash
#!/usr/bin/env python3

import collections
import json
import os
import signal
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

ill = False
filename = ""

class TestServerHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    print("GET: [%s]\n" % self.path)
    if self.path == "/ping":
      self._handle_ping()
    elif self.path == "/die":
      self._die()
    elif self.path == "/ill":
      self._get_ill()
    elif self.path == "/write":
      self._handle_write()
    elif self.path == "/read":
      self._handle_read()
    else:
      self.send_error(404, "Not found", "Endpoint is not supported")
    return

  def _handle_ping(self):
    data = {"pong": True}

    if not ill:
      self._send_reply(data)
    else:
      self.send_error(404, "No", "I'm ill")

  def _handle_write(self):
    current_time = time.strftime("%a, %d %b %Y %H:%M:%S", time.localtime())

    global filename
    with open(filename, "a") as file_object:
      file_object.write(current_time + "\n")

    data = {"wrote": current_time}

    if not ill:
      self._send_reply(data)
    else:
      self.send_error(404, "No", "I'm ill")

  def _handle_read(self):
    global filename
    if (os.path.isfile(filename)):
      # A ring buffer to hold the final lines of the file.
      read_lines = collections.deque(maxlen=10)

      with open(filename, "r") as file_object:
        for line in file_object:
          read_lines.appendleft(line)

      read_text = ""
      for line in read_lines:
        read_text += line

      data = {"read": read_text}

      if not ill:
        self._send_reply(data)
      else:
        self.send_error(404, "No", "I'm ill")
    else:
      self._send_reply({"please wait": "file not readable"})

  def _send_reply(self, data):
    self.send_response(200)
    self.send_header("Content-type", "application/json")
    self.end_headers()
    body_str = json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))
    bytes_arr = bytes(body_str, "utf-8")
    self.wfile.write(bytes_arr)

  def _die(self):
    print("Goodbye cruel world.")
    self._send_reply({"dead": True})
    os._exit(1)

  def _get_ill(self):
    global ill
    print("Server's illin'.")
    ill = True
    self._send_reply({"ill": True})


def main():
  listen_port = int(sys.argv[1])

  global filename
  filename = sys.argv[2]

  test_server = HTTPServer(('', listen_port), TestServerHandler)

  def sigterm_handler(_signo, _stack_frame):
    test_server.server_close()
    sys.exit(0)

  signal.signal(signal.SIGTERM, sigterm_handler)
  signal.signal(signal.SIGINT, sigterm_handler)

  print("serving at port", listen_port)
  test_server.serve_forever()


if __name__ == '__main__':
    main()
    ```
