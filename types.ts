
export enum RecipientStatus {
  PENDING = 'PENDING',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export interface Recipient {
  id: string;
  name?: string;
  number: string;
  status: RecipientStatus;
  personalizedMessage: string;
}
