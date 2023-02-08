FROM node:lts-alpine

WORKDIR /app
COPY . .


WORKDIR /app/frontend
RUN npm install
RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build
RUN chmod +x run.sh

EXPOSE 8080

ENTRYPOINT [ "/app/frontend/run.sh" ]
