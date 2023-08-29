const Sign_1 = require("../User/Sign");
const Detail_1 = require("../User/Detail");
const Register_1 = require("../User/Register");
const Editpassword_1 = require("../User/Editpassword")
const Reset_1 = require("../User/Reset");
const userRouteWrapper = (app) => {
    app.get("/user/current", Detail_1.currentUserHandler);
    app.post("/user/login", Sign_1.signinHandler);
    app.post("/user/logout", Sign_1.signoutHandler);
    app.post("/user/create", Register_1.registerHandler);
    app.put("/user/editpass",Editpassword_1.editpassHandler);
    app.put("/user/reset",Reset_1.resetHandler);
};
exports.userRouteWrapper = userRouteWrapper;
//# sourceMappingURL=User.js.map