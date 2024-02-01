import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'

export default [
    ThreadCreate,
    MessageStyle
] as SlashCommand[]