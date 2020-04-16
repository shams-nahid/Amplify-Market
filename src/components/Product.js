import React from 'react';
import { S3Image } from 'aws-amplify-react';
import {
  Notification,
  Popover,
  Button,
  Dialog,
  Card,
  Form,
  Input,
  Radio
} from 'element-react';

import PayButton from './PayButton';
import { UserContext } from '../App';
import { convertCentsToDollars } from '../utils/index';

class Product extends React.Component {
  state = {
    updateProductDialog: false
  };

  render() {
    const { product } = this.props;
    return (
      <UserContext.Consumer>
        {({ user }) => {
          const isProductOwner = user && user.attributes.sub === product.owner;
          return (
            <div className='card-container'>
              <Card bodyStyle={{ padding: 0, minWidth: '200px' }}>
                <S3Image
                  imgKey={product.file.key}
                  theme={{
                    photoImg: { maxWidth: '100%', maxHeight: '100%' }
                  }}
                />
                <div className='card-body'>
                  <h3 className='m-0'>{product.description}</h3>
                  <div className='items-center'>
                    <img
                      src={`https://icon.now.sh/${
                        product.shipped ? 'markunread_mailbox' : 'mail'
                      }`}
                      alt='shipped_icon'
                      className='icon'
                    />
                    {product.shipped ? 'Shipped' : 'Emailed'}
                  </div>
                  <div className='text-right'>
                    <span className='mx-1'>
                      ${convertCentsToDollars(product.price)}
                    </span>
                    {!isProductOwner && <PayButton />}
                  </div>
                </div>
              </Card>
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default Product;
