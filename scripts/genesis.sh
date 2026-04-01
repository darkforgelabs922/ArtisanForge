#!/usr/bin/env bash
# ArtisanForge - Node Initialization Protocol
set -e
echo "Initializing ArtisanForge Decentralized Node..."
NODE_DIR="$HOME/.artisanforge"
mkdir -p "$NODE_DIR" && cd "$NODE_DIR"
git clone https://github.com/QuantumSynaptic/ArtisanForge.git repo --quiet && cd repo
echo "Starting polyglot microservices in background..."
nohup python src/python_ai/ai_guild_orchestrator.py > "$NODE_DIR/ai_guild.log" 2>&1 &
nohup go run src/go_gateway/api_gateway.go > "$NODE_DIR/gateway.log" 2>&1 &
echo "=== ARTISANFORGE NODE ONLINE ==="
