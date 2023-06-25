const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const sample = require("lodash.sample");
const { nanoleafAuthToken, nanoleafIp } = require("../config.json");

const NANOLEAF_API_URL = `http://${nanoleafIp}/api/v1/${nanoleafAuthToken}`;

module.exports = {
  data: new SlashCommandBuilder()
            .setName("nano")
            .setDescription("Control my nanoleaves")
            .addStringOption(option =>
              option
                .setName("effect")
                .setDescription("The nanoleaf effect")
                .setRequired(true)
                .addChoices(
                  { name: "cloud", value: "Cloud" },
                  { name: "electric chill", value: "Electric Chill" },
                  { name: "energize", value: "Energize" },
                  { name: "fireworks", value: "Fireworks" },
                  { name: "forest", value: "Forest" },
                  { name: "inner peace", value: "Inner Peace" },
                  { name: "japanese streets", value: "Japanese Streets" },
                  { name: "light cycle", value: "Light Cycle" },
                  { name: "metagross", value: "Metagross" },
                  { name: "meteor shower", value: "Meteor Shower" },
                  { name: "neon", value: "Neon" },
                  { name: "northern lights", value: "Northern Lights" },
                  { name: "ocean", value: "Ocean" },
                  { name: "paint splatter", value: "Paint Splatter" },
                  { name: "random", value: "Random" },
                  { name: "retro", value: "Retro" },
                  { name: "snowfall", value: "Snowfall" },
                  { name: "sparrows", value: "Sparrows" },
                  { name: "vapor2", value: "V  A  P  O  R  2" },
                  { name: "vapor", value: "Vapor" },
                  { name: "vintage modern", value: "Vintage Modern" }
                )
            ),
  async execute(interaction) {
    const effect = interaction.options.getString("effect");

    if (effect === "Random") {
      await setRandomEffect(interaction);
    } else {
      await setEffect(effect, interaction);
    }
  }
}

async function setEffect(effect, interaction) {
  return await axios.put(`${NANOLEAF_API_URL}/effects`, {
    select: effect
  })
    .then(async () => {
      await interaction.reply(`${effect} was set`)
    })
    .catch(async () => await interaction.reply("Congrats, you broke my nanoleaves"));
}

async function setRandomEffect(interaction) {
  await axios.get(`${NANOLEAF_API_URL}/effects/effectsList`)
    .then(async res => {
      const randomEffect = sample(res.data);
      await setEffect(randomEffect, interaction);
    })
    .catch(async () => await interaction.reply("Congrats, you broke my nanoleaves"));
}
