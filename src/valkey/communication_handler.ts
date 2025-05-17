import Valkey from 'iovalkey'
import CharInfo from '../network/incoming/game/CharInfo'

class Vk {
  static charMutator (packet: CharInfo): void {

    console.log(packet.Char)
  }
  
  static checkObject () {

  }

  static publish () {
    // send message
    // send hash
  }
}

