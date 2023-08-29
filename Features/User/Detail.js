const Error_1 = require("../../Common/Error");
const Session_1 = require("../../Common/Session");
exports.currentUserHandler = (0, Error_1.errorHandler)(async (req, res) => {
    const { token } = req.query;
    if (!token) {
        throw new Error_1.AppError(400, "Token is required");
    }
    if (typeof token !== "string") {
        throw new Error_1.AppError(400, "Token must be a string");
    }
    const user = await Session_1.SessionManager.getUser(token);
    if (!user) {
        throw new Error_1.AppError(401, "Invalid token");
    }
    res.send({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            team: user.team,
        },
    });
});
//# sourceMappingURL=Detail.js.map