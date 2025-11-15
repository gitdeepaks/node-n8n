#!/usr/bin/env zsh

# Source shell profile to get npm/npx in PATH (for fnm, nvm, etc.)
if [ -f "$HOME/.zshrc" ]; then
  source "$HOME/.zshrc" 2>/dev/null || true
elif [ -f "$HOME/.bash_profile" ]; then
  source "$HOME/.bash_profile" 2>/dev/null || true
elif [ -f "$HOME/.profile" ]; then
  source "$HOME/.profile" 2>/dev/null || true
fi

# Initialize fnm if available
if command -v fnm &> /dev/null; then
  eval "$(fnm env --use-on-cd)" 2>/dev/null || true
fi

# Try to find npm in common locations if not in PATH
if ! command -v npm &> /dev/null; then
  # Check for fnm node installation
  if [ -d "$HOME/.local/share/fnm" ]; then
    export PATH="$HOME/.local/share/fnm:$PATH"
    eval "$(fnm env --use-on-cd)" 2>/dev/null || true
  fi

  # Check for nvm
  if [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  fi
fi

# Wait for Next.js server to be ready
MAX_ATTEMPTS=60
ATTEMPT=0

echo "Waiting for Next.js server to be ready..."

# First wait for port to be open (faster check)
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if lsof -i :3000 > /dev/null 2>&1; then
    echo "Port 3000 is open, checking endpoint..."
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))
  if [ $((ATTEMPT % 5)) -eq 0 ]; then
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS: Waiting for port 3000..."
  fi
  sleep 1
done

# Now wait for the endpoint to respond
ENDPOINT_READY=false
ATTEMPT=0
while [ $ATTEMPT -lt 10 ]; do
  if curl -s http://localhost:3000/api/inngest > /dev/null 2>&1; then
    echo "Next.js server is ready!"
    ENDPOINT_READY=true
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))
  echo "Endpoint check $ATTEMPT/10: Waiting for /api/inngest to respond..."
  sleep 1
done

if [ "$ENDPOINT_READY" = "false" ]; then
  echo "Warning: Next.js server endpoint did not become ready in time, starting inngest-cli anyway..."
fi

# Start inngest-cli with explicit error handling
echo "Starting inngest-cli dev server..."
cd "$(dirname "$0")/.." || exit 1

# Ensure npm is available
if ! command -v npm &> /dev/null; then
  echo "Error: npm not found in PATH" >&2
  echo "PATH: $PATH" >&2
  echo "Trying to continue anyway..." >&2
  # Don't exit - let npm run fail naturally so we can see the error
fi

# Run npm command - this will fail if npm is not available, but at least we'll see the error
npm run inngest:dev

