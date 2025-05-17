import Valkey from 'iovalkey'
import CharInfo from '../network/incoming/game/CharInfo'

import L2Mob from '../entities/L2Mob'
import L2Creature from '../entities/L2Creature'

const client = new Valkey()


export class Vk {
  activeCharacter: string

  constructor (session: any) {
    this.activeCharacter = session
  }

  static charMutator (packet: any): void {

    console.log(packet)
  }
  
  static checkObject () {

  }



  handleNPC (NPC) {

  }

  static handleMob (objId: number, mob: L2Creature, activeCharacter: string) {
    const entityType = mob.IsAttackable ? "mob" : "npc"
    const id = objId
    const hash = {
      // object attributes
      id: mob.Id,
      object_id: mob.ObjectId,
      name: mob.Name,

      pos_x: mob.X,
      pos_y: mob.Y,
      pos_z: mob.Z,
      pos_distance: mob.Distance,

      // entitie attributes
      hp: mob.Hp,
      mp: mob.Mp,
      max_hp: mob.MaxHp,
      max_mp: mob.MaxMp,

      is_dead: mob.IsDead,
      is_attackable: mob.IsAttackable,
      is_targetable: mob.IsTargetable,

      class_id: mob.ClassId,
      class_name: mob.ClassName,

      // mob attributes
      // unimplemented?
      is_spoiled: " ",
    }
    Vk.publish(id, hash, entityType, activeCharacter)
  }

  handleCharacter (character) {

  }

  handleUser (character) {

  }

  handlePartyMember (character) {

  }

  static publish (id: number, hash: {}, type: string, character: string) {
    const hId = `${type}:${id}:${character}`

    client.publish('environment', `new:${hId}`)
    client.hset(hId, hash)
  }
}


