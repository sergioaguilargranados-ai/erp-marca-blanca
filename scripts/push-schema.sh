#!/bin/bash
# Script to push database schema automatically

cd "$(dirname "$0")/.."

# Use 'yes' to automatically answer 'yes' to prompts
yes | bunx drizzle-kit push
