import React from 'react';
import {
  Form,
  Button,
  Dialog,
  Input,
  Select,
  Notification
} from 'element-react';
import { API, graphqlOperation } from 'aws-amplify';

import { createMarket } from '../graphql/mutations';
import { UserContext } from '../App';

class NewMarket extends React.Component {
  state = {
    addMarketDialog: false,
    name: '',
    tags: ['Arts', 'Technology', 'Crafts', 'Entertainment'],
    selectedTags: [],
    options: []
  };

  handleAddMarket = async user => {
    try {
      const { name, selectedTags } = this.state;
      this.setState({ addMarketDialog: false });
      const input = {
        name: name,
        owner: user.username,
        tags: selectedTags
      };
      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      );
      console.log(result);
      console.info(`Created market: id ${result.data.createMarket.id}`);
      this.setState({ name: '', selectedTags: [] });
    } catch (err) {
      console.log('Error adding new market', err);
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error adding market'}`
      });
    }
  };

  handleFilterTags = query => {
    const options = this.state.tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag =>
        tag.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      );
    this.setState({ options });
  };

  render() {
    const { addMarketDialog, name, options } = this.state;
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <>
            <div className='market-header'>
              <h1 className='market-title'>
                Create Your Market Place
                <Button
                  type='text'
                  icon='edit'
                  className='market-title-button'
                  onClick={() => this.setState({ addMarketDialog: true })}
                />
              </h1>

              <Form inline={true} onSubmit={this.props.handleSearch}>
                <Form.Item>
                  <Input
                    placeholder='Search Markets...'
                    icon='circle-cross'
                    value={this.props.searchTerm}
                    onIconClick={this.props.handleClearSearch}
                    onChange={this.props.handleSearchChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='info'
                    icon='search'
                    onClick={this.props.handleSearch}
                    loading={this.props.isSearching}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <Dialog
              title='Create New Market'
              visible={addMarketDialog}
              onCancel={() => this.setState({ addMarketDialog: false })}
              size='large'
              customClass='dialog'
            >
              <Dialog.Body>
                <Form labelPosition='top'>
                  <Form.Item label='Add Market Item'>
                    <Input
                      placeholder='Market Name'
                      trim={true}
                      onChange={name => this.setState({ name })}
                      value={name}
                    />
                  </Form.Item>
                  <Form.Item label='Add Tags'>
                    <Select
                      multiple
                      filterable
                      placeholder='Market Tags'
                      onChange={selectedTags => this.setState({ selectedTags })}
                      remote
                      remoteMethod={this.handleFilterTags}
                    >
                      {options.map(({ label, value }) => (
                        <Select.Option
                          key={value}
                          label={label}
                          value={value}
                        />
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => this.setState({ addMarketDialog: false })}
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  disabled={!this.state.name}
                  onClick={() => this.handleAddMarket(user)}
                >
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog>
          </>
        )}
      </UserContext.Consumer>
    );
  }
}

export default NewMarket;
