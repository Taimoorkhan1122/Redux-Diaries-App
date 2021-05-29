import React, {FC, lazy, Suspense} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../rootReducer';

import './App.css';

const Auth = lazy(() => import('../features/auth/Auth'))
const Home = lazy(() => import('../features/Home/Home'))


const App: FC = () => {
  const isLogginIn = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Router>
      <Switch>
        <Route path="/">
          <Suspense fallback={<div>...loadiing </div>}>
            {isLogginIn ? <Home/> : <Auth/>}
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
