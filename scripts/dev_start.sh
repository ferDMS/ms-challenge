#!/bin/sh

# cd into the repository root directory
cd "${0%/*}/.." || exit 1

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  echo 'Creating python virtual environment ".venv"'
  python3 -m venv .venv
else
  echo 'Using existing virtual environment'
fi

echo ""
echo "Restoring backend python packages"
echo ""

./.venv/bin/python -m pip install -r app/backend/requirements.txt
out=$?
if [ $out -ne 0 ]; then
  echo "Failed to restore backend python packages"
  exit $out
fi

echo ""
echo "Restoring frontend npm packages"
echo ""

cd app/frontend
npm install
out=$?
if [ $out -ne 0 ]; then
  echo "Failed to restore frontend npm packages"
  exit $out
fi

echo ""
echo "Starting backend and frontend in development mode"
echo ""

# Start backend in background
cd ../backend
port=5001
host=localhost

# Function to clean up backend process on exit
cleanup() {
  echo "Cleaning up processes..."
  [ -n "$backend_pid" ] && kill $backend_pid
  exit $1
}

# Set up trap to ensure cleanup on script termination
trap 'cleanup $?' INT TERM EXIT

# Start the Flask server in the background
../../.venv/bin/python -m flask run --port "$port" --host "$host" --debug &
backend_pid=$!

# Make sure the backend started successfully
sleep 2
if ! ps -p $backend_pid > /dev/null; then
  echo "Failed to start backend server"
  exit 1
fi
echo "Backend server running on http://$host:$port (PID: $backend_pid)"

# Go back to frontend and start dev server
cd ../frontend
echo "Starting frontend development server..."
npm run dev
frontend_out=$?

# The trap will handle cleanup when we exit
if [ $frontend_out -ne 0 ]; then
  echo "Frontend development server exited with error"
  exit $frontend_out
fi
