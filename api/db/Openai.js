import OpenAI from 'openai';
import config from '../config/config.js';

const openai = new OpenAI({
    apiKey: config.open_ai_key // This is the default and can be omitted
});

export default openai