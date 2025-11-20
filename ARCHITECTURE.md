# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 5173)                    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │   App.tsx   │  │ PaymentForm  │  │ PaymentMethods  │  │  │
│  │  │             │  │   Component  │  │     List        │  │  │
│  │  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘  │  │
│  │         │                │                    │           │  │
│  │         └────────────────┴────────────────────┘           │  │
│  │                          │                                │  │
│  │                  ┌───────▼────────┐                       │  │
│  │                  │  API Service   │                       │  │
│  │                  │   (Axios)      │                       │  │
│  │                  └───────┬────────┘                       │  │
│  └──────────────────────────┼────────────────────────────────┘  │
│                             │                                   │
│         ┌───────────────────▼────────────────────┐             │
│         │      Stripe Elements (Secure)          │             │
│         │  - Card Input (PCI Compliant)          │             │
│         │  - Client-side Validation              │             │
│         └───────────────────┬────────────────────┘             │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                  Express Backend (Port 3001)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Routes Layer                         │  │
│  │  POST /api/payment/create-payment-intent                 │  │
│  │  GET  /api/payment/payment-methods/:customerId           │  │
│  │  GET  /api/payment/payment-intent/:paymentIntentId       │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │                 Controllers Layer                         │  │
│  │  - createPaymentIntent()                                 │  │
│  │  - getPaymentMethods()                                   │  │
│  │  - getPaymentIntentStatus()                              │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │                  Stripe SDK Layer                         │  │
│  │  - stripe.customers.create()                             │  │
│  │  - stripe.paymentIntents.create()                        │  │
│  │  - stripe.paymentMethods.list()                          │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                              │ Stripe API
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                        Stripe Platform                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - Customer Management                                    │  │
│  │  - Payment Intent Processing                              │  │
│  │  - Card Validation ($0 Pre-Auth)                          │  │
│  │  - Payment Method Storage                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Adding a Payment Method

```
┌──────┐                                                      ┌──────────┐
│ User │                                                      │  Stripe  │
└───┬──┘                                                      └────┬─────┘
    │                                                              │
    │ 1. Enter Email                                              │
    │────────────────────────────────────►                        │
    │         Frontend (React)                                    │
    │                                                              │
    │ 2. POST /create-payment-intent                              │
    │────────────────────────────────────►                        │
    │         Backend (Express)                                   │
    │                                     │                        │
    │                                     │ 3. Create Customer     │
    │                                     │───────────────────────►│
    │                                     │                        │
    │                                     │ 4. Customer ID         │
    │                                     │◄───────────────────────│
    │                                     │                        │
    │                                     │ 5. Create PaymentIntent│
    │                                     │    (amount: 0)         │
    │                                     │───────────────────────►│
    │                                     │                        │
    │                                     │ 6. Client Secret       │
    │                                     │◄───────────────────────│
    │                                     │                        │
    │ 7. Client Secret + Customer ID      │                        │
    │◄────────────────────────────────────│                        │
    │                                                              │
    │ 8. Display Stripe Elements                                  │
    │    (Secure Card Input)                                      │
    │                                                              │
    │ 9. Enter Card Details                                       │
    │    (4242 4242 4242 4242)                                    │
    │                                                              │
    │ 10. stripe.confirmCardPayment()                             │
    │─────────────────────────────────────────────────────────────►│
    │          (Direct to Stripe)                                 │
    │                                                              │
    │                                     11. Validate Card        │
    │                                         ($0 Authorization)   │
    │                                                              │
    │ 12. Payment Method Saved                                    │
    │◄─────────────────────────────────────────────────────────────│
    │     (status: succeeded)                                     │
    │                                                              │
    │ 13. GET /payment-methods/:customerId                        │
    │────────────────────────────────────►                        │
    │         Backend                     │                        │
    │                                     │ 14. List Methods       │
    │                                     │───────────────────────►│
    │                                     │                        │
    │                                     │ 15. Payment Methods    │
    │                                     │◄───────────────────────│
    │ 16. Display Saved Cards             │                        │
    │◄────────────────────────────────────│                        │
    │     (Visa ****4242)                                         │
    │                                                              │
```

