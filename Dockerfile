FROM node:16-alpine
LABEL authors="Anatolii Vasyliev"
WORKDIR /app
COPY . .
RUN npm install
RUN npx tsc --project tsconfig.json
EXPOSE 80
CMD ["node", "app/app.js"]