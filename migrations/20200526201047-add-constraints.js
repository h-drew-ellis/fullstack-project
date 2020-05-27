'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addConstraint(
            'Users', ['username'], {
                type: Sequelize.string,
                unique: true,
                allowNull: false
            }, ['password'], {
                type: Sequelize.string,
                allowNull: false
            }, ['first'], {
                type: Sequelize.string,
                allowNull: true
            }, ['last'], {
                type: Sequelize.string,
                allowNull: true
            }, ['email'], {
                type: Sequelize.string,
                unique: true,
                isEmail: true,
                allowNull: false
            }
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeConstraint(
            'Users', ['username'], {
                unique: true,
                allowNull: false
            }, ['password'], {
                allowNull: false
            }, ['first'], {
                allowNull: true
            }, ['last'], {
                allowNull: true
            }, ['email'], {
                unique: true,
                isEmail: true,
                allowNull: false
            }
        )
    }
};