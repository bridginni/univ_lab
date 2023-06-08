import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import PostListPage from './PostListPage';
import PostPage from './PostPage';
import CreatePostPage from './CreatePostPage';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Lab
              </Link>
            </Typography>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              LogIn
            </Link>
            <Link to="/registration" style={{ color: 'white', textDecoration: 'none', marginLeft: '16px' }}>
              SignIn
            </Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginLeft: '16px' }}>
              Profile
            </Link>
            <Link to="/posts" style={{ color: 'white', textDecoration: 'none', marginLeft: '16px' }}>
              Posts
            </Link>
          </Toolbar>
        </AppBar>

        <Container sx={{ marginTop: '32px' }}>
          <Switch>
            <Route exact path="/" component={PostListPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/registration" component={RegistrationPage} />
            <Route path="/profile" component={UserProfilePage} />
            <ProtectedRoute path="/create-post" component={CreatePostPage} />
            <Route exact path="/posts" component={PostListPage} />
            <Route exact path="/posts/:id" component={Post} />
          </Switch>
        </Container>
      </Router>
  );
};

export default App;