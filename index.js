const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')
const { CronJob } = require('cron')
const { channelId, token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const audioPlayer = createAudioPlayer()
const generalIntros = ['melody.mp3', 'bigbenintro.wav']
const smallChanceIntros = ['creep1.wav', 'creep2.wav']

let connection;
let hour;
let count = 0;

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const getRandomFile = () => {
  const number = Math.floor(Math.random() * 10)

  if (number === 9) {
    return smallChanceIntros[Math.floor(Math.random() * smallChanceIntros.length)]
  } else {
    return generalIntros[Math.floor(Math.random() * generalIntros.length)]
  }
}

commandFiles.forEach(file => {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a require "data" or "execute" property.`);
  }
});

client.once(Events.ClientReady, async readyClient => {
  const channel = await readyClient.channels.fetch(channelId)

  const job = new CronJob('0 * * * *', () => {
    if (channel.members.size === 0) return

    connection = joinVoiceChannel({
      channelId,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false
    })
    const soundFile = getRandomFile()
    const melody = createAudioResource(`./public/${soundFile}`)
    hour = (new Date().getHours() % 12) || 12
    count = 0;

    connection.subscribe(audioPlayer)
    audioPlayer.play(melody)
  })

  job.start()
});

audioPlayer.on(AudioPlayerStatus.Idle, () => {
  if (count >= hour) {
    count = 0
    connection.disconnect()
  } else {
    const bell = createAudioResource('./public/bell.wav')
    audioPlayer.play(bell)
    count++
  }
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);

    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(token);
