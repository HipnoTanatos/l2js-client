import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import CreatureSay from "../../incoming/game/CreatureSay";
import GameClient from "../../GameClient";
import {Vk} from "../../../valkey/communication_handler";

export default class CreatureSayMutator extends IMMOClientMutator<
  GameClient,
  CreatureSay
> {
  update(packet: CreatureSay): void {
    Vk.handleChat({
      objectId: packet.ObjectId,
      type: packet.Type,
      charName: packet.CharName,
      npcStringId: packet.NpcStringId,
      messages: packet.Messages,
    })
    // ---

    this.fire("CreatureSay", {
      objectId: packet.ObjectId,
      type: packet.Type,
      charName: packet.CharName,
      npcStringId: packet.NpcStringId,
      messages: packet.Messages,
    });
  }
}
