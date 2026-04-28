import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

// --- المسار الجديد لجلب إحصائيات السيرفر ---
app.get("/guild-stats", async (req, res) => {
  try {
    // نطلب بيانات السيرفر (الـ Preview يعطينا الأرقام التقريبية للأعضاء والمتواجدين)
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/preview`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch guild stats" });
    }

    const data = await response.json();

    res.json({
      name: data.name,
      totalMembers: data.approximate_member_count,
      onlineMembers: data.approximate_presence_count,
      icon: data.icon ? `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.png?size=256` : null
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- مسار المستخدم (القديم اللي عندك مع تعديل بسيط) ---
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`
        }
      }
    );

    const data = await response.json();

    if (!data.user) {
      return res.status(404).json({ error: "User not found in guild" });
    }

    const user = data.user;
    const name = data.nick || user.global_name || user.username;
    let avatar = user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    res.json({
      name: name,
      username: user.username,
      avatar: avatar
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch from Discord" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});