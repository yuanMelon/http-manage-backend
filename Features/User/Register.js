const Error_1 = require("../../Common/Error");
const Session_1 = require("../../Common/Session");
const User_1 = require("../../Models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const DataSources_1 = require("./DataSources");
exports.registerHandler = (0, Error_1.errorHandler)(async (req, res) => {
    const { username, password, email } = req.body;
    if (!username) {
        throw new Error_1.AppError(400, "Username is required");
    }
    if (!password) {
        throw new Error_1.AppError(400, "Password is required");
    }
    if (!email) {
        throw new Error_1.AppError(400, "Email is required");
    }
    if (typeof username !== "string") {
        throw new Error_1.AppError(400, "Username must be a string");
    }
    if (typeof password !== "string") {
        throw new Error_1.AppError(400, "Password must be a string");
    }
    if (typeof email !== "string") {
        throw new Error_1.AppError(400, "Email must be a string");
    }
    const user = new User_1.User();
    user.username = username;
    user.email = email;
    user.password = await bcrypt_1.default.hash(password, 10);
    await (0, DataSources_1.getUserRepository)().save(user);
    const sessionId = Session_1.SessionManager.generateSessionId(user);
    res.send({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            team:user.team,
        },
        sessionId,
    });
});
//# sourceMappingURL=Register.js.map