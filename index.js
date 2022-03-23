//#region imports
const config = require(`./config.json`);
const util = require(`boxing-hosting-utils`)

const Discord = require(`discord.js`);
const db = require(`quick.db`);
const fs = require(`fs-extra`)
const voice = require('@discordjs/voice');


//#endregion


const name = `temp bot`;
//#region Initialization
const utils = new util.Utils();
const list = utils.getIDList();
const bot = new Discord.Client({
    intents //get intents from https://bots.unboxingman.com/permissions.html
});

bot.commands = new Discord.Collection();
bot.Discord = Discord;
bot.config = config;
bot.cooldowns = new Discord.Collection();;
bot.list = list;
bot.prefix = config.prefix;
bot.Voice = voice;
bot.node = Node;
bot.name = name;


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
         console.log(channel.messages.fetch(mess))
         //channel.send(`restart complete `).then(message => message.react(`<a:check:871671636074586112>`))
         var mes = await channel.messages.fetch(mess)
         mes.reactions.removeAll()
         mes.react(`<a:check:871671636074586112>`)
         mes.edit("restart complete")
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
// event handler
bot.events = new Discord.Collection();
const eventfiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventfiles) {

    const event = require(`./events/${file}`);
    bot.events.set(event.name, event)
    if (event.once) {
        bot.once(event.name, (...args) => event.execute( db, bot, ...args));
    } else {
        bot.on(event.name, (...args) => event.execute( db, bot, ...args));
    }
}
//commands handler
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}


//#endregion

bot.login(config.token);