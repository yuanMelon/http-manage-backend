const User_1 = require("./User");
const routeWrappers = [
    User_1.userRouteWrapper,
];
const routeWrapper = (app) => {
    routeWrappers.forEach((wrapper) => wrapper(app));
};
exports.routeWrapper = routeWrapper;
//# sourceMappingURL=index.js.map