const Error_1 = require("../../Common/Error");
const User_1 = require("../../Models/User");
const DataSources_1 = require("./DataSources");

exports.editpassHandler = (0, Error_1.errorHandler)(async (req, res) => {
  const { id, newpassword } = req.body;

  try {
    const userRepository = (0, DataSources_1.getUserRepository)(); // 获取用户存储库

    const user = await userRepository.findOne({ where: { id } }); // 根据 ID 查询用户

    if (user) {
      // 更新密码
      user.password = newpassword;

      // 保存更新后的用户数据
      await userRepository.save(user);

      res.send('Password updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
