import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login from './Login';
import Search from './Search';
import Gallery from './Gallery';
import BlackMarket from './BlackMarket';
import NavBar from './NavBar';
import Auction from './Auction';
import Profile from './Profile';
import Home from './Home';
import PhotoInfo from './PhotoInfo';
import PalGallery from './PalGallery';
import Quiz from './quiz/Quiz';
import MemeMaker from './meme/MemeMaker';
import ShowcaseList from './Showcase/ShowcaseList';
import ShowcaseDetail from './Showcase/ShowcaseDetail';
import ShowcaseSetup from './Showcase/ShowcaseSetup';
import ArtHeist from './ArtHeist/ArtHeist';
import CrackCode from './ArtHeist/CrackCode';
import Canvas from './Canvas';

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
        path: '/home/blackmarket',
        element: <BlackMarket />,
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
        path: '/home/showcase',
        element: <ShowcaseList />,
      },
      {
        path: '/home/showcase/setup',
        element: <ShowcaseSetup />,
      },
      {
        path: '/home/showcase/:id',
        element: <ShowcaseDetail />,
      },
      {
        path: '/home/quiz',
        element: <Quiz />,
      },
      {
        path: '/home/art/:_id',
        element: <PhotoInfo />,
      },
      {
        path: '/home/meme',
        element: <MemeMaker />,
      },
      {
        path: '/home/heist',
        element: <ArtHeist />,
      },
      {
        path: '/home/planHeist',
        element: <CrackCode />,
      },
      {
        path: '/home/canvas',
        element: <Canvas />,
      },
    ],
  },
]);

export default App;
