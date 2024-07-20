import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlashFill } from 'react-bootstrap-icons';

function WatchItem({ imgTitle, isForSale }) {
  // eye state
  const [showPass, setShowPass] = useState(true);
  // watcher state
  const [watchers, setWatchers] = useState([]);
  // isForSale state
  const [forSale, setSale] = useState(true);

  // Function to send notification
  function sendMessage() {
    watchers.userData.map(({ name, email }) => {
      axios
        .post('/messages', { name, email, imgTitle })
        .then((message) => {
          console.log('Message sent: ', message);
        })
        .catch((err) => {
          console.error('Failed to send message: ', err);
        });
    });
  }

  function getWatchers() {
    axios
      .get(`/db/watch/${imgTitle}`)
      .then(() => {
        setWatchers(watchers);
      })
      .then(() => {
        if (showPass === true && isForSale === true) { sendMessage(); }
      })
      .catch((err) => {
        console.error('Could not GET the watchers', err);
      });
  }

  function sendWatchers() {
    axios
      .post(`/db/watch/${imgTitle}`)
      .then(() => {
      })
      .catch((err) => {
        console.error('Failed to POST watchers: ', err);
      });
  }

  // Function to get array of all art objects where isForSale === true
  function getAuction() {
    return axios
      .get('/db/auction/')
      .then(({ data }) => {
        setSale(data.isForSale);
      })
      .catch((err) => console.error('Could not GET auction items: ', err));
  }

  const clickHandler = () => {
    setShowPass((prev) => !prev);
    if (showPass === true) sendWatchers();
  };

  useEffect(() => {
    getAuction();
    getWatchers();
  }, [forSale, watchers]);

  return (
    <Button variant="outline" style={{ paddingBottom: '20px' }}>
      {showPass ? (
        <EyeSlashFill onClick={clickHandler} />
      ) : (
        <Eye onClick={clickHandler} />
      )}
    </Button>
  );
}

export default WatchItem;
