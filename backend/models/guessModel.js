import { DataTypes } from 'sequelize'
import sequelize from './db.js'

const Tentativo = sequelize.define('Tentativo', {
  parole: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  indovinato: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'tentativi',
  timestamps: false,
})

export default Tentativo
