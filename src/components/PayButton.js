import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Notification, Message } from 'element-react';

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey: 'pk_test_WrUREODJMeeD71YVWPChhOOM'
};

const PayButton = ({ product, user }) => {
  const { currency, publishableAPIKey } = stripeConfig;
  const { description, price, shipped } = product;
  return (
    <StripeCheckout
      email={user.attributes.email}
      name={description}
      amount={price}
      currency={currency}
      stripeKey={publishableAPIKey}
      shippingAddress={shipped}
      billingAddress={shipped}
      locale='auto'
    />
  );
};

export default PayButton;
