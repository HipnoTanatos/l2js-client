import Valkey from 'iovalkey'

import L2Creature from '../entities/L2Creature'
import L2Character from '../entities/L2Character'
import L2User from '../entities/L2User'
import Client from '../Client'


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
    Vk.publishEnvironment(id, hash, entityType, activeCharacter)
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
    Vk.publishEnvironment(id, hash, 'character', activeCharacter)
  }

  static handleUser (objId: number, char: L2User, activeCharacter: string) {
    const id = objId
    const hash = {
      // object attributes
      id: 0,  // Users have no id?
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
    Vk.publishEnvironment(id, hash, 'active', activeCharacter)
  }

  handlePartyMember (character: any) {

  }

  static handleChat (message: ChatMessage) {
    Vk.client?.publish('chat', message.objectId.toString())
    Vk.client?.hset(message.objectId.toString(), message)
    Vk.client?.expire(message.objectId.toString(), 30 * 60)
  }

  static publishEnvironment (id: number, hash: {},
                             type: string, character: string) {
    const channel = 'environment'
    const operation = 'add'
    const hId = `${character}:${type}:${id}`

    Vk.client?.publish(channel, `${operation}:${hId}`)
    Vk.client?.hset(hId, hash)
  }

  static async deleteObject (objectId: number, character: string) {
    const channel = 'environment'
    const operation = 'rm'
    const [cursor, hId_list] = await Vk.client!.scan(0, 'MATCH', `*${objectId}*`,
                                                        'COUNT', 1000);
    const hId = hId_list.filter(s => s.includes(character))
    console.log(`trying to delete: ${objectId}, ${hId}`)

    if (hId?.length) {
      Vk.client?.publish(channel, `${operation}:${hId[0]}`)
      Vk.client?.del(hId)
    }
  }
}


export class ValkeyClient {
  vkListerner: Valkey
  vkPublisher: Valkey
  l2Clients: Client[]  

  constructor (l2Client: Client) {
    this.vkListerner = new Valkey(6379, "127.0.0.1")
    this.vkPublisher = new Valkey(6379, "127.0.0.1")
    this.l2Clients = [l2Client]

    this.vkListerner.subscribe('commands')
    Vk.setClient(this.vkPublisher)
  }

  listen () {
    this.vkListerner.on('message', (channel, message) => {
      if (channel == 'commands') {
        this.handleCommand(message)
      }
      }
    )
  }

  handleCommand (command: string) {
    const [character, receivedCommand, params] = command.split(':')
    const handler = CommandHandlers[receivedCommand]

    if (!handler) {
      console.warn(`Comando no reconocido: ${receivedCommand}`)
      return
    }

    for (const client of this.l2Clients){
      if (client.Me.Name === character) {
        handler(client, params)
        break
      }
    }
  }
}


interface ChatMessage {
  objectId: number;
  type: number;
  charName: string;
  npcStringId: number;
  messages: string[];
}

type CommandHandler = (client: Client, params: string) => void;

const CommandHandlers: Record<string, CommandHandler> = {
  say: (client, params) => {
    client.say(params);
  },

  whisp: (client, params) => {
    const [message, target] = params.split(',')
    client.tell(message, target)
  },

  hit: (client, params) => {
    console.log(params)
    const [target, shift] = params.split(',')
    client.hit(parseInt(target, 10),
                  shift.toLowerCase() === 'true')
  },

  attack: (client, params) => {
    const [target, shift] = params.split(',')
    client.attack(parseInt(target, 10),
                  shift.toLowerCase() === 'true')
  },

  moveTo: (client, params) => {
    const [x, y, z] = params.split(',')
    client.moveTo(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10))
  },

  autoshots: (client, params) => {
    const [soulshots, toggle] = params.split(',')
    client.autoShots(parseInt(soulshots, 10),
                     toggle.toLowerCase() === 'true')
  },

  cast: (client, params) => {
    const [skill, force = 'false', shift = 'false'] = params.split(',')
    client.cast(parseInt(skill, 10),
                force.toLowerCase() === 'true',
                shift.toLowerCase() === 'true')
  },

  sit_stand: (client, params) => {
    client.sitOrStand()
    // TODO: not working
  },
}
