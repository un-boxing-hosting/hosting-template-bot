module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(db, bot, message) {
        var Discord = bot.Discord;
        var prefix = bot.prefix;
        var cooldowns = bot.cooldowns;
        if (message.author.bot) return;

        //const guildConf = bot.settings.ensure(message.guild.id, defaultSettings);
        if (!message.content.startsWith(prefix)) return;
        //const voicechannel = Member.voice.channel;
        //const serverQueue = queue.get(message.guild.id);
        const args = message.content.split(/\s+/g);
        const commandName = args.shift().slice(prefix.length).toLowerCase();

        //const args = message.content.slice(prefix.length).split(/ +/);
        //const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName) ||
            bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
            return message.reply('I can\'t execute that command inside DMs!');

        }
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);

        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }


        }
        try {
            command.execute(bot, message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    },
};