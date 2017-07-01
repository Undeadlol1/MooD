// PAGES
import Layout from './pages/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import MoodPage from './pages/MoodPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import store from 'browser/redux/store'
import { fetchMoods, fetchMood } from 'browser/redux/actions/MoodActions'
import { fetchNode, actions as nodeActions } from 'browser/redux/actions/NodeActions'

const routesConfig = {
  path: '/',
  component: Layout,
  indexRoute: {
    component: IndexPage,
    // fetch data
    onEnter({params}, replace, callback) {
      const fetchedMoods = store.getState().mood.get('moods')
      // check if fetching is needed
      if (fetchedMoods.size) return callback()
      else {
        store
        .dispatch(fetchMoods())
        .then(() => callback())
      }
    }
  },
  childRoutes: [
    { path: 'login', component: LoginPage },
    { path: 'users/(:username)', component: UserPage },
    {
      component: MoodPage,
      path: 'mood/(:moodSlug)',
      // fetch data
      onEnter({params}, replace, callback) {
        Promise
        .all([
          store.dispatch(fetchMood(params.moodSlug)),
          store.dispatch(fetchNode(params.moodSlug)),
        ])
        .then(() => callback())
      }
    },
    { path: 'search', component: SearchPage },
    { path: 'about', component: AboutPage },
    { path: '*', component: NotFound },
  ]
}

module.exports = routesConfig;