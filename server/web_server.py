import os
import sys
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Add current directory to path so we can import from process
sys.path.append(os.path.dirname(__file__))

from process.llm_funcs.llm_scr import llm_response

# Path to the client directory
CLIENT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'client')

class ChatHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CLIENT_DIR, **kwargs)

    def do_POST(self):
        if self.path == '/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                user_msg = data.get('message', '')
                
                print(f"Received message: {user_msg}")
                
                # Call our standard llm_response which hits Ollama
                response_text = llm_response(user_msg)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                
                response_data = json.dumps({"response": response_text})
                self.wfile.write(response_data.encode('utf-8'))
                
            except Exception as e:
                print(f"Error handling /chat POST: {e}")
                self.send_response(500)
                self.end_headers()
        else:
            self.send_error(404, "Endpoint not found")

def run(server_class=HTTPServer, handler_class=ChatHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on http://localhost:{port}...")
    print("Serving client UI from:", CLIENT_DIR)
    httpd.serve_forever()

if __name__ == '__main__':
    run()
