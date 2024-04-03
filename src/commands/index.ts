import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'
import { MessageStream } from './messageStream.js'
import { Disable } from './disable.js'
import { Shutoff } from './shutoff.js'
import { Capacity } from './capacity.js'

export default [
    ThreadCreate,
    MessageStyle,
    MessageStream,
    Disable,
    Shutoff,
    Capacity
] as SlashCommand[]