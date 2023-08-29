const express = require("express");
const mysql = require("mysql");
//创建路由对象
const router = express.Router();

// const db = require('../model/interfaceModel')
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "654321",
  database: "mysql2",
  port: "3306",
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to database successfully!");
  }
});
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// 创建和保存接口
router.post("/create", (req, res) => {
  const data = req.query;
  const sql = `INSERT INTO saveinterfaces (path, title, uid, pid, c_time, u_time, status, desc, req_params, req_query, req_body_from, res_body, res_body_type, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    data.path,
    data.title,
    data.uid,
    data.pid,
    data.c_time,
    data.u_time,
    data.status,
    data.desc,
    data.req_params,
    data.req_query,
    data.req_body_from,
    data.res_body,
    data.res_body_type,
    data.method,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ message: "创建接口失败" });
    } else {
      console.log(results);
      res.json({ message: "创建接口成功" });
    }
  });
});
// 删除接口
router.get("/delinterface", (req, res) => {
  const path = req.query.path;
  const uid = req.query.uid;
  const sql = `DELETE FROM saveinterfaces WHERE path = '${path}' AND uid = ${uid}`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ message: "删除接口失败" });
    } else {
      console.log(results);
      res.json({ message: "删除接口成功" });
    }
  });
});
// 查询接口
router.get("/getInterface", (req, res) => {
  const path = req.query.path;
  const uid = req.query.uid;
  const sql = `SELECT * FROM saveinterfaces WHERE path = '${path}' AND uid = ${uid}`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ message: "查询接口失败" });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});
// 查看接口列表
router.get("/exportjson", (req, res) => {
  const pid = req.query.pid;
  const sql = `SELECT * FROM saveinterfaces WHERE pid = '${pid}'`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ message: "获取接口列表失败" });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});
// 修改接口
router.put("/updateInterface", (req, res) => {
  const data = req.query;
  const path = req.query.path;
  const uid = req.query.uid;
  const sql = `UPDATE saveinterfaces SET path=?, uid=?, title=?, pid=?, c_time=?, u_time=?, status=?, desc=?, req_params=?, method=?, res_body_type=?, res_body=?, req_body_from=?, req_query=? WHERE path = '${path}' AND uid = '${uid}'`;
  const values = [
    path,
    data.uid,
    data.title,
    data.pid,
    data.c_time,
    data.u_time,
    data.status,
    data.desc,
    data.req_params,
    data.method,
    data.res_body_type,
    data.res_body,
    data.req_body_from,
    data.req_query,
    path,
    uid,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ message: "修改接口失败", path, uid });
    } else {
      console.log(results);
      res.json({ message: "修改接口成功" });
    }
  });
});

module.exports = router;
