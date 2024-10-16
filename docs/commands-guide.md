## Commands Guide
This is a guide to all of the slash commands for the bot.

* Action Commands are commands that do not affect a user's `preference file`.
* Guild Commands can also be considered action commands.

> [!NOTE]
> Administrator commands are only usable by actually administrators on the Discord server.

### Guild Commands (Administrator)
1. Disable (or Toggle Chat) Command
This command will `enable` or `disable` whether or not the bot will respond to users. For example, we set the `enabled` field to `true` to allow the bot to respond to users.

```
/toggle-chat enabled true
```

2. Shutoff Command
This command will shutoff the bot and no users will be able to respond to the bot anymore. The bot must be manually restarted upon being shutoff.

Below we shutoff the bot by putting `true` in the `are-your-sure` field.

```
/shutoff are-you-sure true
```

### Action Commands
1. Clear Channel (Message) History Command
This command will clear the history of the current channel for the user that calls it. For example, just running the command in any channel will clear the message history.

```
/clear-user-channel-history
```

2. Pull Model Command
This command will pull a model that exists on the [Ollama Model Library](https://ollama.com/library). If it does not exist there, it will throw a hissy fit.

Below we try to pull the `codellama` model.

```
/pull-model model-to-pull codellama
```

3. Thread Create Command
This command creates a public thread to talk with the bot if you do not want to talk in a `GuildText` channel.

You can just run the command below:

```
/thread
```

4. Private Thread Create Command
This command creates a private thread to talk with the bot privately. You can invite others to the channel and they will be able to talk to the bot there.

You can just run the command below:

```
/private-thread
```

### User Preference Commands
1. Capacity Command
This command changes how much context it will keep within your conversations with the discord bot. This is applied for all of your existing chats whenever you interact with the bot. For example, below I am setting my message history capacity to at most 5 messages at once.

```
/modify-capacity context-capacity 5
```

2. Message Stream Command
This command will toggle whether or not the bot will "stream" a response kind of how ChatGPT and many UI's do it. 

> [!NOTE]
> This is a very slow progress on Discord because they do not allow what I call "spamming" changes within 5 seconds.

Below, we can set `stream` to true to make the bot respond not all at once.

```
/message-stream stream true
```

3. Message Style Command
This command allows user to select their preferred way the bot to respond. 

Below enables the embed style.

```
/message-style embed true
```

This way allows the bot to respond as you would normally see a user respond.

```
/message-style embed false
```

4. Switch Model Command
This command will switch the user preferred model so long as it exists in within their local ollama service or from the [Ollama Model Library](https://ollama.com/library). If it cannot be found locally, it will attempt to find it in the model library.

Below we are trying to switch to a specific model size. 

```
/switch-model model-to-use llama3.2:1.3b
```

