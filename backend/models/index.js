import sequelize from './db.js'
import Utente from './userModel.js'
import Sketch from './sketchModel.js'
import Tentativo from './guessModel.js'

Utente.hasMany(Sketch, {
  as: 'sketchCreati',
  foreignKey: { name: 'autoreId', allowNull: false },
  onDelete: 'CASCADE',
})
Sketch.belongsTo(Utente, {
  as: 'autore',
  foreignKey: { name: 'autoreId', allowNull: false },
})

Utente.belongsToMany(Sketch, {
  through: Tentativo,
  as: 'sketchGiocati',
  foreignKey: 'utenteId',
  otherKey: 'sketchId',
})
Sketch.belongsToMany(Utente, {
  through: Tentativo,
  as: 'giocatori',
  foreignKey: 'sketchId',
  otherKey: 'utenteId',
})

Sketch.hasMany(Tentativo, { foreignKey: 'sketchId', as: 'tentativi' })
Tentativo.belongsTo(Sketch, { foreignKey: 'sketchId', as: 'sketch' })
Utente.hasMany(Tentativo, { foreignKey: 'utenteId', as: 'tentativi' })
Tentativo.belongsTo(Utente, { foreignKey: 'utenteId', as: 'utente' })

export { sequelize, Utente, Sketch, Tentativo }
