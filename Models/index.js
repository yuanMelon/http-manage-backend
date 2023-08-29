const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Log_1 = require("./Log");
const entities = [User_1.User, Log_1.Log];
let initialized = false;
const initialize = async config => {
    if (initialized) {
        throw new Error("Database already initialized");
    }
    initialized = true;
    exports.AppDataSources = new typeorm_1.DataSource({
        ...config,
        entities,
        synchronize: true,
        logging: process.env.NODE_ENV !== "production",
        charset: "utf8mb4",
    });
    await exports.AppDataSources.initialize();
};
exports.initialize = initialize;
//# sourceMappingURL=index.js.map
