import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'
import { MessageStream } from './messageStream.js'
import { Disable } from './disable.js'

export default [
    ThreadCreate,
    MessageStyle,
    MessageStream,
    Disable
] as SlashCommand[]