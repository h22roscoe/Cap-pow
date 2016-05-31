var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    "use strict";

    var User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
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

    User.beforeCreate(function (user) {
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(8),
            null
        );
    });

    return User;
};
