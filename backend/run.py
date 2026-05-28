import uvicorn

if __name__ == "__main__":
    # Bootstraps the uvicorn web server
    # - app.main:app: Points to main.py inside app directory, pulling the 'app' variable.
    # - host="127.0.0.1": Binds server to local machine only.
    # - port=8000: Binds API to HTTP port 8000.
    # - reload=True: Enables hot-reloading (server restarts automatically when files are modified).
    print("[*] Starting Tuition Centre Management System API server...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
