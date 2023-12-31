// const Op = require('@sequelize/core')
var interfaces = require('../model/interfaceModel')
var group = require('../model/groupModel')
var projectChild = require('../model/projectGroupModel')
import { user} from "../Features/User/DataSources";
// var user = require('../util/User')
var blue = require('bluebird')
var fs = require('fs')
var e = require('../util/error.json')
var util = require('../util/util')
var uuid = require('uuid')
var mysql2 = require('mysql2')
const { log } = require('console')
const sequelize = require('../util/db')
const { request } = require('http')
const { Sequelize, JSON } = require('sequelize')
const {Op,fn,literal} = require('sequelize')
blue.promisifyAll(fs)

class Project {
  constructor() {

    //----------------------------------------------
    // 创建小组
    this.create = async (req, res) => {
      try {
        const groups = await group.findAll();
        const nameList = groups.map(p => p.name);
        console.log(nameList);
        exist = false;
        for (var n of nameList) {
          if (n === req.clientParam.name) {
            exist = true;
          }
        }
        if (exist) {
          util.throw(e.duplicateName, "用户名重复");
        }

        const maxGid = await group.max("gid");
        // const maxGid = 1004
        let query = {
          gid: maxGid + 1,
          name: req.clientParam.name,
          users: [{ "id": parseInt(req.clientParam.uid), "role": "owner" }]
        };
        if (req.clientParam.dis) {
          query.dis = req.clientParam.dis;
        }
        if (req.clientParam.baseUrl) {
          query.baseUrl = req.clientParam.baseUrl;
        }
        console.log(query);
        await (group.create(query));
        util.ok(res, "添加成功");
        console.log('This is query:', query);
      }
      catch (err) {
        util.catch(res, err);
        // console.log(err);
      }
    };

    // 修改小组
    this.edit = async (req, res) => {
      try {
        const groups = await group.findAll({
          where: {
            gid: { [Sequelize.Op.not]: parseInt(req.clientParam.gid) }
          }
        });
        const nameList = groups.map(p => p.name);
        // console.log(nameList);
        exist = false;
        for (var n of nameList) {
          if (n === req.clientParam.name) {
            exist = true;
          }
        }
        if (exist) {
          util.throw(e.duplicateName, "用户名重复");
        }

        let query = {
          name: req.clientParam.name,
        };
        if (req.clientParam.dis) {
          query.dis = req.clientParam.dis;
        }
        if (req.clientParam.baseUrl) {
          query.baseUrl = req.clientParam.baseUrl;
        }
        let projectToChange = await group.update(query, {
          where: {
            gid: req.clientParam.gid
          }
        });
        util.ok(res, "修改成功");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 向项目中添加成员
    this.addMember = async (req, res) => {
      try {
        console.log('req', req.query.name);
        let u = await (user().findOne({
          where: {
            username: req.clientParam.name
          }
        }));
        // console.log(u.uid);
        // console.log('req.userInfo',req.query.uid);
        // console.log('obj.owner',obj);
        if (!u) {
          util.throw(e.userNotFound, "用户不存在");
        }
        else if (u.uid.toString() == req.clientParam.uid.toString()) {
          util.throw(e.userForbidden, "自己不能邀请自己");
        }
        const f = await group.findOne({
          where: {
            gid: req.clientParam.gid,
          }
        });
        // console.log(f.users);
        var userExist = false;
        for (var us of f.users) {
          // console.log(us);
          if (us.id == parseInt(req.clientParam.gid)) {
            userExist = true;
          }
        }
        if (userExist) {
          util.throw(e.existUserInTeam, "用户已经存在");
        }
        let thisUser = await user().findOne({
          where: {
            username: req.clientParam.name
          }
        });
        let query = {
          id: parseInt(thisUser.uid),
          role: req.clientParam.role
        };
        const currentUsers = f.users;
        currentUsers.push(query);
        //将 query 对象中的用户信息添加到指定的项目的用户列表中。
        await (group.update({
          users: currentUsers
        }, {
          where: {
            gid: req.clientParam.gid
          }
        }));
        util.ok(res, "添加成功");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 项目成员角色修改
    this.role = async (req, res) => {
      try {
        const userId = req.clientParam.uid;
        var usergroup = await group.findOne({
          where: {
            gid: req.clientParam.gid
          }
        });
        const user = usergroup.users.find(user => user.id === parseInt(userId));
        if (user.role === 'guest') {
          util.throw(e.userForbidden, '用户权限不足');
        }
        const updated = usergroup.users.map(user => {
          if (user.id === parseInt(req.clientParam.uid_c)) {
            user.role = req.clientParam.role;
          }
          return user;
        }
        );
        const newgroup = await group.findOne({
          where: {
            gid: req.clientParam.gid
          }
        });
        console.log(updated);
        await newgroup.update({ users: updated }, { fields: ['users'] });

        util.ok(res, "修改成功");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 获取项目成员角色
    this.getRole = async (req, res) => {
      try {
        const inGroup = await group.findOne({
          where: {
            name: req.query.name
          }
        });
        for (let i of inGroup.users) {
          if (i.id === parseInt(req.query.uid)) {
            var role = i.role;
          }
        }

        util.ok(res, role, "成功获取用户角色");
      }
      catch (err) {
        util.catch(res, err);
      }
    };


    // 移除项目成员
    this.removeMember = async (req, res) => {
      try {
        const userid = await user.findOne({
          where: {
            username: req.query.name
          }
        });
        var g = await group.findOne(
          {
            where: {
              gid: parseInt(req.clientParam.gid)
            }
          }
        );
        g.users = g.users.filter(user => parseInt(user.id) !== parseInt(userid.uid));
        await g.save();
        util.ok(res, "踢人成功");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    //获取项目列表
    this.list = async (req, res) => {
      try {
        const c = await group.findAll({
          where: {
            gid: req.query.gid
          }
        });
        if (c.length === 0) {
          util.throw(e.projectNotFound, "分组未找到");
        }
        var g = await projectChild.findAll({
          where: {
            'gid': req.query.gid
          }
        });
        if (!g) {
          util.throw(e.projectNotFound, '该分组还没有项目');
        }

        const data = [];
        for (let pro of g) {
          var interfaceNum = await interfaces.findAll({
            where: {
              pid: parseInt(pro.id)
            }
          });

          pro = pro.toJSON();
          pro.numInter = interfaceNum.length;
          pro.interfaces = [];
          for (var i of interfaceNum) {
            pro.interfaces.push({
              path: i.path,
              method: i.method
            });
          }
          data.push(pro);
        }
        util.ok(res, data, 'ok');
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    //添加项目
    this.addlist = async (req, res) => {
      try {
        const projects = await projectChild.findAll();
        const nameList = projects.map(p => p.name);
        console.log(nameList);
        exist = false;
        for (var n of nameList) {
          if (n === req.clientParam.name) {
            exist = true;
          }
        }
        if (exist) {
          util.throw(e.duplicateName, "用户名重复");
        }
        let query = {
          gid: parseInt(req.clientParam.gid),
          name: req.clientParam.name
        };
        if (req.clientParam.baseUrl) {
          query.baseUrl = req.clientParam.baseUrl;
        }
        if (req.clientParam.dis) {
          query.dis = req.clientParam.dis;
        }
        await (projectChild.create(query));
        // let result = await projectChild.findAll()
        util.ok(res, '创建项目成功');
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 删除项目
    this.clearList = async (req, res) => {
      try {
        var g = await projectChild.destroy({
          where: {
            gid: parseInt(req.query.gid),
            name: req.query.name
          }
        });
        if (g === 1) {
          util.ok(res, "删除成功");
        } else {
          util.throw(e.projectNotFound, '未找到符合条件的记录');
        }
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 验证用户是否在项目中
    this.inProject = async (req, res) => {
      try {
        req.interfaceModel = interfaces;
        req.groupModel = group;

        //使用项目ID查询数据库，查找满足以下条件之一的项目
        // a.项目的拥有者是当前用户
        // b.项目的用户列表包含当前用户
        let obj = await (group.findAll({
          where: {
            gid: req.query.gid
          },
          // attributes:['gid']
        }));
        // console.log(obj);
        if (obj.length === 0) {
          util.throw(e.projectNotFound, "项目不存在");
        }

        let obj2 = await (group.findOne(
          { gid: obj[0].dataValues.gid }
        ));
        // console.log(obj2.users);
        const userExist = obj2.users.filter(user => user.id === parseInt(req.query.uid));
        if (userExist.length === 0) {
          util.throw(e.userForbidden, "你没有权限");
        }
        req.obj = obj;
        req.userInfo = userExist;
        return true;
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 获取项目详细信息，并在存在版本信息时添加版本相关信息
    this.info = async (req, res) => {
      try {
        var groupInfo = [];
        let obj = await group.findAll();
        for (const groupname in obj) {
          const g = obj[groupname];
          if (!Array.isArray(g.users)) {
            g.users = [g.users];
          }
          if (g.users.some(user => user.id === parseInt(req.query.uid))) {
            groupInfo.push(g);
          }
        }

        util.ok(res, groupInfo, "ok");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 修改项目
    this.editProject = async (req, res) => {
      try {
        const projects = await projectChild.findAll({
          where: {
            id: { [Sequelize.Op.not]: parseInt(req.clientParam.id) }
          }
        });
        const nameList = projects.map(p => p.name);
        console.log(nameList);
        exist = false;
        for (var n of nameList) {
          if (n === req.clientParam.name) {
            exist = true;
          }
        }
        if (exist) {
          util.throw(e.duplicateName, "用户名重复");
        }
        query = {
          name: req.clientParam.name,
          gid: req.clientParam.gid
        };
        if (req.clientParam.baseUrl) {
          query.baseUrl = req.clientParam.baseUrl;
        }
        if (req.clientParam.dis) {
          query.dis = req.clientParam.dis;
        }
        const projectId = req.clientParam.id;
        await projectChild.update(query, {
          where: {
            id: parseInt(projectId)
          }
        });
        util.ok(res, "修改成功");
      }
      catch (err) {
        console.log(err);
        util.catch(res, err);
      }
    };

    // 处理项目删除
    this.clearProject = async (req, res) => {
      try {
        const pro = await group.findOne({
          where: {
            gid: req.query.gid
          }
        });
        if (!pro) {
          util.throw(e.projectNotFound, "项目不存在");
        }
        var isOwner = false;
        for (let i of pro.users) {
          if (i.id === parseInt(req.query.uid) && i.role === 'owner') {
            isOwner = true;
          }
        }
        if (!isOwner) {
          util.throw(e.userForbidden, "您不是项目组长，无法删除");
        }
        const inter = await interfaces.destroy({
          where: {
            gid: req.query.gid
          }
        });
        const proj_group = await projectChild.destroy({
          where: {
            gid: req.query.gid
          }
        });
        const gro = await group.destroy({
          where: {
            gid: req.query.gid
          }
        });


        util.ok(res, "删除成功");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

    // 用户退出项目 - 判断是否在项目里，判断是否是owner
    this.quit = async (req, res) => {
      try {
        let obj = await (group.findOne({
          where: {
            gid: req.query.gid
          }
        }));
        // console.log(obj.owner);
        var isOwner = false;
        for (var i of obj.users) {
          if (i.id === req.query.uid && isOwner.role === 'owner') {
            isOwner = true;
          }
        }
        if (isOwner) {
          // 当前用户为项目的拥有者
          util.throw(e.userForbidden, "创建的项目不能退出");
        }
        let index = -1;
        let obj2 = await (group.findOne({
          where: {
            gid: parseInt(obj.gid)
          }
        }));
        console.log('obj2', obj2.users);
        for (let i = 0; i < obj2.users.length; i++) {
          let u = obj2.users[i];
          console.log(u);
          if (u.id === parseInt(req.query.uid)) {
            index = i; // 找到当前用户的索引
            break;
          }
        }
        if (index == -1) {
          util.throw(e.projectNotFound, "你已经不在该项目里了");
        }
        else {
          this.removeMember(req, res);
          const groupNameToUpdate = parseInt(req.query.gid); // 要更新的组的 ID

          var g = await group.findOne(
            {
              where: {
                gid: groupNameToUpdate
              }
            }
          );
          g.users = g.users.filter(user => parseInt(user.id) !== parseInt(req.clientParam.uid));
          await g.save();
          util.ok(res, "退出成功");
        }
      }
      catch (err) {
        util.catch(res, err);
      }
    };


    // 设置项目成员
    // this.setUser=async (req,res)=> {
    //   try
    //   {
    //       let objUser=JSON.parse(req.query.user);
    //       for(let obj of objUser)
    //       {
    //           if(obj.user==req.obj.owner.toString())
    //           {
    //               util.throw(e.userForbidden,"用户列表里还有拥有者");
    //           }
    //       }
    //       req.obj.users=objUser;
    //       await (req.obj.save());
    //       util.ok(res,"ok");
    //   }
    //   catch (err)
    //   {
    //       util.catch(res,err);
    //   }
    // }
    // 获取项目的拥有者和其他成员列表 - 成功
    this.getUsers = async (req, res) => {
      try {
        var arr;
        var pro = await group.findOne({
          where: {
            gid: req.query.gid
          }
        });
        var exist = false;
        for (var i of pro.users) {
          console.log(typeof (i), i);
          if (i.id === parseInt(req.query.uid)) {
            arr = pro.users;
            exist = true;
            break;
          }
        }
        if (!exist) {
          util.throw(e.userNotInProject, "你不在该成员列表中");
        }
        for (const peruser of arr) {
          const foundUser = await user().findOne({
            where: {
              id: parseInt(peruser.id)
            }
          });
          if (foundUser) {
            peruser.name = foundUser.name;
          } else {
            peruser.name = 'Unknown user';
          }
        }
        util.ok(res, arr, "ok");
      }
      catch (err) {
        util.catch(res, err);
      }
    };

  }
}

module.exports = Project;