import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'

export default class MembersController {
  /**
   * Get a member by ID
   */
  async show({ params }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    return member
  }

  /**
   * Get all members
   */
  async index() {
    const members = await Member.all()
    return members
  }

  /**
   * Create a new member
   */
  async store({ request }: HttpContext) {
    const data = request.only([
      'firstName',
      'middleNames',
      'lastName',
      'dateOfBirth',
      'description',
      'name',
      'extra',
      'textClass',
      'class',
      'marriages',
    ])

    const member = await Member.create(data)
    return member
  }

  /**
   * Update an existing member
   */
  async update({ params, request }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    const data = request.only([
      'firstName',
      'middleNames',
      'lastName',
      'dateOfBirth',
      'description',
      'name',
      'extra',
      'textClass',
      'class',
      'marriages',
    ])

    member.merge(data)
    await member.save()

    return member
  }

  /**
   * Delete a member
   */
  async destroy({ params }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    await member.delete()
    return { message: 'Member deleted successfully' }
  }
}
