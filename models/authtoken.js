'use strict';
module.exports = (sequelize, DataTypes) => {
    const AuthToken = sequelize.define('AuthToken', {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    AuthToken.associate = function(models) {
        AuthToken.associate = function({ User }) {
            AuthToken.belongsTo(User)
        }
        AuthToken.generate = async function(UserId) {
            if (!UserId) {
                throw new Error('Authtoken requires User Id')
            }
            let token = ''
            const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz';
            for (var i = 0; i < 15; i++) {
                token += possibleCharacters.charAt(
                    Math.floor(Math.random() * possibleCharacters.length)
                )
            }
            return AuthToken.create({ token, UserId })
        }
    };
    return AuthToken;
};