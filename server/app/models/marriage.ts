import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Member from '#models/member'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Marriage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'member_id' })
  declare memberId: number

  @column({ columnName: 'spouse_id' })
  declare spouseId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Member, {
    foreignKey: 'memberId',
  })
  declare member: BelongsTo<typeof Member>

  @belongsTo(() => Member, {
    foreignKey: 'spouseId',
  })
  declare spouse: BelongsTo<typeof Member>
}
