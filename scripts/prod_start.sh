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
# Ensure gunicorn is installed for production
./.venv/bin/python -m pip install gunicorn
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
echo "Building frontend for production"
echo ""

npm run build
out=$?
if [ $out -ne 0 ]; then
  echo "Failed to build frontend"
  exit $out
fi

echo ""
echo "Starting backend and frontend in production mode"
echo ""

# Function to clean up processes on exit
cleanup() {
  echo "Cleaning up processes..."
  [ -n "$backend_pid" ] && kill $backend_pid
  [ -n "$frontend_pid" ] && kill $frontend_pid
  exit $1
}

# Set up trap to ensure cleanup on script termination
trap 'cleanup $?' INT TERM EXIT

# Start the backend using Gunicorn in the background
cd ../backend
port=5001
host=0.0.0.0  # Use 0.0.0.0 for production to listen on all interfaces

# Activate the virtual environment before starting the backend
source ../../.venv/bin/activate

# Start gunicorn with the wsgi entry point
gunicorn --bind "$host:$port" wsgi:app &
backend_pid=$!

# Make sure the backend started successfully
sleep 2
if ! ps -p $backend_pid > /dev/null; then
  echo "Failed to start backend server"
  exit 1
fi
echo "Backend server running on http://$host:$port (PID: $backend_pid)"

# Go back to frontend and serve the built files
cd ../frontend
echo "Starting frontend production server..."
npx next start -p 3000 &
frontend_pid=$!

# Make sure the frontend server started successfully
sleep 2
if ! ps -p $frontend_pid > /dev/null; then
  echo "Failed to start frontend server"
  exit 1
fi
echo "Frontend server running on http://localhost:3000 (PID: $frontend_pid)"

# Keep the script running to maintain both servers
echo "Press Ctrl+C to stop the servers"
wait
