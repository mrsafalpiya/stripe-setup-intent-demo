# Changelog

## [1.2.0] - 2025-11-20

### Added - Payment Method Removal

**New Feature:** Users can now remove saved payment methods.

#### What's New?

**Backend:**
- Added `removePaymentMethod` controller function
- New DELETE endpoint: `/api/payment/payment-method/:paymentMethodId`
- Uses Stripe's `paymentMethods.detach()` to remove payment methods from customers

**Frontend:**
- Added delete button (trash icon) to each payment method in the list
- Confirmation dialog before deletion
- Loading state during deletion (spinning icon)
- Automatic UI update after successful deletion
- Error handling for failed deletions

**UX Improvements:**
- Red hover state on delete button for clear visual feedback
- Disabled state while deletion is in progress
- Confirmation prompt to prevent accidental deletions
- Immediate UI update without page refresh

#### Usage

Users can click the trash icon next to any saved payment method to remove it. A confirmation dialog will appear, and upon confirmation, the payment method will be detached from the customer and removed from the UI.

---

## [1.1.0] - 2025-11-20

### Changed - Setup Intent Implementation

**Breaking Change:** Migrated from Payment Intents to Setup Intents for card validation.

#### Why the Change?

Stripe no longer allows creating Payment Intents with `amount: 0`. The error message was:
```
The amount must be greater than or equal to the minimum charge amount allowed for your account and the currency set.
If you want to save a Payment Method for future use without an immediate payment, use a Setup Intent instead.
```

#### What Changed?

**Backend Changes:**
- `paymentController.ts`: Changed from `stripe.paymentIntents.create()` to `stripe.setupIntents.create()`
- Removed `amount` and `currency` parameters (not needed for Setup Intents)
- Changed `setup_future_usage` to `usage: 'off_session'`
- Response now returns `setupIntentId` instead of `paymentIntentId`

**Frontend Changes:**
- `PaymentForm.tsx`: Changed from `stripe.confirmCardPayment()` to `stripe.confirmCardSetup()`
- Updated success message to reflect no charge is made
- Updated types to use `setupIntentId`

**Documentation Updates:**
- Updated all README files to mention Setup Intents
- Changed terminology from "$0 pre-authorization" to "Setup Intent"
- Updated API documentation with correct response format
- Updated UI text to reflect Setup Intent usage

#### Benefits of Setup Intents

1. **Designed for this use case**: Setup Intents are specifically built for saving payment methods without charging
2. **No confusion**: Clearer intent - not trying to charge $0
3. **Better UX**: No authorization hold appears on customer's statement
4. **Stripe recommended**: Official Stripe recommendation for this workflow

#### Migration Guide

If you have existing code using the old Payment Intent approach:

1. **Backend**: Replace `stripe.paymentIntents.create()` with `stripe.setupIntents.create()`
2. **Frontend**: Replace `stripe.confirmCardPayment()` with `stripe.confirmCardSetup()`
3. **Types**: Update `paymentIntentId` to `setupIntentId` in your type definitions
4. **Client Secret**: Setup Intent client secrets start with `seti_` instead of `pi_`

#### No Breaking Changes for End Users

The user experience remains exactly the same:
- Enter email
- Enter card details
- Card is validated
- Payment method is saved
- No charges are made

Only the underlying Stripe API calls changed.

---

## [1.0.0] - 2025-11-20

### Added
- Initial release with full-stack Stripe integration
- Backend API with Express and TypeScript
- Frontend with React, TypeScript, and Vite
- Stripe Elements for secure card input
- Customer management
- Payment method storage and retrieval
- Beautiful UI with TailwindCSS
- Comprehensive documentation
