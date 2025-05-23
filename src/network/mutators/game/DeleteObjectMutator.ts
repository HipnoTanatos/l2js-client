import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import {Vk} from "../../../valkey/communication_handler";
import GameClient from "../../GameClient";
import DeleteObject from "../../incoming/game/DeleteObject";

export default class DeleteObjectMutator extends IMMOClientMutator<
  GameClient,
  DeleteObject
> {
  update(packet: DeleteObject): void {
    Vk.handleMob(packet.ObjectId, packet.Creature, this.Client.ActiveChar.Name)
    // ---
    this.Client.CreaturesList.removeByObjectId(packet.ObjectId);
    this.Client.DroppedItems.removeByObjectId(packet.ObjectId);
    if (this.Client.ActiveChar.Target?.ObjectId === packet.ObjectId) {
      this.Client.ActiveChar.Target = null;
    }
  }
}
