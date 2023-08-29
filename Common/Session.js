"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../Models/User");
const Models_1 = require("../Models");
class SessionManager {
    static sessions;
    static userRepository;
    static sessionSecret;
    static initialize(sessionSecret) {
        SessionManager.sessionSecret = sessionSecret;
        SessionManager.sessions = new Map();
        SessionManager.userRepository = Models_1.AppDataSources.getRepository(User_1.User);
        ;
    }
    static generateSessionId(user) {
        const sessionId = crypto_1.default.randomBytes(32).toString("hex");
        const token = jsonwebtoken_1.default.sign({ userId: user.id, sessionId }, SessionManager.sessionSecret, { expiresIn: "1h" });
        SessionManager.sessions.set(sessionId, token);
        return sessionId;
    }
    static async getUser(sessionId) {
        try {
            const payload = jsonwebtoken_1.default.verify(SessionManager.sessions.get(sessionId), SessionManager.sessionSecret);
            if (payload.sessionId !== sessionId) {
                SessionManager.sessions.delete(sessionId);
                return null;
            }
            return await SessionManager.userRepository.findOne({ where: { id: payload.userId } });
        }
        catch {
            SessionManager.sessions.delete(sessionId);
            return null;
        }
    }
    static revokeSession(sessionId) {
        SessionManager.sessions.delete(sessionId);
    }
}
exports.SessionManager = SessionManager;
//# sourceMappingURL=Session.js.map