npx typeorm migration:run -d dist/database/datasource.js && \
npx node ./node_modules/typeorm-extension/bin/cli.cjs seed:run -d dist/database/datasource.js && \ 
npm run seed & node dist/main.js