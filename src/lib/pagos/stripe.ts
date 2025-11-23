// Utilidades para integración con Stripe
// Para implementación completa, instalar: bun add stripe

interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  publishableKey: string;
}

// Configuración de Stripe
export const stripeConfig: StripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};

// Tipos para pagos
export interface CreatePaymentIntentParams {
  amount: number; // en centavos
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

// Funciones de utilidad para Stripe
export class StripeService {
  // Crear un PaymentIntent para cobro único
  static async createPaymentIntent(params: CreatePaymentIntentParams) {
    // Implementación real usando Stripe SDK
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.paymentIntents.create({
    //   amount: params.amount,
    //   currency: params.currency,
    //   customer: params.customerId,
    //   metadata: params.metadata,
    // });

    // Simulación para desarrollo
    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: params.amount,
      currency: params.currency,
      status: 'requires_payment_method',
    };
  }

  // Crear un cliente en Stripe
  static async createCustomer(params: CreateCustomerParams) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.customers.create({
    //   email: params.email,
    //   name: params.name,
    //   metadata: params.metadata,
    // });

    return {
      id: `cus_${Math.random().toString(36).substr(2, 9)}`,
      email: params.email,
      name: params.name,
    };
  }

  // Crear una suscripción
  static async createSubscription(params: CreateSubscriptionParams) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.subscriptions.create({
    //   customer: params.customerId,
    //   items: [{ price: params.priceId }],
    //   metadata: params.metadata,
    // });

    return {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      customer: params.customerId,
      status: 'active',
      current_period_start: Date.now() / 1000,
      current_period_end: (Date.now() / 1000) + (30 * 24 * 60 * 60), // +30 días
    };
  }

  // Cancelar una suscripción
  static async cancelSubscription(subscriptionId: string) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.subscriptions.cancel(subscriptionId);

    return {
      id: subscriptionId,
      status: 'canceled',
      canceled_at: Date.now() / 1000,
    };
  }

  // Obtener información de un cliente
  static async getCustomer(customerId: string) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.customers.retrieve(customerId);

    return {
      id: customerId,
      email: 'cliente@example.com',
      name: 'Cliente Ejemplo',
    };
  }

  // Listar facturas de un cliente
  static async listInvoices(customerId: string) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // return await stripe.invoices.list({ customer: customerId });

    return {
      data: [],
      has_more: false,
    };
  }

  // Procesar webhook de Stripe
  static async handleWebhook(payload: string, signature: string) {
    // const stripe = new Stripe(stripeConfig.secretKey);
    // const event = stripe.webhooks.constructEvent(
    //   payload,
    //   signature,
    //   stripeConfig.webhookSecret
    // );

    // Manejar diferentes tipos de eventos
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     // Pago exitoso
    //     break;
    //   case 'payment_intent.payment_failed':
    //     // Pago fallido
    //     break;
    //   case 'customer.subscription.updated':
    //     // Suscripción actualizada
    //     break;
    //   case 'customer.subscription.deleted':
    //     // Suscripción cancelada
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    return { received: true };
  }

  // Calcular MRR (Monthly Recurring Revenue)
  static calculateMRR(subscriptions: any[]): number {
    return subscriptions.reduce((total, sub) => {
      // Convertir cualquier período a mensual
      const amount = sub.amount || 0;
      const interval = sub.interval || 'month';

      if (interval === 'year') {
        return total + (amount / 12);
      }
      if (interval === 'month') {
        return total + amount;
      }
      return total;
    }, 0);
  }

  // Calcular ARR (Annual Recurring Revenue)
  static calculateARR(mrr: number): number {
    return mrr * 12;
  }

  // Calcular tasa de retención
  static calculateRetentionRate(
    customersStart: number,
    customersEnd: number,
    customersAcquired: number
  ): number {
    if (customersStart === 0) return 0;
    return ((customersEnd - customersAcquired) / customersStart) * 100;
  }

  // Calcular churn rate (tasa de cancelación)
  static calculateChurnRate(
    customersStart: number,
    customersLost: number
  ): number {
    if (customersStart === 0) return 0;
    return (customersLost / customersStart) * 100;
  }
}

// Constantes de Stripe
export const STRIPE_PLANS = {
  BASICO: {
    name: 'Básico',
    priceId: process.env.STRIPE_PRICE_BASICO || 'price_basico',
    amount: 800,
    interval: 'month',
  },
  PROFESIONAL: {
    name: 'Profesional',
    priceId: process.env.STRIPE_PRICE_PROFESIONAL || 'price_profesional',
    amount: 1500,
    interval: 'month',
  },
  EMPRESARIAL: {
    name: 'Empresarial',
    priceId: process.env.STRIPE_PRICE_EMPRESARIAL || 'price_empresarial',
    amount: 2500,
    interval: 'month',
  },
};

// Tipos de webhooks de Stripe
export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
} as const;
