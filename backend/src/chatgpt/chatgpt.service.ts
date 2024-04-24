import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from 'src/config/secrets';

@Injectable()
export class ChatgptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  async promptChat(prompt: string) {
    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });

    if (response.choices.length) {
      const message = response.choices[0]?.message?.content;
      if (message) {
        return JSON.parse(message);
      }
    }

    return '';
  }
}
