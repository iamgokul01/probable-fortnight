
const express = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let db = null;
let path = require("path");
let dbPath = path.join(__dirname, "/todoApplication.db");
const initDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("Server-Started");
  });
};

initDbAndServer();

app.get("/check/", async (request, response) => {
  let query = `select * from todo`;
  let res = await db.all(query);
  response.send(res);
});

app.get("/todos/", async (request, response) => {
  let { status, search_q, priority } = request.query;
  let queryToExecute = null;
  const hasStatus = () => status !== undefined;
  const hasPriority = () => priority !== undefined;
  const hasStatusAndPriority = () =>
    status !== undefined && priority !== undefined;
  const hasSearch = () => search_q !== undefined;

  if (hasSearch()) {
    queryToExecute = `select * from todo where todo like '%${search_q}%';`;
  }
  let res = await db.all(queryToExecute);
  response.send(res);
});
