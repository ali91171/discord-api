import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ نجيب بيانات العضو من السيرفر (مو المستخدم العام)
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`
        }
      }
    );

    const data = await response.json();

    // ⚠️ إذا فشل
    if (!data.user) {
      return res.status(404).json({ error: "User not found in guild" });
    }

    const user = data.user;

    // 🎯 ترتيب الاسم (الأهم للأقل)
    const name =
      data.nick ||          // nickname في السيرفر
      user.global_name ||   // الاسم العام
      user.username;        // اليوزرنيم

    // 🖼️ الصورة
    let avatar = "";

    if (user.avatar) {
      avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    } else {
      avatar = `https://cdn.discordapp.com/embed/avatars/0.png`;
    }

    res.json({
      name: name,
      username: user.username,
      global_name: user.global_name,
      nick: data.nick,
      avatar: avatar
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch from Discord" });
  }
});

// ⚠️ مهم لـ Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});