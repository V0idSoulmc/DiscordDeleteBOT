const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const TOKEN = 'YOUR_TOKEN';           // Remplace par ton token de bot
const CLIENT_ID = 'APP_ID';   // Remplace par l'ID de ton application

// Salons protégés (ne seront JAMAIS supprimés)
const PROTECTED_CHANNELS = [
  '1509572608243531776',
  '1509572608243531783',
];
// ──────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Enregistre la commande slash /delete
async function registerCommands() {
  const command = new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Supprime tous les salons sauf les salons protégés')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator); // Admin seulement

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    console.log('📡 Enregistrement de la commande /delete...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: [command.toJSON()],
    });
    console.log('✅ Commande /delete enregistrée avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la commande :', error);
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'delete') return;

  // Vérifie que l'utilisateur est administrateur
  if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ Tu dois être **administrateur** pour utiliser cette commande.',
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const channels = guild.channels.cache;

  const toDelete = channels.filter(
    (ch) => !PROTECTED_CHANNELS.includes(ch.id)
  );

  let deleted = 0;
  let failed = 0;
  const errors = [];

  for (const [, channel] of toDelete) {
    try {
      await channel.delete('Suppression via commande /delete');
      deleted++;
      console.log(`🗑️  Salon supprimé : #${channel.name} (${channel.id})`);
    } catch (err) {
      failed++;
      errors.push(`• ${channel.name} (${channel.id}) — ${err.message}`);
      console.warn(`⚠️  Impossible de supprimer ${channel.name} :`, err.message);
    }
  }

  const summary = [
    `✅ **${deleted}** salon(s) supprimé(s).`,
    failed > 0 ? `⚠️ **${failed}** salon(s) non supprimé(s) :` : '',
    ...errors,
  ]
    .filter(Boolean)
    .join('\n');

  // Le salon de réponse a peut-être été supprimé — on essaie quand même
  try {
    await interaction.editReply({ content: summary });
  } catch {
    // Réponse perdue car le salon a été supprimé, c'est normal
  }
});

client.login(TOKEN);
