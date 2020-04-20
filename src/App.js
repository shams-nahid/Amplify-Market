import React from 'react';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import './App.css';
import { getUser } from './graphql/queries';
import { registerUser } from './graphql/mutations';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import Navbar from './components/Navbar';

export const history = createBrowserHistory();
export const UserContext = React.createContext();

class App extends React.Component {
  state = {
    user: null,
    userAttributes: null
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user
      ? this.setState({ user }, () => this.getUserAttributes(this.state.user))
      : this.setState({ user: null });
  };

  getUserAttributes = async authUserData => {
    const attributesArr = await Auth.userAttributes(authUserData);
    const attributesObj = Auth.attributesToObject(attributesArr);
    this.setState({ userAttributes: attributesObj });
  };

  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        this.getUserData();
        this.registerNewUser(capsule.payload.data);
        break;
      case 'signUp':
        console.log('Signed Up');
        this.setState({ user: null });
        break;
      case 'signOut':
        console.log('signed out');
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };

  registerNewUser = async signInData => {
    const { email, sub } = signInData.signInUserSession.idToken.payload;
    const { username } = signInData;
    const getUserInput = {
      id: sub
    };
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    if (!data.getUser) {
      try {
        const registerUserInput = {
          id: sub,
          username,
          email,
          registered: true
        };
        const newUser = await API.graphql(
          graphqlOperation(registerUser, { input: registerUserInput })
        );
        console.log(newUser);
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error('Error signing out user', err);
    }
  };

  render() {
    const { user, userAttributes } = this.state;
    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <UserContext.Provider value={{ user, userAttributes }}>
        <Router history={history}>
          <>
            <Navbar user={user} handleSignOut={this.handleSignOut} />
            <div className='app-container'>
              <Route exact path='/' component={HomePage} />
              <Route
                exact
                path='/profile'
                component={() => (
                  <ProfilePage user={user} userAttributes={userAttributes} />
                )}
              />
              <Route
                exact
                path='/markets/:marketId'
                component={({ match }) => (
                  <MarketPage
                    user={user}
                    userAttributes={userAttributes}
                    marketId={match.params.marketId}
                  />
                )}
              />
            </div>
          </>
        </Router>
      </UserContext.Provider>
    );
  }
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#ffc0cb'
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'var(--amazonOrange)'
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '5px'
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: 'var(--squidInk)'
  }
};

// export default withAuthenticator(App, true, [], null, theme);
export default App;
