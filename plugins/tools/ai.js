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
        return m.reply('Example: !ai kapan Indonesia merdeka?')
    }
    try {
        const apiUrl = "https://aemt.me/openai?text="
        const res = await fetch(apiUrl + text)
        const json = await res.json()
        m.reply(json.result)
    } catch (err) {
        m.reply("Internal server Error!")
    }
}
handler.help = ["ai < pertanyaan >"]
handler.tags = ["ai"]
handler.command = ["ai"]
