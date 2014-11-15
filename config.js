var config = {
    jwt_secret: process.env.JWT_SECRET,
    ws_port: process.env.PORT
};

module.exports.getConfig = function () {
    return config;
};
