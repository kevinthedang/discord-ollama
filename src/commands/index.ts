import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'
import { MessageStream } from './messageStream.js'

export default [
    ThreadCreate,
    MessageStyle,
    MessageStream
] as SlashCommand[]