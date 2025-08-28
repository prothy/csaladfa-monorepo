import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Member from '#models/member'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Child extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number

  @column()
  declare childId: number

  @column()
  declare marriageId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Member, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Member>

  @belongsTo(() => Member, {
    foreignKey: 'childId',
  })
  declare child: BelongsTo<typeof Member>
}
