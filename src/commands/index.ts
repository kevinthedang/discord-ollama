import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'
import { MessageStream } from './messageStream.js'
import { Disable } from './disable.js'
import { Shutoff } from './shutoff.js'
import { Capacity } from './capacity.js'
import { PrivateThreadCreate } from './threadPrivateCreate.js'

export default [
    ThreadCreate,
    PrivateThreadCreate,
    MessageStyle,
    MessageStream,
    Disable,
    Shutoff,
    Capacity
] as SlashCommand[]