const Error_1 = require("../../Common/Error");
const Session_1 = require("../../Common/Session");
const bcrypt_1 = __importDefault(require("bcrypt"));
const DataSources_1 = require("./DataSources");
exports.signinHandler = (0, Error_1.errorHandler)(async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        throw new Error_1.AppError(400, "Username is required");
    }
    if (!password) {
        throw new Error_1.AppError(400, "Password is required");
    }
    const user = await (0, DataSources_1.getUserRepository)().findOne({ where: { username } });
    if (!user) {
        throw new Error_1.AppError(404, "User not found");
    }
    const result = await bcrypt_1.default.compare(password, user.password);
    if (!result) {
        throw new Error_1.AppError(401, "Incorrect password");
    }
    const sessionId = Session_1.SessionManager.generateSessionId(user);
    res.send({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
        },
        sessionId,
    });
});
exports.signoutHandler = (0, Error_1.errorHandler)(async (req, res) => {
    const { token } = req.query;
    if (!token) {
        throw new Error_1.AppError(400, "Token is required");
    }
    if (typeof token !== "string") {
        throw new Error_1.AppError(400, "Token must be a string");
    }
    Session_1.SessionManager.revokeSession(token);
    res.send({});
});
//# sourceMappingURL=Sign.js.map