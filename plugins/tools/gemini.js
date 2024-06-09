import fetch from "node-fetch"
export default async function handler(m, {
    conn
}) {
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return m.reply('Example: !gemini kapan Indonesia merdeka?')
    }
    try {
        const apiUrl = "https://apiruulzz.my.id/api/ai/gemini-pro?query="
        const res = await fetch(apiUrl + text)
        const json = await res.json()
        m.reply(json.result.replace(/\*\*/g, "*").trim())
    } catch (err) {
        m.reply("Internal server Error!")
    }
}
handler.help = ["gemini < pertanyaan >"]
handler.tags = ["gemini"]
handler.command = ["gemini"]
