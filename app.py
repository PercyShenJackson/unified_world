
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

HOST = "127.0.0.1"
PORT = 8000

progress = {
    "points": 0,
    "completed": 0
}


class UnifiedWorldHandler(SimpleHTTPRequestHandler):

    def do_GET(self):

        if self.path == "/api/progress":
            self.send_json(progress)
            return

        super().do_GET()

    def do_POST(self):

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json({"error": "Invalid JSON"}, 400)
            return

        if self.path == "/api/progress":

            points = data.get("points")
            completed = data.get("completed")

            if not isinstance(points, int) or not isinstance(completed, int):
                self.send_json({"error": "Invalid progress"}, 400)
                return

            progress["points"] = max(0, points)
            progress["completed"] = max(0, completed)

            self.send_json({
                "message": "Progress updated",
                **progress
            })

        elif self.path == "/api/physics":

            try:
                velocity = float(data["velocity"])
                acceleration = float(data["acceleration"])
                time = float(data["time"])

                if not all(map(
                    lambda x: abs(x) < 1e12,
                    [velocity, acceleration, time]
                )) or time < 0:
                    raise ValueError()

                final_velocity = velocity + acceleration * time

                displacement = (
                    velocity * time
                    + 0.5 * acceleration * time ** 2
                )

                self.send_json({
                    "final_velocity": round(final_velocity, 3),
                    "displacement": round(displacement, 3)
                })

            except (ValueError, KeyError, TypeError):
                self.send_json({
                    "error": "Invalid physics values"
                }, 400)

        else:
            self.send_json({"error": "Not found"}, 404)

    def send_json(self, data, status=200):

        response = json.dumps(data).encode()

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(response)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

        self.wfile.write(response)


if __name__ == "__main__":

    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    server = HTTPServer((HOST, PORT), UnifiedWorldHandler)

    print("=" * 45)
    print("       武 · UNIFIED WORLD")
    print("=" * 45)
    print(f"Application: http://{HOST}:{PORT}")
    print("Server running...")
    print("Press CTRL+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        server.server_close()
