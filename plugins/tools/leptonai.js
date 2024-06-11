import axios from "axios"
export default async function handler(m, {
    conn,
    args
}) {
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return m.reply('Example: !leptonai kapan Indonesia merdeka?')
    }
    try {
        const res = await leptonAi(text)
        m.reply(res)
    } catch (err) {
        m.reply("Internal server Error!")
    }
}
handler.help = ["leptonai < pertanyaan >"]
handler.tags = ["ai"]
handler.command = ["leptonai", "lepton"]

/* New Line */
function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomID = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    return randomID;
}
const api = axios.create({
    baseURL: 'https://search.lepton.run/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});
/**
 * Scraper By QanyPaw
 * Forbidden to sell and delete my wm, respect the creator
 */
async function leptonAi(query) {
    try {
        const rid = generateRandomID(10);
        const postData = {
            query,
            rid
        };
        const response = await api.post('query', postData);
        const llmResponseRegex = /__LLM_RESPONSE__([\s\S]*?)__RELATED_QUESTIONS__/;
        const llmResponseMatch = response.data.match(llmResponseRegex);
        if (llmResponseMatch && llmResponseMatch[1]) {
            let llmResponse = llmResponseMatch[1].trim();
            llmResponse = llmResponse.replace(/__LLM_RESPONSE__|__RELATED_QUESTIONS__/g, '').trim();
            return llmResponse;
        } else {
            throw new Error("No LLM response found.");
        }
    } catch (error) {
        throw new Error('Error fetching LLM response: ' + error.message);
    }
  }
