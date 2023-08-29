const Models_1 = require("../../Models");
const User_1 = require("../../Models/User");
const getUserRepository = () => Models_1.AppDataSources.getRepository(User_1.User);
exports.getUserRepository = getUserRepository;
//# sourceMappingURL=DataSources.js.map