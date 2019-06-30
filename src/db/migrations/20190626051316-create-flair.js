module.exports = {
    up: () => {

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Flairs');
    }
}