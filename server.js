import pg from "pg";
import express from "express";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("static"));

const pool = new pg.Pool({
  database: "ppl",
});

//ppl
app.get("/ppl", (req, res) => {
  pool.query(`SELECT * FROM ppl`).then((data) => {
    res.send(data.rows);
  });
});

//All exercises
app.get("/ppl/exercises", (req, res) => {
  pool.query(`Select * FROM exercises`).then((data) => {
    res.send(data.rows);
  });
});

//Push/Pull/Leg exercises
app.get("/ppl/exercises/:pplId", (req, res) => {
  console.log(req.params.pplId);
  let pplId = req.params.pplId;
  if (pplId === "push") pplId = 1;
  else if (pplId === "pull") pplId = 2;
  else if (pplId === "legs") pplId = 3;
  else if (pplId !== "legs" || pplId !== "pull" || pplId !== "push") {
    res.statusCode(404);
  }
  pool
    .query(`SELECT * FROM exercises WHERE ppl_id = $1`, [pplId])
    .then((data) => {
      res.send(data.rows);
    });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`Server is up on running on port ${port}`);
});
