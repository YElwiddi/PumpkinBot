const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get your latency (CURRENTLY NOT IMPLEMENTED)'),
	async execute(interaction) {
		await interaction.reply('null');
	},
};