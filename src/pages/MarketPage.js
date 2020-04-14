import React from 'react';
import { Loading, Tabs, Icon } from 'element-react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';

import { getMarket } from '../graphql/queries';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isOwner: false
  };

  componentDidMount() {
    this.handleGetMarket();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    };
    const result = await API.graphql(graphqlOperation(getMarket, input));
    console.log(result);
    this.setState({ market: result.data.getMarket, isLoading: false }, () =>
      this.checkMarketOwner()
    );
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;
    if (user) {
      this.setState({ isMarketOwner: user.username === market.owner });
    }
  };

  render() {
    const { market, isLoading, isMarketOwner } = this.state;
    return isLoading ? (
      <Loading fullscreen />
    ) : (
      <>
        <Link className='link' to='/'>
          Back to Markets List
        </Link>
        <span className='items-center pt-2'>
          <h2 className='mb-mr'>{market.name}</h2>- {market.owner}
        </span>
        <div className='items-center pt-2'>
          <span style={{ color: 'var(--lightSquidInk)', paddingBottom: '1em' }}>
            <Icon name='date' className='icon' />
            {market.createdAt}
          </span>
        </div>

        <Tabs type='border-card' value={isMarketOwner ? '1' : '2'}>
          {isMarketOwner && (
            <Tabs.Pane
              label={
                <>
                  <Icon name='plus' className='icon' />
                  Add Product
                </>
              }
              name='1'
            >
              <NewProduct marketId={this.props.marketId} />
            </Tabs.Pane>
          )}
          <Tabs.Pane
            label={
              <>
                <Icon name='menu' className='icon' />
                Products ({market.products.items.length})
              </>
            }
            name='2'
          >
            {/* {market.products.items.map(product => (
              <Product product={product} />
            ))} */}
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default MarketPage;
