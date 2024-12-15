import { SlashCommand } from '../utils/commands.js'
import { ThreadCreate } from './threadCreate.js'
import { MessageStream } from './messageStream.js'
import { Disable } from './disable.js'
import { Shutoff } from './shutoff.js'
import { Capacity } from './capacity.js'
import { PrivateThreadCreate } from './threadPrivateCreate.js'
import { ClearUserChannelHistory } from './cleanUserChannelHistory.js'
import { PullModel } from './pullModel.js'
import { SwitchModel } from './switchModel.js'
import { DeleteModel } from './deleteModel.js'

export default [
    ThreadCreate,
    PrivateThreadCreate,
    MessageStream,
    Disable,
    Shutoff,
    Capacity,
    ClearUserChannelHistory,
    PullModel,
    SwitchModel,
    DeleteModel
] as SlashCommand[]