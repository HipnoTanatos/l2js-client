import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import {Vk} from "../../../valkey/communication_handler";
import GameClient from "../../GameClient";
import ValidateLocation from "../../incoming/game/ValidateLocation";

export default class ValidateLocationMutator extends IMMOClientMutator<GameClient, ValidateLocation> {
  update(packet: ValidateLocation): void {
    const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
    if (creature) {
      const [_x, _y, _z] = packet.Location;
      creature.Location = [_x, _y, _z, packet.Heading];
      // ---
      // TODO: position is one movement behind
      Vk.handleMob(packet.ObjectId, creature!, this.Client.ActiveChar.Name)
    }
  }
}
