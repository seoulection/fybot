const { SlashCommandBuilder } = require("discord.js");
const sample = require("lodash.sample");

const RESPONSES = ["YEAH", "NO", "THAT", "IT", "IF I KNOW", "IN' A"];

module.exports = {
  data: new SlashCommandBuilder()
            .setName("fuck")
            .setDescription("Fuck yeah!")
            .addStringOption(option =>
              option
                .setName("input")
                .setDescription("The question")
                .setRequired(true)
            ),
  async execute(interaction) {
    const input = interaction.options.getString("input");

    if (input.endsWith("?")) {
      await interaction.reply(`Q: ${input} A: FUCK ${sample(RESPONSES)}`);
    } else {
      await interaction.reply({
        content: "That was not a fucking question. Questions must end with '?'",
        ephemeral: true
      });
    }
  }
}