## Component Breakdown

### Frontend Components

**App.tsx**
- Main application container
- Manages email input and customer state
- Initializes Stripe Elements
- Coordinates between PaymentForm and PaymentMethodsList

**PaymentForm.tsx**
- Stripe Elements CardElement integration
- Handles card input and validation
- Calls `stripe.confirmCardPayment()` with client secret
- Displays success/error messages

**PaymentMethodsList.tsx**
- Fetches and displays saved payment methods
- Shows card brand, last 4 digits, expiry
- Auto-refreshes after successful payment method addition

### Backend Components

**paymentController.ts**
- `createPaymentIntent()`: Creates customer and $0 payment intent
- `getPaymentMethods()`: Retrieves saved payment methods
- `getPaymentIntentStatus()`: Checks payment intent status

**paymentRoutes.ts**
- Defines API endpoints
- Maps routes to controller functions

**stripe.ts**
- Initializes Stripe SDK with secret key
- Exports configured Stripe instance

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Environment Variables                                │
│     - API keys never in code                             │
│     - Separate test/production keys                      │
│                                                          │
│  2. Stripe Elements (PCI Compliant)                      │
│     - Card data never touches your server                │
│     - Tokenization handled by Stripe                     │
│     - Secure iframe for card input                       │
│                                                          │
│  3. HTTPS Only (Production)                              │
│     - All communication encrypted                        │
│     - Prevents man-in-the-middle attacks                 │
│                                                          │
│  4. CORS Configuration                                   │
│     - Restricts API access to frontend domain            │
│     - Prevents unauthorized requests                     │
│                                                          │
│  5. Helmet Security Headers                              │
│     - XSS protection                                     │
│     - Content Security Policy                            │
│     - Clickjacking prevention                            │
│                                                          │
│  6. Input Validation                                     │
│     - Server-side validation                             │
│     - Type checking with TypeScript                      │
│     - Error handling                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
```
┌─────────────────────────────────────┐
│         Backend Stack                │
├─────────────────────────────────────┤
│ Runtime:      Node.js 18+            │
│ Framework:    Express 4.x            │
│ Language:     TypeScript 5.x         │
│ Payment:      Stripe Node SDK 14.x   │
│ Security:     Helmet, CORS           │
│ Dev Tools:    ts-node-dev            │
└─────────────────────────────────────┘
```

### Frontend
```
┌─────────────────────────────────────┐
│         Frontend Stack               │
├─────────────────────────────────────┤
│ Library:      React 18               │
│ Language:     TypeScript 5.x         │
│ Build Tool:   Vite 5.x               │
│ Styling:      TailwindCSS 3.x        │
│ Payment:      @stripe/stripe-js      │
│               @stripe/react-stripe-js│
│ HTTP Client:  Axios                  │
│ Icons:        Lucide React           │
└─────────────────────────────────────┘
```

## Key Design Decisions

### Why $0 Payment Intent?
- Validates card without charging
- No authorization hold on customer's statement
- Saves payment method for future use
- Simpler than Setup Intents for this use case

### Why Stripe Elements?
- PCI compliance out of the box
- Card data never touches your server
- Built-in validation and error handling
- Consistent UX across devices

### Why TypeScript?
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### Why Separate Backend?
- Keeps secret keys secure
- Enables server-side validation
- Allows for future expansion (webhooks, etc.)
- Better separation of concerns

## Scalability Considerations

For production deployment, consider:

1. **Database**: Add PostgreSQL/MongoDB for customer data
2. **Authentication**: Implement JWT or session-based auth
3. **Rate Limiting**: Prevent API abuse
4. **Logging**: Structured logging with Winston/Pino
5. **Monitoring**: Error tracking with Sentry
6. **Caching**: Redis for frequently accessed data
7. **Load Balancing**: Multiple backend instances
8. **CDN**: Serve frontend assets via CDN
9. **Webhooks**: Handle Stripe events asynchronously
10. **Testing**: Unit tests, integration tests, E2E tests
