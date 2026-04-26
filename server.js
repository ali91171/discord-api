import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const BOT_TOKEN = "MTEyMDQxNDk3MzIzNjEwMTI2Mw.Gj6BWe.C1_0Jr1xrG1fdwcZW7F90eSH2_EDRW-8B-Z1n4";

app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    });

    const data = await response.json();

    let avatar = "";

    if (data.avatar) {
      avatar = `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.png?size=256`;
    } else {
      avatar = `https://cdn.discordapp.com/embed/avatars/0.png`;
    }

    res.json({
      name: data.username,
      avatar: avatar
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});