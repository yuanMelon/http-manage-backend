// // 引入MySQL模块
// const mysql = require('mysql');

// // 创建数据库连接
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '244013',
//   database: 'log_database'
// });
// // 连接数据库
// connection.connect((err) => {
//   if (err) {
//     console.error('连接数据库出错：', err);
//   } else {
//     console.log('成功连接到数据库');
//   }
// });

// // 回滚日志
// function rollbackLog(logId) {
//   return new Promise((resolve, reject) => {
//     const sql = `DELETE FROM logs WHERE id = ${logId}`;

//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.error('回滚日志出错：', err);
//         reject(err);
//       } else {
//         resolve(result.affectedRows);
//       }
//     });
//   });
// }

// // 查看日志列表
// function getLogList() {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM logs';

//     connection.query(sql, (err, results) => {
//       if (err) {
//         console.error('获取日志列表出错：', err);
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

// // 查看日志详情
// function getLogDetails(logId) {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT * FROM logs WHERE id = ${logId}`;

//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.error('获取日志详情出错：', err);
//         reject(err);
//       } else {
//         if (result.length === 0) {
//           resolve(null);
//         } else {
//           resolve(result[0]);
//         }
//       }
//     });
//   });
// }


// // 断开数据库连接
// function closeConnection() {
//   connection.end((err) => {
//     if (err) {
//       console.error('断开数据库连接出错：', err);
//     } else {
//       console.log('成功断开数据库连接');
//     }
//   });
// }

// // 导出模块方法
// module.exports = {
//   rollbackLog,
//   getLogList,
//   getLogDetails,
//   closeConnection
// };