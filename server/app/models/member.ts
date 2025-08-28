import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Child from './child.js'
import Marriage from './marriage.js'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare firstName: string

  @column()
  declare middleNames: string | null

  @column()
  declare lastName: string

  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare description: string | null

  // Marriages where this member is involved
  @hasMany(() => Marriage, {
    foreignKey: 'memberId',
  })
  declare marriages: HasMany<typeof Marriage>

  // Children of this member
  @hasMany(() => Child, {
    foreignKey: 'parentId',
  })
  declare parentRelationships: HasMany<typeof Child>

  // This member as a child
  @hasMany(() => Child, {
    foreignKey: 'childId',
  })
  declare childRelationships: HasMany<typeof Child>
}
