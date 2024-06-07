import fetch from "node-fetch";
import cheerio from "cheerio";
import axios from "axios";

let handler = async (m, {
    text,
    usedPrefix,
    command,
    conn
}) => {
    if (!text) throw `Masukkan Link Instagram!\nExample\n${usedPrefix + command} https://www.instagram.com/p/C7X6QDcyQDr/?igsh=cjJsanJwMGkzNTY2`;
    m.reply("Wait...");
    try {
        const result = await instagram(text)
        for (let i of result) {

            if (i.type === "image" ) {
                await conn.sendMessage(m.chat, {
                    image: {
                        url: i.url
                    }, caption: "Instagram Downloader",
                    mentions: [m.sender]
                }, {
                    quoted: m
                })
            } else {
                await conn.sendMessage(m.chat, {
                    video: {
                        url: i.url
                    }, caption: "Instagram Downloader",
                    mentions: [m.sender]
                }, {
                    quoted: m
                })
            }
        }
    } catch (error) {
        m.reply("Terjadi kesalahan silahkan coba nanti");
    }
};
handler.help = ["instagram"];
handler.tags = ["down"];
handler.command = ["instagram", "ig", "igdl"];

export default handler;

async function instagram(url) {
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
