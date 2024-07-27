import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlashFill } from 'react-bootstrap-icons';

function WatchItem({ imgTitle, isForSale, users }) {
  // eye state
  const [showPass, setShowPass] = useState(false);
  // watcher state
  const [watchers, setWatchers] = useState([]);


  // Function to send notification
  function sendMessage() {
    watchers.data.map((watcher) => {
      const { name, email, title } = watcher;
      console.log('watcher', watcher);
      axios
        .post('/send-email', { name, email, title })
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
      .then((data) => {
        setWatchers(data);
        setShowPass(data.isWatched || false);
      })
      .catch((err) => {
        console.error('Could not GET the watchers', err);
      });
  }

  function sendWatchers() {
    axios
      .post(`/db/watch/${imgTitle}`, { isWatched: showPass })
      .then(() => {
        if (showPass === true && isForSale === true) {
          sendMessage();
        }
      })
      .catch((err) => {
        console.error('Failed to POST watchers: ', err);
      });
  }

  function deleteWatcher() {
    const { _id } = watchers.data[0];
    console.log('id', _id);
    axios
      .delete(`/db/watch/${_id}`)
      .then(() => {
        console.log('Item has been deleted from Watch');
        // getWatchers();
      })
      .catch((err) => {
        console.error('Failed to delete watcher: ', err);
      });
  }

  // // Function to get array of all art objects where isForSale === true
  // function getAuction() {
  //   return axios
  //     .get('/db/auction/')
  //     .then(({ data }) => {
  //       setSale(data.isForSale);
  //     })
  //     .catch((err) => console.error('Could not GET auction items: ', err));
  // }

  const clickHandler = () => {
    setShowPass((prev) => !prev);
    // sendWatchers();
    if (showPass === true) {
      sendWatchers();
    } else {
      deleteWatcher();
    }
  };

  useEffect(() => {
    getWatchers();
  }, [imgTitle]);

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
