# discord_bot
Example of Discord bot with Node.js and MariaDB.

## Installation
Make sure to create following files.
* `config/token.js` : Bot Token.
* `config/database.js` : Database information.

## Usage

### Reminder
The following commands only work for the user who responded.
* ``@bot reminder all`` : Show all registered reminders.
* ``@bot reminder expired`` : Show expired registered reminders.
* ``@bot register reminder [title] [datetime]`` : Register reminder with datetime as deadline.
* ``@bot delete reminder [title]`` : Delete reminder which title matched

### Bot Command
The following commands affect the overall behavior.
* ``@bot bot`` : Show all bot command.
* ``@bot bot interval`` : Display automatic notification interval as minutes.
* ``@bot bot interval (5|10|15|20|30|60)`` : Change the automatic notification intercal, specify the minutes.
* ``@bot bot interval next`` : Show next time for the automatic notification.
