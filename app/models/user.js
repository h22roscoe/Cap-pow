// Load the things we need
var bcrypt = require("bcrypt-nodejs");
var configDB = require("../../config/database");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(configDB.url);

function user(sequelize, DataTypes) {
    var User = sequelize.define('User', {
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
            validPassword: function (password, passwd, done, user) {
                bcrypt.compare(password, passwd, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
            }
        },
        hooks: {
            beforeCreate: function (user, fn) {
                user.password = bcrypt.hashSync(user.password,
                                             bcrypt.genSaltSync(8),
                                             null);
                return fn(null, user);
            }
        }
    }, {
        dialect: 'postgres'
    });

    return User;
}

module.exports = user;
