//Discord:
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, "GUILD_MEMBERS", "GUILDS"] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//LoL:
let LeagueAPI = require('leagueapiwrapper');
LeagueAPI = new LeagueAPI('RGAPI-3fc132cd-1b6d-4f88-9eee-cfa3fba7c992', Region.NA);



//initialize dotenv
require('dotenv').config(); 




client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Fiddlesticks");
});


//LoL API commands (might move these to slash commands later, algorithm is done)
client.on('messageCreate', async message =>{
	//need to add check for if user doesnt exist - crashes the bot
	//need to add check for if user has SOLOQUEUE as their third dictionary rather than second
	if (message.content.includes("!rank")){
		if (message.author.bot) return false
		var name = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
		var data = await LeagueAPI.getSummonerByName(name).then(async function(accountObject) {
			 return LeagueAPI.getLeagueRanking(accountObject)
				/*.then(console.log)
				.catch(console.error);*/
		}).catch(console.error);
		if (data === undefined){
			message.reply("User not ranked or does not exist (ERROR DATA OBJECT UNDEFINED)").catch(console.error);
		}
		else {
			if (data.length === 0){
				message.reply("User not ranked or does not exist").catch(console.error);
			}

			if (data.length === 1){
				if (data[0]['queueType'] === 'RANKED_SOLO_5x5'){
				message.reply('Summoner Name: ' + name + 
		  		"\nCurrent Rank: " + data[0]['tier'] + ' ' + data[0]['rank'] + ' ' + data[0]['leaguePoints'] + " LP")
				.catch(console.error);
				}
				else {
					message.reply('Error getting user data')
					console.log('Error, could not display: '+  data);
				}
			}

			if (data.length === 2) {
				if (data[0]['queueType'] === 'RANKED_SOLO_5x5'){
					message.reply('Summoner Name: ' + name + 
					  "\nCurrent Rank: " + data[0]['tier'] + ' ' + data[0]['rank'] + ' ' + data[0]['leaguePoints'] + " LP")
					.catch(console.error);
					}
				if (data[1]['queueType'] === 'RANKED_SOLO_5x5'){
					message.reply('Summoner Name: ' + name + 
					  "\nCurrent Rank: " + data[1]['tier'] + ' ' + data[1]['rank'] + ' ' + data[1]['leaguePoints'] + " LP")
					.catch(console.error);
					}
				else {
					message.reply('Error getting user data')
					console.log('Error, could not display: '+  data);
				}
			}

			if (data.length === 3) {
				if (data[0]['queueType'] === 'RANKED_SOLO_5x5'){
					message.reply('Summoner Name: ' + name + 
					  "\nCurrent Rank: " + data[0]['tier'] + ' ' + data[0]['rank'] + ' ' + data[0]['leaguePoints'] + " LP")
					.catch(console.error);
					}
				if (data[1]['queueType'] === 'RANKED_SOLO_5x5'){
					message.reply('Summoner Name: ' + name + 
					  "\nCurrent Rank: " + data[1]['tier'] + ' ' + data[1]['rank'] + ' ' + data[1]['leaguePoints'] + " LP")
					.catch(console.error);
					}
				if (data[2]['queueType'] === 'RANKED_SOLO_5x5'){
					message.reply('Summoner Name: ' + name + 
						"\nCurrent Rank: " + data[2]['tier'] + ' ' + data[2]['rank'] + ' ' + data[2]['leaguePoints'] + " LP")
						.catch(console.error);
						}
				else {
					message.reply('Error getting user data')
					console.log('Error, could not display: '+  data);
				}
			}
		}	
	}

	if (message.content.includes("!ingame")){
		if (message.author.bot) return false
		var name = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
		LeagueAPI.getSummonerByName(name)
			.then(function(accountObject) {
			// Gets active games. Will return 404 if not currently in an active game
			return LeagueAPI.getActiveGames(accountObject);
			})
				.then(function(activeGames) { 
				console.log(activeGames);
			})
				.catch(console.error);
			}
})

//shadow realm a user
//some notes: !shadowrealm null breaks the bot, add a check for this.
//			  add a check for if the user is already in a channel
//			  add a return from shadowrealm feature
client.on('message', message => {
	if (message.member.permissions.has("ADMINISTRATOR")){
	  if(message.content.startsWith('!shadowrealm')) {
		const member = message.mentions.members.first();
		const channel = message.guild.channels.cache.get("912539754413821982");
		var role = member.guild.roles.cache.find(role => role.name === "SHADOW REALM")
		member.voice.setChannel(channel)
		member.roles.add(role)
		message.reply("Sending <@" + member.user + "> to the shadowrealm.")}
	  }}); 


//command listener:
client.on('interactionCreate', async interaction => {

  const command = client.commands.get(interaction.commandName);

  if (!interaction.isCommand()) return;
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
	}
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Shadow realm for patrick:
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get('914319787994279977').send('Welcome, <@' + member.user + '>!'); 
	if (member.user.tag === 'nitrogen#1584'){
		member.guild.channels.cache.get('912562842782281748').send('@everyone ' + '**' + member.user.username + '** has attempted to escape the shadow realm');
		var role = member.guild.roles.cache.find(role => role.name === "SHADOW REALM")
		member.roles.add(role)
		console.log("Patrick attempted to escape the shadow realm");
	}
});

//this isnt working idk why
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get('913203147839766528').send('<@' + member.user + '> has left the server.');
});
  

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token