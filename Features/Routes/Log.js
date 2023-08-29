const Log_1 = require("../Log/fonction");

const LogRouteWrapper = (app) => {
    app.post("/log/rollback", Log_1.rollbackHandler);
    app.get("/log/list", Log_1.getlistHandler);
    app.get("/log/details", Log_1.getdetailsHandler);
    app.post("/log/close",Log_1.closeHandler)
};
exports.LogRouteWrapper = LogRouteWrapper;
