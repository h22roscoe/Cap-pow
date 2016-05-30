var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    "use strict";

    var User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    }, {
        classMethods: {
            validPassword: function (password, dbpassword) {
                return bcrypt.compareSync(password, dbpassword);
            }
        },
        dialect: "postgres",
        freezeTableName: true
    });

    User.beforeCreate(function (user, options) {
        var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
        user.password = hash;
    });

    return User;
};
