## Commands Guide
This is a guide to all of the slash commands for the app.

* Action Commands are commands that do not affect a user's `preference file`.
* Guild Commands can also be considered action commands.

> [!NOTE]
> Administrator commands are only usable by actual administrators on the Discord server.

### Guild Commands (Administrator)
1. Disable (or Toggle Chat)  
    This command will `enable` or `disable` whether or not the app will respond to users.  

    ```
    /toggle-chat enabled true
    ```

2. Shutoff  
    This command will shutoff the app so no users can converse with it.  
    The app must be manually restarted upon being shutoff.

    Below shuts off the app by putting `true` in the `are-your-sure` field.

    ```
    /shutoff are-you-sure true
    ```

### Action Commands
1. Clear Channel (Message) History  
    This command will clear the history of the current channel for the user that calls it.  
    Running the command in any channel will clear the message history.

    ```
    /clear-user-channel-history
    ```

2. Pull Model  
    This command will pull a model that exists on the [Ollama Model Library](https://ollama.com/library). If it does not exist there, it will throw a hissy fit.

    Below trys to pull the `codellama` model.

    ```
    /pull-model model-to-pull codellama
    ```

3. Thread Create  
    This command creates a public thread to talk with the app instead of using a `GuildText` channel.

    ```
    /thread
    ```

4. (Private) Thread Create  
    This command creates a private thread to talk with the bot privately.  
    Invite others to the channel and they will be able to talk to the app as well.

    ```
    /private-thread
    ```

### User Preference Commands
1. Capacity  
    This command changes how much context it will keep in conversations with the app.  
    This is applied for all of existing chats when interacting with the app.  

    Below sets the message history capacity to at most 5 messages at once.

    ```
    /modify-capacity context-capacity 5
    ```

2. Message Stream  
    This command will toggle whether or not the app will "stream" a response.  
    (think of how ChatGPT and other interfaces do this)

    Below sets the `stream` to true to make the app respond in increments.

    ```
    /message-stream stream true
    ```
    **This is very slow on Discord because "spamming" changes in a channel within a period of 5 seconds is not allowed.**

3. Message Style  
    This command allows a user to select whether to embed the app's response. 

    ```
    /message-style embed true
    ```

    This allows the app to respond as a user would normally respond.

    ```
    /message-style embed false
    ```

4. Switch Model  
    This command will switch the user-preferred model so long as it exists in within the local ollama service or from the [Ollama Model Library](https://ollama.com/library).  
    If it cannot be found locally, it will attempt to find it in the model library.

    Below we are trying to switch to a specific model size. 

    ```
    /switch-model model-to-use llama3.2:1.3b
    ```
