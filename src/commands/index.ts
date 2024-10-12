import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStyle } from './messageStyle.js'
import { MessageStream } from './messageStream.js'
import { Disable } from './disable.js'
import { Shutoff } from './shutoff.js'
import { Capacity } from './capacity.js'
import { PrivateThreadCreate } from './threadPrivateCreate.js'
import { ClearUserChannelHistory } from './cleanUserChannelHistory.js'
import { PullModel } from './pullModel.js'

export default [
    ThreadCreate,
    PrivateThreadCreate,
    MessageStyle,
    MessageStream,
    Disable,
    Shutoff,
    Capacity,
    ClearUserChannelHistory,
    PullModel
] as SlashCommand[]