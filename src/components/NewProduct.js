import React from 'react';
import {
  Form,
  Button,
  Input,
  Notification,
  Radio,
  Progress
} from 'element-react';
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import { PhotoPicker } from 'aws-amplify-react';

import { createProduct } from '../graphql/mutations';
import aws_exports from '../aws-exports';
import { convertDollarsToCents } from '../utils';

const initialState = {
  description: '',
  price: '',
  shipped: false,
  imagePreview: '',
  image: '',
  isUploading: false,
  percentUploaded: 0
};

class NewProduct extends React.Component {
  state = {
    ...initialState
  };

  handleAddProduct = async () => {
    try {
      const { image, description, shipped, price } = this.state;
      this.setState({ isUploading: true });
      const visibility = 'public';
      const { identityId } = await Auth.currentCredentials();
      const filename = `/${visibility}/${identityId}/${Date.now()}-${
        image.name
      }`;
      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: progress => {
          const percentUploaded = Math.round(
            (progress.loaded / progress.total) * 100
          );
          this.setState({ percentUploaded });
        }
      });
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_user_files_s3_bucket_region
      };
      const input = {
        productMarketId: this.props.marketId,
        description,
        shipped,
        price: convertDollarsToCents(price),
        file
      };
      await API.graphql(graphqlOperation(createProduct, { input }));
      Notification({
        title: 'Success',
        message: 'Product successfully created!',
        type: 'success'
      });
      this.setState({ ...initialState });
    } catch (error) {
      console.log(error);
      Notification({
        title: 'Error',
        message: 'Error in creating product',
        type: 'success'
      });
    }
  };

  render() {
    const {
      description,
      price,
      image,
      shipped,
      imagePreview,
      isUploading,
      percentUploaded
    } = this.state;
    return (
      <div className='flex-center'>
        <h2 className='header'>Add New Product</h2>
        <div>
          <Form className='market-header'>
            <Form.Item label='Add Product Description'>
              <Input
                type='text'
                icon='information'
                placeholder='Description'
                value={description}
                onChange={description => this.setState({ description })}
              />
            </Form.Item>
            <Form.Item label='Set Product Price'>
              <Input
                type='number'
                icon='plus'
                placeholder='Price (USD)'
                description={price}
                onChange={price => this.setState({ price })}
              />
            </Form.Item>
            <Form.Item label=''>
              <div className='text-center'>
                <Radio
                  value='false'
                  checked={shipped === true}
                  onChange={() => this.setState({ shipped: true })}
                >
                  Shipped
                </Radio>
                <Radio
                  value='true'
                  checked={shipped === false}
                  onChange={() => this.setState({ shipped: false })}
                >
                  Emailed
                </Radio>
              </div>
            </Form.Item>
            {imagePreview && (
              <img
                className='image-preview'
                src={imagePreview}
                alt='Product Preview'
              />
            )}
            {percentUploaded > 0 && (
              <Progress
                type='circle'
                className='progress'
                percentage={percentUploaded}
              />
            )}
            <PhotoPicker
              title='Product Image'
              preview='hidden'
              onLoad={url => this.setState({ imagePreview: url })}
              onPick={file => this.setState({ image: file })}
              theme={{
                formContainer: {
                  margin: 0,
                  padding: '0.8em'
                },
                formSection: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                sectionBody: {
                  margin: {
                    margin: 0,
                    width: '250em'
                  },
                  sectionHeader: {
                    padding: '0.2em',
                    color: 'var(--darkAmazonOrange)'
                  }
                },
                photoPickerButton: {
                  display: 'none'
                }
              }}
            />
            <Form.Item>
              <Button
                type='primary'
                onClick={this.handleAddProduct}
                disabled={!image || !description || !price || isUploading}
                loading={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add Product'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default NewProduct;
