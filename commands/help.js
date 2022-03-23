//const { prefix } = require('../mus-config-dev.json');
const {
    MessageEmbed
} = require("discord.js");
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(bot, message, args) {
        const prefix = bot.prefix
        const data = [];
        //const {
        //     commands
        // } = bot;
        // const name = args[0];
        // const command = bot.commands.get(name) || bot.commands.find(c => c.aliases && c.aliases.includes(name));

        let commandss = Array.from(bot.commands.values());

        if (!args.length) {
            let helpEmbed = new MessageEmbed()
                .setTitle(`${bot.name}'s Help menu`)
                .setDescription("List of all my commands")
                .setColor('BLUE')
                .setURL('http://bots.unboxingman.com')
                .setAuthor(`${bot.name}`, 'https://bots.unboxingman.com/pix/logos/box-logo.png', 'http://bots.unboxingman.com')
                .setThumbnail('https://bots.unboxingman.com/pix/logos/box-logo.png')
                .setFooter('made by boxing hosting', 'https://bots.unboxingman.com/logo.png')

            commandss.forEach((cmd) => {
                if (cmd.name == undefined) return;
                // console.log(cmd)
                // console.log(`${bot.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : "(no aliases)"}`)
                //console.log(cmd.description)
                if (cmd.hidden == true) return;
                helpEmbed.addFields({
                        name: `${bot.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : "(no aliases)"}`,
                        value: `${cmd.description ? `${cmd.description}` : `no description`}.`,
                        inline: true
                    },

                );
            });

            helpEmbed.setTimestamp();

            message.channel.send({
                embeds: [helpEmbed]
            }).catch(console.error);
            return;
        }


        const commands = bot.commands;
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }
        let helpEmbed = new bot.Discord.MessageEmbed()
            .setTitle(`${bot.name}'s Help menu`)
            .setDescription("List of all my commands")
            .setColor('BLUE')
            .setURL('http://bots.unboxingman.com')
            .setAuthor(`${bot.name}`, 'https://bots.unboxingman.com/pix/logos/box-logo.png', 'http://bots.unboxingman.com')
            .setThumbnail('https://bots.unboxingman.com/pix/logos/box-logo.png')
            .setFooter('made by boxing hosting', 'https://bots.unboxingman.com/logo.png')


        helpEmbed.addFields({
            name: `**Name:** ${command.name}\n**Aliases:** ${command.aliases ? `(${command.aliases})` : "(no aliases)"}`,
            value: `**Description:** ${command.description ? `${command.description}` : `no description`}.\n**Usage:** ${prefix}${command.name} ${command.usage ? command.usage : "no usage"}\n**Cooldown:** ${command.cooldown || 3} second(s)`
        })
        helpEmbed.setTimestamp();



        message.channel.send({
            embeds: [helpEmbed]
        });


    },
};