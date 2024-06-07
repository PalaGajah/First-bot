import axios from "axios"
import fetch from "node-fetch"
import cheerio from "cheerio"

const handler = async (m, {
    args,
    conn
}) => {
    if (!args[0]) {
        return m.reply('Penggunaan:\n!ig < link / url >\n\nContoh: \n!ig https://www.instagram.com')
    }
    if (!/https:\/\/www\.instagram\.com\/reel/i.test(args[0]) && !/https:\/\/www\.instagram\.com\/p/i.test(args[0]) && !/https:\/\/www\.instagram\.com\/tv/i.test(args[0]) && !/https:\/\/www\.instagram\.com\/stories/i.test(args[0])) {
        return m.reply("Failed\nInputan bukan url / link instagram");
    }
    try {
        await m.reply("Wait...")
        const result = await igdl(args[0])
        for (let i of result.data) {
            const mimeType = (await axios(i)).headers["content-type"]

            if (/image/i.test(mimeType)) {
                await conn.sendMessage(m.chat, {
                    image: {
                        url: i
                    }, caption: "Instagram Downloader",
                    mentions: [m.sender]
                }, {
                    quoted: m
                })
            } else {
                await conn.sendMessage(m.chat, {
                    video: {
                        url: i
                    }, caption: "Instagram Downloader",
                    mentions: [m.sender]
                }, {
                    quoted: m
                })
            }
        }
    } catch (e) {
        m.reply("Error saat mendapatkan data!")
    }
}
handler.help = ['instagram / ig < url >']
handler.tags = ['media']
handler.command = ['ig', 'igdl', 'instagram']

export default handler

async function igdl(url) {
    try {
        const resp = await axios.post("https://saveig.app/api/ajaxSearch", new URLSearchParams({
            q: url,
            t: "media",
            lang: "id"
        }), {
            headers: {
                accept: "*/*",
                "user-agent": "PostmanRuntime/7.32.2"
            }
        })
        let result = {
            status: true,
            data: []
        }
        const $ = cheerio.load(resp.data.data)
        $(".download-box > li > .download-items").each(function() {
            result.data.push($(this).find(".download-items__btn > a").attr("href"))
        })
        return result
    } catch {
        const result = {
            status: false,
            message: "Couldn't fetch data of url"
        }
        console.log(result)
        return result
    }
}

async function igdlv2(url) {
    try {
        let result = {
            status: true,
            media: []
        }
        const {
            data
        } = await axios(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
            method: "post",
            data: {
                k_query: url,
                k_page: "Instagram",
                hl: "id",
                q_auto: 0
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "PostmanRuntime/7.32.2"
            }
        })
        await data.links.video.map((video) => result.media.push(video.url))
        return result
    } catch (err) {
        const result = {
            status: false,
            message: `Media not found`
        }
        return result
    }
}

async function igdlv3(url) {
    let res = await axios("https://indown.io/");
    let _$ = cheerio.load(res.data);
    let referer = _$("input[name=referer]").val();
    let locale = _$("input[name=locale]").val();
    let _token = _$("input[name=_token]").val();
    let {
        data
    } = await axios.post("https://indown.io/download", new URLSearchParams({
        link: url,
        referer,
        locale,
        _token,
    }), {
        headers: {
            cookie: res.headers["set-cookie"].join("; "),
        },
    });
    let $ = cheerio.load(data);
    let result = [];
    let __$ = cheerio.load($("#result").html());
    __$("video").each(function() {
        let $$ = $(this);
        result.push({
            type: "video",
            thumbnail: $$.attr("poster"),
            url: $$.find("source").attr("src"),
        });
    });
    __$("img").each(function() {
        let $$ = $(this);
        result.push({
            type: "image",
            url: $$.attr("src"),
        });
    });
    return result;
                    }
