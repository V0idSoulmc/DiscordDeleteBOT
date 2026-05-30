const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const TOKEN = 'YOUR_TOKEN';           // Remplace par ton token de bot
const CLIENT_ID = 'YOUR_APP_ID';   // Remplace par l'ID de ton application
const TARGET_GUILD_ID = 'YOUR_SERVER_ID'; // ID du serveur cible
// ──────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('delete')
      .setDescription('Supprime tous les salons sauf les salons protégés')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName('deleterole')
      .setDescription('Supprime tous les rôles supprimables du serveur')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName('info')
      .setDescription('Scanne et liste TOUS les noms (membres, salons, rôles)')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  ];
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, TARGET_GUILD_ID), { body: commands.map(cmd => cmd.toJSON()) });
    console.log('✅ Commandes mises à jour.');
  } catch (error) { console.error(error); }
}

client.once('ready', async () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.guildId !== TARGET_GUILD_ID) return interaction.reply({ content: '❌ Interdit ici.', ephemeral: true });

  // --- /info ---
  if (interaction.commandName === 'info') {
    await interaction.deferReply({ ephemeral: true });
    try {
      const g = interaction.guild;
      const members = await g.members.fetch();
      const roles = await g.roles.fetch();
      const channels = await g.channels.fetch();

      // 1. Liste des Membres
      const memberList = members.map(m => `• ${m.user.tag}${m.user.bot ? ' [BOT]' : ''}`).join('\n');
      
      // 2. Liste des Rôles
      const roleList = roles.filter(r => r.id !== g.id).map(r => `• ${r.name}`).join('\n');

      // 3. Liste des Salons (triés par type)
      const textChannels = channels.filter(c => c.type === 0).map(c => `• #${c.name}`).join('\n');
      const voiceChannels = channels.filter(c => c.type === 2).map(c => `• 🔊 ${c.name}`).join('\n');
      const categories = channels.filter(c => c.type === 4).map(c => `• 📁 ${c.name}`).join('\n');

      // Fonction pour tronquer si trop long (limite Discord 1024 par champ)
      const truncate = (str) => str.length > 1024 ? str.substring(0, 1021) + '...' : (str || 'Aucun');

      const embed = new EmbedBuilder()
        .setTitle(`🔍 Scan Détaillé : ${g.name}`)
        .setColor('#00FF00')
        .addFields(
          { name: `👥 Membres (${members.size})`, value: truncate(memberList) },
          { name: `🎭 Rôles (${roles.size - 1})`, value: truncate(roleList) },
          { name: `📁 Catégories`, value: truncate(categories) },
          { name: `💬 Salons Textuels`, value: truncate(textChannels) },
          { name: `🔊 Salons Vocaux`, value: truncate(voiceChannels) }
        )
        .setFooter({ text: 'Rapport complet généré' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (e) {
      console.error(e);
      await interaction.editReply('❌ Erreur lors du scan détaillé.');
    }
  }

  // --- /delete ---
  if (interaction.commandName === 'delete') {
    await interaction.deferReply({ ephemeral: true });
    const PROTECTED = ['1509572608243531776', '1509572608243531783'];
    const channels = interaction.guild.channels.cache;
    let count = 0;
    for (const [, ch] of channels.filter(c => !PROTECTED.includes(c.id))) {
      try { await ch.delete(); count++; } catch {}
    }
    await interaction.editReply(`✅ ${count} salons supprimés.`);
  }

  // --- /deleterole ---
  if (interaction.commandName === 'deleterole') {
    await interaction.deferReply({ ephemeral: true });
    const roles = await interaction.guild.roles.fetch();
    let count = 0;
    for (const [, r] of roles) {
      if (r.id !== interaction.guild.id && !r.managed) {
        try { await r.delete(); count++; } catch {}
      }
    }
    await interaction.editReply(`✅ ${count} rôles supprimés.`);
  }
});

client.login(TOKEN);
