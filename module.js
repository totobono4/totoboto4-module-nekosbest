const {EmbedBuilder, Events, SlashCommandBuilder, userMention } = require('discord.js')
const NekosBest = require('nekos-best.js')

const { actionCommands } = require('./commands.json')
const { Module, Debugger } = require('totoboto4-core')
const debug = new Debugger()

const prefix = 'nb'

class NekosBestModule extends Module {
  constructor (modulator) {
    super(modulator)

    this.name = 'NekosBest'
    this.version = '1.0.0'

    this.commands = [
      ...actionCommands.map(
        actionCommand => new SlashCommandBuilder()
          .setName(`${prefix}-${actionCommand.name}`).setDescription(actionCommand.description)
          .addUserOption(option => option.setName('victim').setDescription('Your victim'))
      ),
    ] // Commands here

    this.dependencies = [] // If dependencies, module names here
  }

  /**
   * @param {} data 
   */
  launch(data) {
    debug.addLayer("NekosBest", "nekosbest")
    debug.debug(debug.layers.NekosBest, debug.types.Debug, "NekosBest Initialized !")

    const client = data.client

    client.on(Events.InteractionCreate, (interaction) => {
      const commandName = interaction.commandName
      
      actionCommands.forEach(actionCommand => {
        if (`${prefix}-${actionCommand.name}` === commandName) {
          this.actions(interaction, actionCommand.name)
        }
      })
    })
  }

  async actions (interaction, action) {
      debug.debug(debug.layers.NekosBest, debug.types.Debug, "Action was used.")
  
      const user = interaction.user
      const victim = interaction.options.getUser('victim')

      const response = await NekosBest.fetchRandom(action)
      const { anime_name, artist_href, artist_name, source_url, url } = response.results[0]

      if (!anime_name) {
        if (!victim) {
          interaction.reply({
            embeds: [this.NekosEmbedBuilder(user, user.avatarURL(), interaction.commandName, source_url, url, `art by [${artist_name}](${artist_href})`)]
          })
        } else {
          interaction.reply({
            content: userMention(victim.id),
            embeds: [this.NekosEmbedBuilder(user, user.avatarURL(), interaction.commandName, source_url, url, `art by [${artist_name}](${artist_href})`)]
          })
        }
      } else {
        if (!victim) {
          interaction.reply({
            embeds: [this.NekosEmbedBuilder(user, user.avatarURL(), interaction.commandName, url, url, `anime: ${anime_name}`)]
          })
        } else {
          interaction.reply({
            content: userMention(victim.id),
            embeds: [this.NekosEmbedBuilder(user, user.avatarURL(), interaction.commandName, url, url, `anime: ${anime_name}`)]
          })
        }
      }
    }

    NekosEmbedBuilder (author, thumbnail, title, source_url, url, description) {
        return new EmbedBuilder()
          .setColor('Navy')
          .setAuthor({
            name: author.username
          })
          .setThumbnail(thumbnail)
          .setTitle(title)
          .setURL(source_url)
          .setDescription(description)
          .setImage(url)
          .setFooter({
            text: 'totoboto4 NekosBest services'
          })
          .setTimestamp(new Date())
      }
}

module.exports = NekosBestModule
