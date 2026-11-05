import { DataTypes } from 'sequelize'
import sequelize from './db.js'

const Sketch = sequelize.define('Sketch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parola: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  disegno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'sketch',
  timestamps: false,
})

export default Sketch
