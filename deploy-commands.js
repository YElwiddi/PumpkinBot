const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
//let LeagueAPI = require('leagueapiwrapper');
//LeagueAPI = new LeagueAPI('RGAPI-3fc132cd-1b6d-4f88-9eee-cfa3fba7c992', Region.NA);
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



const commands = [].map(command => command.toJSON());

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);
//^^ Declaring a rest variable, which is a new rest object of version 9, setting the token (i guess this is an argument) as the token you declared in your config

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
//^^^ wtf is this