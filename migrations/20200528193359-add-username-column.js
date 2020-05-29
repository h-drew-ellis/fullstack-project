'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Friends',
            'username', Sequelize.STRING, )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Friends', 'username')
    }
};