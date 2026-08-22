import { Client } from '@twilio/conversations';

export class TwilioService {
  private static instance: TwilioService;
  private client: Client | null = null;

  private constructor() {}

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  public async initializeClient(token: string): Promise<Client> {
    this.client = new Client(token);
    return new Promise((resolve, reject) => {
      this.client?.on('stateChanged', (state) => {
        if (state === 'initialized') {
          resolve(this.client!);
        }
        if (state === 'failed') {
          reject(new Error('Twilio Client initialization failed'));
        }
      });
    });
  }

  public getClient(): Client | null {
    return this.client;
  }
}

export const twilioService = TwilioService.getInstance();
