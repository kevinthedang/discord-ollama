## Events Guide
This is a guide to all of the client events for the app.

> [!NOTE]
> * Each of these is logged to the console for a developer to track.
> * Possible interactions include commands, buttons, menus, etc.

1. ClientReady  
    This event signifies that the Discord app is online.  
    Here the app's activity is set and its commands are registered.

2. InteractionCreate  
    This event signifies that a user interacted from Discord in some way.  
    Here commands are selected from a knowledge bank and executed if found.

3. MessageCreate  
    This event signifies that a message was sent.  
    Here user questions and comments for the LLM are processed.  
    1. check message is from a user and mentions the app
    2. check for interaction preferences
    3. add the message to a queue
    4. check the response for success
    5.  send a response back to the user.

4. ThreadDelete  
    This event signifies that a Discord Thread was deleted.  
    Here any preferences set for interaction within the thread are cleared away.
