const express = require("express");
const cors = require('cors');
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors())
require('dotenv').config()


const mariadb = require("mariadb");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/auth");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_database,
  connectionLimit: 10,
});

const TOKEN_KEY = "node_allow_cors";

app.get("/register", async (req, res) => {
  const email = req.query.email || req.body.email;

  if (!email) res.status(400).json({ msg: "Email is required" });

  let conn;

  try {
    conn = await pool.getConnection();
    const data = await conn.query(`select email from tabUser where email='${email}'`)
    if(! data[0].email){
      const rows = await conn.query("insert into tabUser (email) values (?)", [
        email,
      ]);
    }
    
  } finally {
    if (conn) conn.release(); //release to pool
  }

  const token = jwt.sign({ email }, TOKEN_KEY, { expiresIn: "24h" });
  res.status(200).json({
    token,
  });
});

app.get("/api", verifyToken, async (req, res) => {
  const req_body = req.body;
  const req_query = req.query;
  let url = req_query.url || req_body.url;

  delete req_query.url;
  delete req_body.url;
  
  if (req_query) {
    console.log(new URL(url).searchParams)
    url += new URL(url).searchParams? "&": '?';
    for (const [key, value] of Object.entries(req_query)) {
      url += key.toString() + "=" + value +"&";
    }
  }
  
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select cookies from tabUser where email='${req.user.email}'`
    );
    console.log(url)
    console.log(rows)

    axios
      .get(url, {
        headers: {
          cookie: JSON.parse(rows[0].cookies),
        },
        params: req_body,
      })
      .then(async (result) => {
        const query = `update tabUser set cookies = '${JSON.stringify(
          result.headers.get("set-cookie")
        )}' where email = '${req.user.email}'`;

        await conn.query(query);

        res.status(result.status).json({
          ...result.data,
        });
      })
      .catch((err) => {
        res.status(403).json({
          ...err.response.data,
        });
      });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.post("/api", verifyToken, async (req, res) => {
  const req_body = req.body;
  const req_query = req.query;
  let url = req_query.url || req_body.url;

  delete req_query.url;
  delete req_body.url;

  if (req_query) {
    url += "?";
    for (const [key, value] of Object.entries(req_query)) {
      url += key.toString() + "=" + value + "&";
    }
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select cookies from tabUser where email='${req.user.email}'`
    );

    axios
      .get(url, {
        headers: {
          cookie: JSON.parse(rows[0].cookies),
        },
        params: req_body,
      })
      .then(async (result) => {
        const query = `update tabUser set cookies = '${JSON.stringify(
          result.headers.get("set-cookie")
        )}' where email = '${req.user.email}'`;

        await conn.query(query);

        res.status(result.status).json({
          ...result.data,
        });
      })
      .catch((err) => {
        res.status(403).json({
          ...err.response.data,
        });
      });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.put("/api", verifyToken, async (req, res) => {
  const req_body = req.body;
  const req_query = req.query;
  let url = req_query.url || req_body.url;

  delete req_query.url;
  delete req_body.url;

  if (req_query) {
    url += "?";
    for (const [key, value] of Object.entries(req_query)) {
      url += key.toString() + "=" + value + "&";
    }
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select cookies from tabUser where email='${req.user.email}'`
    );

    axios
      .get(url, {
        headers: {
          cookie: JSON.parse(rows[0].cookies),
        },
        params: req_body,
      })
      .then(async (result) => {
        const query = `update tabUser set cookies = '${JSON.stringify(
          result.headers.get("set-cookie")
        )}' where email = '${req.user.email}'`;

        await conn.query(query);

        res.status(result.status).json({
          ...result.data,
        });
      })
      .catch((err) => {
        res.status(403).json({
          ...err.response.data,
        });
      });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.delete("/api", verifyToken, async (req, res) => {
  const req_body = req.body;
  const req_query = req.query;
  let url = req_query.url || req_body.url;

  delete req_query.url;
  delete req_body.url;

  if (req_query) {
    url += "?";
    for (const [key, value] of Object.entries(req_query)) {
      url += key.toString() + "=" + value + "&";
    }
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select cookies from tabUser where email='${req.user.email}'`
    );

    axios
      .get(url, {
        headers: {
          cookie: JSON.parse(rows[0].cookies),
        },
        params: req_body,
      })
      .then(async (result) => {
        const query = `update tabUser set cookies = '${JSON.stringify(
          result.headers.get("set-cookie")
        )}' where email = '${req.user.email}'`;

        await conn.query(query);

        res.status(result.status).json({
          ...result.data,
        });
      })
      .catch((err) => {
        res.status(403).json({
          ...err.response.data,
        });
      });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});


app.listen(3000, () => console.log("App is listening on 3000 port"));
