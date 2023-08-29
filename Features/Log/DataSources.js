const Models_1 = require("../../Models");
const Log_1 = require("../../Models/Log");
const getLogRepository = () => Models_1.AppDataSources.getRepository(Log_1.Log);
exports.getLogRepository = getLogRepository;