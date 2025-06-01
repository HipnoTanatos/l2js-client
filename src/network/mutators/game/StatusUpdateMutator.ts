import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import StatusUpdate from "../../incoming/game/StatusUpdate";

import L2User from "../../../entities/L2User";
import {Vk} from "../../../valkey/communication_handler";
import L2Mob from "../../../entities/L2Mob";
import L2Character from "../../../entities/L2Character";
import L2Npc from "../../../entities/L2Npc";

export default class StatusUpdateMutator extends IMMOClientMutator<
  GameClient,
  StatusUpdate
> {
  update(packet: StatusUpdate): void {
    if (packet.ObjectId) {
      const char = this.Client.CreaturesList.getEntryByObjectId(
        packet.ObjectId
      );
      // ---
      let kind = ''
      if (char instanceof L2User) {
        kind = 'active'
      }
      else if (char instanceof L2Mob) {
        kind = 'mob'
      }
      else if (char instanceof L2Character) {
        kind = 'character'
      }
      else if (char instanceof L2Npc) {
        kind = 'npc'
      }
      const hashId = `${this.Client.ActiveChar.Name}:${kind}:${packet.ObjectId}`

      Object.keys(packet.Stats).forEach((key) => {
        const status: number = parseInt(key, 10);
        const value = packet.Stats[status];

        switch (status) {
          case StatusUpdate.LEVEL:
            if (char instanceof L2User) {
              char.Level = value;
              Vk.mutateValue(hashId, value, 'level')
            }
            break;
          case StatusUpdate.EXP:
            if (char instanceof L2User) {
              char.Exp = value;
              Vk.mutateValue(hashId, value, 'exp')
            }
            break;
          case StatusUpdate.STR:
            if (char instanceof L2User) {
              char.STR = value;
              Vk.mutateValue(hashId, value, 'str')
            }
            break;
          case StatusUpdate.DEX:
            if (char instanceof L2User) {
              char.DEX = value;
              Vk.mutateValue(hashId, value, 'dex')
            }
            break;
          case StatusUpdate.CON:
            if (char instanceof L2User) {
              char.CON = value;
              Vk.mutateValue(hashId, value, 'con')
            }
            break;
          case StatusUpdate.INT:
            if (char instanceof L2User) {
              char.INT = value;
              Vk.mutateValue(hashId, value, 'int')
            }
            break;
          case StatusUpdate.WIT:
            if (char instanceof L2User) {
              char.WIT = value;
              Vk.mutateValue(hashId, value, 'int')
            }
            break;
          case StatusUpdate.MEN:
            if (char instanceof L2User) {
              char.MEN = value;
              Vk.mutateValue(hashId, value, 'men')
            }
            break;
          case StatusUpdate.CUR_HP:
            if (typeof char !== "undefined") {
              char.Hp = value;
              Vk.mutateValue(hashId, value, 'hp')
            }
            break;
          case StatusUpdate.MAX_HP:
            if (typeof char !== "undefined") {
              char.MaxHp = value;
              Vk.mutateValue(hashId, value, 'max_hp')
            }
            break;
          case StatusUpdate.CUR_MP:
            if (typeof char !== "undefined") {
              char.Mp = value;
              Vk.mutateValue(hashId, value, 'mp')
            }
            break;
          case StatusUpdate.MAX_MP:
            if (typeof char !== "undefined") {
              char.MaxMp = value;
              Vk.mutateValue(hashId, value, 'max_mp')
            }
            break;
          case StatusUpdate.SP:
            if (char instanceof L2User) {
              char.Sp = value;
              Vk.mutateValue(hashId, value, 'sp')
            }
            break;
          case StatusUpdate.CUR_LOAD:
            // todo
            break;
          case StatusUpdate.MAX_LOAD:
            // todo
            break;
          case StatusUpdate.P_ATK:
            if (char instanceof L2User) {
              char.PAtk = value;
            }
            break;
          case StatusUpdate.ATK_SPD:
            if (char instanceof L2User) {
              char.PAtkSpd = value;
            }
            break;
          case StatusUpdate.P_DEF:
            if (char instanceof L2User) {
              char.PDef = value;
            }
            break;
          case StatusUpdate.EVASION:
            if (char instanceof L2User) {
              char.EvasionRate = value;
            }
            break;
          case StatusUpdate.ACCURACY:
            if (char instanceof L2User) {
              char.Accuracy = value;
            }
            break;
          case StatusUpdate.CRITICAL:
            if (char instanceof L2User) {
              char.Crit = value;
            }
            break;
          case StatusUpdate.M_ATK:
            if (char instanceof L2User) {
              char.MAtk = value;
            }
            break;
          case StatusUpdate.CAST_SPD:
            if (char instanceof L2User) {
              char.MAtkSpd = value;
            }
            break;
          case StatusUpdate.M_DEF:
            if (char instanceof L2User) {
              char.MDef = value;
            }
            break;
          case StatusUpdate.PVP_FLAG:
            // todo
            break;
          case StatusUpdate.KARMA:
            // todo
            break;
          case StatusUpdate.CUR_CP:
            // todo
            break;
          case StatusUpdate.MAX_CP:
            // todo
            break;
        }
      });
    }
  }
}
