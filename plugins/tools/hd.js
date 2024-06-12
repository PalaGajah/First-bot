const handler = async (m, {
    command,
    text,
    conn: sock,
}) => {
    if (command == "emi") {
        const userInput = m.quoted ? (m.quoted.mtype === "extendedTextMessage" || m.quoted.mtype !== "extendedTextMessage") && text ? text : m.quoted.text : text ? text : ""
        if (userInput) {
           return m.reply("Example: !emi 1 girl, solo, best quality, masterpiece")
        }
        m.reply("Tunggu sebentar...")
        const res = await request("/ai/emi?prompt=" + userInput)
        sock.sendMessage(m.chat, { image: { url: res.result }, caption: userInput, mentions: [m.sender] }, { quoted: m })
    }
    
    if (command == "pixelart") {
        const userInput = m.quoted ? (m.quoted.mtype === "extendedTextMessage" || m.quoted.mtype !== "extendedTextMessage") && text ? text : m.quoted.text : text ? text : ""
        if (userInput) {
           return m.reply("Example: !pixelart 1 girl, solo, best quality, masterpiece")
        }
        m.reply("Tunggu sebentar...")
        const res = await request("/ai/pixelart?prompt=" + userInput)
        sock.sendMessage(m.chat, { image: { url: res.result }, caption: userInput, mentions: [m.sender] }, { quoted: m })
    }    
    
    if (command == "txt2img") {
        const userInput = m.quoted ? (m.quoted.mtype === "extendedTextMessage" || m.quoted.mtype !== "extendedTextMessage") && text ? text : m.quoted.text : text ? text : ""
        if (userInput) {
           return m.reply("Example: !txt2img 1 girl, solo, best quality, masterpiece")
        }
        m.reply("Tunggu sebentar...")
        const res = await request("/ai/playground-v2.5-1024px-aesthetic?prompt=" + userInput)
        sock.sendMessage(m.chat, { image: { url: res.result }, caption: userInput, mentions: [m.sender] }, { quoted: m })
    }        
    
    if (command == "hd") {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || typeof q.message === "undefined" ? q : q.message.documentMessage).mimetype || q.mediaType || ''
        if (!/image/.test(mime)) {
            return m.reply("Balas pesan bertipe image dengan caption: !hd")    
        }
        m.reply("Tunggu sebentar...")
        const res = await request("/tools/esregan?url=" + image_url + "&type=base")
        sock.sendMessage(m.chat, { image: { url: res.result.img }, mentions: [m.sender] }, { quoted: m })
    }           
}
handler.command = ["emi", "pixelart", "txt2img", "hd"]
handler.tags = ["media"]
handler.help = ["emi < prompt >", "pixelart < prompt >", "txt2img < prompt >", "hd < balas image >"]

export default handler

async function request(path) {
    try {
        const baseUrl = "https://itzpire.com"
        const response = await fetch(baseUrl + path)
        if (!response.ok) {
            throw new Error("HTTP error! status:" + response.status);
        }
        const json = await response.json()
        return json
    } catch (err) {
        throw new Error("Error fetcing data: " + err)
    }
             }
