import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login from './Login';
import Search from './Search';
import Gallery from './Gallery';
import NavBar from './NavBar';
import Auction from './Auction';
import Profile from './Profile';
import Home from './Home';
import PhotoInfo from './PhotoInfo';
import PalGallery from './PalGallery';
import MemeMaker from './MemeMaker';

const App = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <NavBar />,
    children: [
      {
        path: '/home',
        element: <Search />,
      },
      {
        path: '/home/search',
        element: <Search />,
      },
      {
        path: '/home/login',
        element: <Login />,
      },
      {
        path: '/home/profile',
        element: <Profile />,
      },
      {
        path: '/home/gallery',
        element: <Gallery />,
      },
      {
        path: '/home/palGal/:user',
        element: <PalGallery />,
      },
      {
        path: '/home/auction',
        element: <Auction />,
      },
      {
        path: '/home/art/:imageId',
        element: <PhotoInfo />,
      },
      {
        path: '/home/meme',
        element: <MemeMaker />,
      },
    ],
  },
]);

export default App;
