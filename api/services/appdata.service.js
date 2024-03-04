import pool from '../db/connection.js'
import { ApiError } from '../utils/index.js'
import gplay from "google-play-scraper";
import { appData } from '../queries/queries.js';
import openai from '../db/Openai.js';

class appdataService {

    appdataservice = async (body, user) => {
        try {
            const mail_id = user.mail_id;
            console.log(user, "---------------->gmail")
            const resp = await pool.query(appData.getapp_id, [mail_id])
            if (resp?.rows?.length) {
                console.log(resp.rows[0].app_id, "-------------------->appid")

                const result = await gplay.app({
                    appId: resp?.rows[0]?.app_id
                });

                const description = result?.description
                const title = result?.title
                const developer_mail = result?.developerEmail
                const checkprompt = await pool.query(appData.checkprompt, [mail_id])
                if (checkprompt?.rows[0]?.prompt === null) {
                    const chatCompletion = await openai.chat.completions.create({
                        messages: [{ role: 'user', content: `please summarize the company description in 60 words: ${description}` }],
                        model: 'gpt-3.5-turbo',
                    });

                    const chat_resp = chatCompletion?.choices[0]?.message?.content
                    const prompt = `GPT, you are the online reputation manager for ${title}. ${chat_resp} Your task is to respond to Play Store reviews. Keep your responses under 350 characters, personal, and engaging. I'll provide you with feedback, and occasionally, a Username. Your goal is to generate a thoughtful and personalized reply. Include the name ${developer_mail} when provided. Now, generate a compelling reply to the user's review in English and keep it random without any emojis`
                    const insert_data = await pool.query(appData.insert_prompt, [prompt, mail_id])
                }

                const result1 = await gplay.reviews({
                    appId: resp?.rows[0]?.app_id,
                    sort: gplay.sort.HELPFULNESS,
                    lang: "en",
                    country: "us",
                    paginate: true,
                    num: 5,
                    nextPaginationToken: null // you can omit this parameter
                })
                return { appData: result, reviews: result1 }
            }

        } catch (error) {
            console.error('error @ appdata service', error);
            throw new ApiError(500, error)
        }
    }

    replyservice = async (body, user) => {
        try {

            const mail_id = user.mail_id;
            const prom = await pool.query(appData.getPrompt, [mail_id])
            console.log(body);
            if (prom?.rows[0]?.prompt !== null) {
                const chatCompletion = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: `${prom} username: ${body?.userName} review: ${body?.review}` }],
                    model: 'gpt-3.5-turbo',
                });

                const reply = chatCompletion?.choices[0]?.message?.content
                return reply
            }
            else {
                throw new ApiError(400, 'Prompt Not Exist')
            }

        } catch (error) {
            console.error('error @ reply service', error);
            throw new ApiError(500, error)
        }
    }

}

export default new appdataService()
