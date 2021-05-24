# discord_bot

Example of Discord bot with Node.js and MariaDB.

## Installation
Make sure to create following files.
* `config/token.js` : Bot Token.
* `config/database.js` : Database information.

*********************************

## Slash Command
***The slash command must be registered in advance.***

The following commands affect the overall behavior.  
If bot is joined to multiple servers, it will affect all servers.

### Admin Command

The following commands only work for administrators.

* ``/admin reboot`` :  
Reboot bot only if using `forever` module.  
If you don't use it `forever`, bot will shutdown

### Bot Behavior Command

* ``/bot interval`` :  
Display automatic notification interval and the time of the next notification.

* ``/bot interval (5|10|15|20|30|60)`` :  
Change the automatic notification intercal, specify the minutes.


*********************************

## Local Command

The command must be followed by a string of command prefix.  
Command prefix is ``$$`` by default, you can change at ``config/global.js``


### Help Command

* ``$$help`` :
Show list of available local commands.
* ``$$help [command]`` :
Show detail of the specified local command.


### Reminder Management

The following commands only work for the user who responded.

* ``$$reminder all`` :
Show all registered reminders.
* ``$$reminder expired`` :
Show expired registered reminders.
* ``$$reminder register [title] [datetime]`` :
Register reminder with datetime as deadline.
* ``$$reminder delete [title]`` :
Delete reminder which title matched


### Command Management

* ``$$reload local [name]`` : 
    Reload local command.
* ``$$reload slash [name]`` : 
    Reload slash command.


### Slash Command Management

The following commands only work for administrators.

* ``$$slash list`` :
Show all registered slash commands.
* ``$$slash list-guild`` : *(experimental)*
Show all registered slash commands for this guild.
* ``$$slash detail [name]`` :
Show detail of registered slash command.
* ``$$slash delete [name]`` :
Delete registered slash command.
* ``$$slash stored`` :
Show the list of stored slash commands.
* ``$$slash stored [name]`` :
Show detail of stored slash command.
* ``$$slash add [name]`` :
Register the stored command.
