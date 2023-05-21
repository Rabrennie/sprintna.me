#!/bin/sh
cd /app && npm run prisma:migrate:deploy
node /app
