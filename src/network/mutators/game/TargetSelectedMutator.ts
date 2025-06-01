import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import {Vk} from "../../../valkey/communication_handler";
import GameClient from "../../GameClient";
import TargetSelected from "../../incoming/game/TargetSelected";

export default class TargetSelectedMutator extends IMMOClientMutator<
  GameClient,
  TargetSelected
> {
  update(packet: TargetSelected): void {
    const char = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
    if (char) {
      const target = this.Client.CreaturesList.getEntryByObjectId(
        packet.TargetObjectId
      );
      if (target) {
        char.Target = target;
      }
    }

    // ---
    Vk.handleMutation(packet.ObjectId, 'target', {target: packet.TargetObjectId}, this.Client.ActiveChar.Name)

    this.fire("TargetSelected", {
      objectId: packet.ObjectId,
      targetObjectId: packet.TargetObjectId,
      targetLocation: packet.Location,
    });
  }
}
