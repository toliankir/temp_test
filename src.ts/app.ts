import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server v0.0.7');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});