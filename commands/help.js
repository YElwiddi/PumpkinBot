const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('See a list of commands'),
	async execute(interaction) {
		await interaction.reply(`List of commands:\n
        */user: shows your tag and user ID*
        */server: shows the server name and status*
        */opgg: shows my current accounts and their ranks (only gives an opgg link, use !rank instead)*
		
		*!shadowrealm: sends a user to the shadowrealm (ADMIN ONLY)*
		*!rank ABC: gives you the current LoL rank of user 'ABC'*
      
      More commands and functionality will be coming soon as I continue to work on this bot. -Nikkone`);
	},
};