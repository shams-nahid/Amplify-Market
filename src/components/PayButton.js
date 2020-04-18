import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Notification, Message } from 'element-react';
import { API, graphqlOperation } from 'aws-amplify';

import { getUser } from '../graphql/queries';
import { createOrder } from '../graphql/mutations';
import { history } from '../App';

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey: 'pk_test_WrUREODJMeeD71YVWPChhOOM'
};

const PayButton = ({ product, user }) => {
  const { currency, publishableAPIKey } = stripeConfig;
  const { description, price, shipped, owner } = product;

  const getOwnerEmail = async ownerId => {
    try {
      const input = { id: ownerId };
      const result = await API.graphql(graphqlOperation(getUser, input));
      return result.data.getUser.email;
    } catch (error) {
      console.error(`Error fetching in get owner detail`, error);
    }
  };

  const createShippingAddress = source => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip
  });

  const handleCharge = async token => {
    try {
      const ownerEmail = await getOwnerEmail(owner);
      console.log({ ownerEmail });
      const result = await API.post('orderlamda', '/charge', {
        headers: { 'Content-Type': 'application/json' },
        body: {
          token,
          charge: { currency, amount: price, description },
          email: {
            customerEmail: user.attributes.email,
            ownerEmail,
            shipped: shipped
          }
        }
      });
      console.log({ result });
      if (result.charge.status === 'succeeded') {
        let shippingAddress = null;
        if (product.shipped) {
          shippingAddress = createShippingAddress(result.charge.source);
        }
        console.log({ shippingAddress });
        const input = {
          orderUserId: user.attributes.sub,
          orderProductId: product.id,
          shippingAddress
        };
        const order = await API.graphql(
          graphqlOperation(createOrder, {
            input
          })
        );
        console.log({ order });
        Notification({
          title: 'Success',
          message: `${result.message}`,
          type: 'success',
          duration: 3000
        });
        setTimeout(() => {
          history.push('/');
          Message({
            type: 'info',
            message: 'Check your verified email for order details',
            duration: 5000,
            showClose: true
          });
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        title: 'Error',
        message: `${error.message || 'Error processing order'}`
      });
    }
  };
  return (
    <StripeCheckout
      token={handleCharge}
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
