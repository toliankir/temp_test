if [ "${RUN_DB}" = "yes" ]; then
   echo "Run DB migrations and seeds"
   npx typeorm migration:run -d dist/database/datasource.js
   npx node ./node_modules/typeorm-extension/bin/cli.cjs seed:run -d dist/database/datasource.js
fi

npm run seed & node dist/main.js