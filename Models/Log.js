const typeorm_1 = require("typeorm");
let Log = exports.Log = class Log {
    id;
    date;
    message;
    extra;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Log.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: false }),
    __metadata("design:type", Date)
], Log.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Log.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "extra", void 0);
exports.Log = Log = __decorate([
    (0, typeorm_1.Entity)("log")
], Log);
//# sourceMappingURL=Log.js.map