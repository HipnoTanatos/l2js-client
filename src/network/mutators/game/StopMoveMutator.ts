import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import {Vk} from "../../../valkey/communication_handler";
import GameClient from "../../GameClient";
import StopMove from "../../incoming/game/StopMove";
import ValidatePosition from "../../outgoing/game/ValidatePosition";

/**
 * StopMove packet is not always send by the server,
 * usually its only sent when movement is cancelled.
 */
export default class StopMoveMutator extends IMMOClientMutator<GameClient, StopMove> {
  update(packet: StopMove): void {
    const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
    if (creature) {
      const [_x, _y, _z] = packet.Location;
      creature.Location = [_x, _y, _z, packet.Heading];
      if (this.Client.ActiveChar.ObjectId !== packet.ObjectId) {
        // TODO: update this to use .on("StopMove") event?
        creature.calculateDistance(this.Client.ActiveChar);
      } else {
        // we should send validate position once stopped
        this.Client.sendPacket(new ValidatePosition(_x, _y, _z, packet.Heading, 0x00));
      }
      creature.IsMoving = false;
      // ---
      Vk.handleMutation(packet.ObjectId, 'movement',
                        {x: _x, y: _y, z: _z, is_moving: false},
                        this.Client.ActiveChar.Name)
    }
  }
}
