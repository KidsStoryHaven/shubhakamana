export type { Festival, FestivalFAQ } from './data/festivals';

export type FestivalCategory = 'all' | 'festival' | 'god' | 'celebration' | 'daily';

export interface UserWishData {
  senderName: string;
  senderPhoto?: string;
  festivalId: string;
  customMessage?: string;
}
