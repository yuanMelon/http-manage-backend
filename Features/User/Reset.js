const Error_1 = require("../../Common/Error");
const User_1 = require("../../Models/User");
const DataSources_1 = require("./DataSources");

  exports.resetHandler = (0, Error_1.errorHandler)(async (req, res) => {
    const { username,email,team } = req.body;
  
    try {
      const userRepository = (0, DataSources_1.getUserRepository)(); // 获取用户存储库
  
      const user = await userRepository.findOne({ where: { username } }); // 根据 username 查询用户
  
      if (user) {
        // 修改信息
        user.username = username;
        user.email = email;
        user.team = team;
  
        // 保存更新后的用户数据
        await userRepository.save(user);
  
        res.send('Information updated successfully');
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });