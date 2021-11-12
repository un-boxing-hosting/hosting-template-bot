//#region imports
const config = require(`./config.json`);
const util = require(`boxing-hosting-utils`)

const Discord = require(`discord.js`);
const db = require(`quick.db`);
const fs = require(`fs-extra`)


//#endregion


const name = `temp bot`;
//#region Initialization
const utils = new util.Utils();
const list = utils.getIDList();
const bot = new Discord.Client({
    intents
});

//#endregion


//#region bot
bot.once(`ready`, async () => {
    var text = fs.readFile(`./restart.txt`, `utf-8`)
    var txt = await text
    console.log((await text))
    if ((await text) === `yes`) {
        var ch = db.get(`restart_ch`)
        var mess = db.get(`restart_me`)
        var channel = bot.channels.cache.get(ch)
        channel.send(`restart complete `).then(message => message.react(`<a:check:871671636074586112>`))
        var mes = channel.messages.fetch(mess).then(message => message.react(`<a:check:871671636074586112>`))
        //mes.react(`<a:check:871671636074586112>`)
        fs.writeFile(`./restart.txt`, ` `);
        db.delete(`restart_ch`)
        db.delete(`restart_me`)
    }
    // console.log(`Bot has started, with ${bot.users.cache.size} users, in ${bot.channels.cache.size} channels of ${bot.guilds.cache.size} guilds.`);
    (function () {
        var oldlog = console.log;
        var olderr = console.error;
        var t = new Date()
        var d = t.getDate();
        var m = t.getMonth();
        var y = t.getFullYear();
        var file = `./../logs/${name}-logs/logs-${`${m}-${d}-${y}`}.txt`
        const channell = bot.channels.cache.get(config.consoleid)
        //fs.createFile(file, function(err){console.log(`${err} help me`);});
        fs.writeFile(file, `\n`);
        var stream = fs.createWriteStream(file, {
            flags: 'a'
        })
        console.log = function (message) {
            channell.send(message)
            stream.write(message + "\n")
            oldlog.apply(console, arguments);
        };
        console.error = function (message) {
            channell.send(message)
            stream.write(message + "\n")
            olderr.apply(console, arguments);
        }
    })();

})


bot.on(`message`, async message => {
     const idlist = await list;
    if (!message.content.startsWith(config.prefix)) return
    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args2 = message.content.slice(prefix.length).split(/ +/);
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(prefix.length).toLowerCase();
    console.log(command)
    switch (command) {
        case `help`:
            const help = new Discord.MessageEmbed()

                .setColor('BLUE')
                .setTitle('pc-power help')
                .setURL('https://bots.unboxingman.com')
                .setAuthor('pc power', 'https://play.unboxingman.com/logo.png', 'https://bots.unboxingman.com')
                .setDescription(` my commands`)
                .setThumbnail('https://play.unboxingman.com/logo.png')
                .addFields(
                    //{ name: `${prefix}help`, value: `my help menu` },
                    {
                        name: `${prefix}help`,
                        value: `my help menu`
                    }, {
                        name: `${prefix}support`,
                        value: `join my suport server for help`
                    },
                )
                .setTimestamp()
                .setFooter('made by un boxing man yt', 'https://play.unboxingman.com/logo.png')

            message.channel.send({
                embeds: [help]
            });
            break;
        case `support`:
            message.channel.send(`https://bots.unboxingman.com/support`)
            break;
    }

})

//#endregion

bot.login(config.token);