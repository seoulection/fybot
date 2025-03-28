const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require('@discordjs/voice')
const { CronJob } = require('cron')
const { channelId, token } = require('./config.json')
const { getRandomMelody } = require('./helpers/getSounds.js')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})
const audioPlayer = createAudioPlayer()

let connection
let bellState
let countState = 0
let hourState

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'))

const chooseRandom = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

const getBell = () => {
  if (Array.isArray(bellState)) return chooseRandom(bellState)
  return bellState
}

commandFiles.forEach((file) => {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a require "data" or "execute" property.`,
    )
  }
})

client.once(Events.ClientReady, async (readyClient) => {
  const channel = await readyClient.channels.fetch(channelId)

  const job = new CronJob('0 * * * *', () => {
    if (channel.members.size === 0) return

    connection = joinVoiceChannel({
      channelId,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    })
    const { bell, count, melody } = getRandomMelody()

    bellState = bell
    countState = count
    hourState = new Date().getHours() % 12 || 12

    connection.subscribe(audioPlayer)
    audioPlayer.play(createAudioResource(`./public/${melody}`))
  })

  job.start()
})

audioPlayer.on(AudioPlayerStatus.Idle, () => {
  if (countState >= hourState) {
    countState = 0
    connection.disconnect()
  } else {
    audioPlayer.play(createAudioResource(`./public/${getBell()}`))
    countState++
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)

    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
  }
})

client.login(token)
