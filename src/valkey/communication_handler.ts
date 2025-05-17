import Valkey from 'iovalkey'
import CharInfo from '../network/incoming/game/CharInfo'

import L2Mob from '../entities/L2Mob'
import L2Creature from '../entities/L2Creature'
import L2Character from '../entities/L2Character'

const client = new Valkey()


export class Vk {
  static charMutator (packet: any): void {
    // console.log(packet)
  }
  
  static checkObject () {
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

  static handleCharacter (objId: number, char: L2Character, activeCharacter: string) {
    const id = objId
    const hash = {
      // object attributes
      id: char.Id,
      object_id: char.ObjectId,
      name: char.Name,

      pos_x: char.X,
      pos_y: char.Y,
      pos_z: char.Z,
      pos_distance: char.Distance,

      // entitie attributes
      hp: char.Hp,
      mp: char.Mp,
      cp: char.Cp,
      max_hp: char.MaxHp,
      max_mp: char.MaxMp,
      max_cp: char.MaxCp,
      level: char.Level,

      is_dead: char.IsDead,
      is_attackable: char.IsAttackable,
      is_targetable: char.IsTargetable,
      is_party_member: char.IsPartyMember,

      class_id: char.ClassId,
      class_name: char.ClassName,
    }
    Vk.publish(id, hash, 'character', activeCharacter)
  }

  handleUser (character: any) {

  }

  handlePartyMember (character: any) {

  }

  static publish (id: number, hash: {}, type: string, character: string) {
    const hId = `${type}:${id}:${character}`

    client.publish('environment', `new:${hId}`)
    client.hset(hId, hash)
  }
}


