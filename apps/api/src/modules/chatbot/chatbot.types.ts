export enum ChatIntent {
  GREETING = 'GREETING',
  BROWSE_CATALOG = 'BROWSE_CATALOG',
  SEARCH_PRODUCT = 'SEARCH_PRODUCT',
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  VIEW_CART = 'VIEW_CART',
  INFORM_ADDRESS = 'INFORM_ADDRESS',
  CALCULATE_DELIVERY = 'CALCULATE_DELIVERY',
  CHOOSE_PAYMENT = 'CHOOSE_PAYMENT',
  CONFIRM_ORDER = 'CONFIRM_ORDER',
  ORDER_STATUS = 'ORDER_STATUS',
  HUMAN_SUPPORT = 'HUMAN_SUPPORT',
  CANCEL = 'CANCEL',
  UNKNOWN = 'UNKNOWN',
}

export enum ConversationStage {
  START = 'START',
  DISCOVERY = 'DISCOVERY',
  BUILDING_CART = 'BUILDING_CART',
  WAITING_ADDRESS = 'WAITING_ADDRESS',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  ORDER_CREATED = 'ORDER_CREATED',
  HUMAN_HANDOFF = 'HUMAN_HANDOFF',
  CLOSED = 'CLOSED',
}

export type ChatChannel = 'WHATSAPP' | 'WEBCHAT' | 'ADMIN';

export interface IncomingChatMessage {
  tenantId: string;
  storeId: string;
  customerPhone: string;
  customerName?: string;
  channel: ChatChannel;
  messageId: string;
  text: string;
  receivedAt: Date;
}

export interface CartLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  optionIds?: string[];
  notes?: string;
}

export interface ConversationContext {
  id: string;
  tenantId: string;
  storeId: string;
  customerPhone: string;
  customerName?: string;
  stage: ConversationStage;
  cart: CartLine[];
  deliveryAddress?: string;
  deliveryNeighborhood?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  activeOrderCode?: string;
  lastIntent?: ChatIntent;
  lastMessageId?: string;
  humanRequested: boolean;
  updatedAt: Date;
}

export interface IntentResult {
  intent: ChatIntent;
  confidence: number;
  entities: {
    productQuery?: string;
    quantity?: number;
    address?: string;
    neighborhood?: string;
    paymentMethod?: string;
    orderCode?: string;
  };
}

export interface ChatbotReply {
  text: string;
  stage: ConversationStage;
  intent: ChatIntent;
  requiresHuman: boolean;
  actions: Array<
    | { type: 'SEARCH_CATALOG'; query: string }
    | { type: 'SHOW_CATALOG' }
    | { type: 'CALCULATE_DELIVERY'; address: string }
    | { type: 'SHOW_CART' }
    | { type: 'CREATE_ORDER' }
    | { type: 'CHECK_ORDER'; code?: string }
    | { type: 'HANDOFF'; reason: string }
  >;
}
