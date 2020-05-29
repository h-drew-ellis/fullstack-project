'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'watchlists',
            'gameId',
            Sequelize.INTEGER
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'watchlists',
            'gameId'
        );
    }
};