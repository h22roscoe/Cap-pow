var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
    "use strict"

    var Room = sequelize.define("room", {
        id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        players: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        winPoints: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                Room.hasMany(models.users);
            },
            validPassword: function(password, dbpassword) {
                if (dbpassword) {
                    return bcrypt.compareSync(password, dbpassword);
                } else {
                    return true;
                }
            }
        },
        dialect: "postgres",
        freezeTableName: true
    });

    Room.beforeCreate(function(room) {
        if (room.password) {
            room.password = bcrypt.hashSync(room.password,
                bcrypt.genSaltSync(8),
                null
            );
        }
    });

    return Room;
}
