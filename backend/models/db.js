import { Sequelize, Transaction } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logging: false,
  transactionType: Transaction.TYPES.IMMEDIATE,
})

const getConnection = sequelize.connectionManager.getConnection.bind(sequelize.connectionManager)
sequelize.connectionManager.getConnection = async (options) => {
  const connection = await getConnection(options)
  connection.configure('busyTimeout', 5000)
  return connection
}

export default sequelize
