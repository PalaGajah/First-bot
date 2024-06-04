import formData from 'form-data'
import fetch from "node-fetch"
import axios from "axios"

const handler = async (m, {
    args,
    conn
}) => {
    if (!args[0]) return m.reply('Penggunaan:\n!tiktok < link / url >\n\nContoh: \n!tiktok https://vm.tiktok.com');
    if (!(/https:\/\/vm\.tiktok\.com/i.test(args[0]) || /https:\/\/vt\.tiktok\.com/i.test(args[0]) || /https:\/\/www\.tiktok\.com/i.test(args[0]) || /https:\/\/t\.tiktok\.com/i.test(args[0]))) return m.reply("Failed\nInputan bukan url / link tiktok")
    try {
        m.reply("Tunggu sebentar...")
        const apiUrl = 'https://api.tiklydown.eu.org/api/download?url='
        const response = await fetch(apiUrl + args[0])
        const data = await response.json()
        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                await conn.sendMessage(m.chat, {
                    image: {
                        url: data.images[i].url
                    },
                    caption: (i + 1) + "/" + data.images.length,
                    mentions: [m.sender]
                }, {
                    quoted: m,
                    mimetype: "image/png"
                })
            }
        } else {
            await conn.sendFile(m.chat, data.video.noWatermark, "", "Tiktok Downloader v1", m)
        }
    } catch (e) {
        try {
            const apiUrl = 'https://tools.betabotz.org/tools/tiktokdl?url=' + args[0]
            const response = await fetch(apiUrl + args[0])
            const data = await response.json()
            if (data.images) {
                for (let i = 0; i < data.result.data.images; i++) {
                    await conn.sendMessage(m.chat, {
                        image: {
                            url: data.result.data.images[i]
                        },
                        caption: (i + 1) + "/" + data.result.data.images.length,
                        mentions: [m.sender]
                    }, {
                        quoted: m,
                        mimetype: "image/png"
                    })
                }
            } else {
                await conn.sendFile(m.chat, data.result.data.play, "", "Tiktok Downloader v2", m)
            }
        } catch (e) {
            try {
                const response = await tiktok(args[0])
                if (response.type === "image") {
                    for (let i = 0; i < response.images.length; i++) {
                        await conn.sendMessage(m.chat, {
                            image: {
                                url: response.images[i]
                            },
                            caption: (i + 1) + "/" + response.images.length,
                            mentions: [m.sender]
                        }, {
                            quoted: m,
                        })
                    }
                } else {
                    await conn.sendFile(m.chat, response.video.server1, "", "Tiktok Downloader v3", m)
                }
            } catch (e) {
               throw e
            }
        }
    }
}
handler.help = ['tiktok < url >'];
handler.tags = ['downloader'];
handler.command = ['tiktok','tt']

export default handler

async function tiktok(url) {
  let result = {}
  const bodyForm = new formData()
  bodyForm.append("q", url)
  bodyForm.append("lang", "id")
  try {
    const { data } = await axios(`https://savetik.co/api/ajaxSearch`, {
      method: "post",
      data: bodyForm,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2"
      }
    })
    let $ = cheerio.load(data.data)
    if ($("div.video-data > .photo-list").length === 0) {
      result.status = true
      result.type = "video"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.video = {}
      result.video.server1 = $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
      result.video.server2 = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.video.serverHD = $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href")
    } else {
      result.status = true
      result.type = "image"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.images = []
      $("div.video-data > .photo-list > ul > li").each(function () {
        result.images.push($(this).find("div > div:nth-child(2) > a").attr("href"))
      })
    }
    return result
  } catch (err) {
    result.status = false
    result.message = "Video not found!"
    console.log(result)
    return result
  }
  }
