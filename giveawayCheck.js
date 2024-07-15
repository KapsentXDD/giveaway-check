const { Client, EmbedBuilder } = require("discord.js");
const client = global.client;
const VoiceJoinedDateDatabase = require("../schemas/voiceInfo");
const moment = require("moment")

module.exports = async (message) => {
  if (message.content.includes("tebrikler!") && message.content.includes("Congratulations") && message.content.includes("Congratulations,")) {
    let args = message.content.split(" ");
    let members;
    if (message.mentions.members.size >= 1) {
      members = message.mentions.members.map(r => r.id);
    } else {
      if (!members) return
      members = args.splice(0, 1).map(id => message.guild.members.cache.get(id)).filter(r => r != undefined);
    }
    members.map(async(a) => {
      let member;
      member = message.guild.members.cache.get(a)
      if (!member.voice.channel) return message.reply({ embeds: [new EmbedBuilder()
        .setDescription(`<@${member.id}> bir ses kanalına bağlı değil.`)] });
      let mic = member.voice.selfMute == true ? "kapalı" : "açık"
      let hop = member.voice.selfDeaf == true ? "kapalı" : "açık"
      let data = await VoiceJoinedDateDatabase.findOne({ userID: member.id})
      let süre = data && data.date ? data.date : Date.now()
      message.reply({ embeds: [new EmbedBuilder()
        .setDescription(`<@${member.id}> kişisi ${member.voice.channel.name} kanalında. Mikrofonu ${mic}, kulaklığı ${hop}.\n───────────────\nKullanıcı <#${member.voice.channel.id}> kanalına ${moment(süre).locale('tr').fromNow()} giriş yapmış.`)] });
    })
  }
}

module.exports.conf = {
  name: "messageCreate",
};