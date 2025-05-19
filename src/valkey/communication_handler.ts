import Valkey from 'iovalkey'
import CharInfo from '../network/incoming/game/CharInfo'

import L2Mob from '../entities/L2Mob'
import L2Creature from '../entities/L2Creature'
import L2Character from '../entities/L2Character'
import L2User from '../entities/L2User'
import Client from '../Client'

const client = new Valkey()


export class Vk {
  static  client: Valkey | null = null;

  static setClient (instance: Valkey) {
    Vk.client = instance;
  }

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

  static handleUser (objId: number, char: L2User, activeCharacter: string) {
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
    // Vk.publish(id, hash, 'me', activeCharacter)
  }

  handlePartyMember (character: any) {

  }

  static handleChat (message: ChatMessage) {
    Vk.client?.publish('chat', message.objectId.toString())
    Vk.client?.hset(message.objectId.toString(), message)
    Vk.client?.expire(message.objectId.toString(), 30 * 60)
  }

  static publish (id: number, hash: {}, type: string, character: string) {
    const hId = `${type}:${id}:${character}`

    Vk.client?.publish('environment', `new:${hId}`)
    Vk.client?.hset(hId, hash)
  }
}


class ValkeyClient {
  vk: Valkey
  l2Clients: Client[]

  constructor (l2Client: Client) {
    this.vk = new Valkey(6379, "127.0.0.1")
    this.l2Clients = [l2Client]

    client.subscribe('commands')
    Vk.setClient(this.vk)
  }

  listen () {
    client.on('message', (channel, message) => {
      if (channel == 'commands') {
        this.handleCommand(message)
      }
      }
    )
  }

  handleCommand (command: string) {
    console.log(`Comando recibido en el canal "commands": `, command)
  }
}


interface ChatMessage {
  objectId: number;
  type: number;
  charName: string;
  npcStringId: number;
  messages: string[];
}

