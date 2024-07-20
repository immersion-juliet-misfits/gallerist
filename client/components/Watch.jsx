import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlashFill } from 'react-bootstrap-icons';

function WatchItem() {
  // eye state
  const [showPass, setShowPass] = useState(false);
  // watcher state
  const [watchers, setWatchers] = useState([]);
  // isForSale state
  const [forSale, setSale] = useState(true);


  function getWatchers() {
    axios
      .get('/db/watch/${})
      .then((data) => {
        console.log(data)
        // setWatchers(watchers);
      })
      .catch((err) => {
        console.error('Could not GET the watchers', err);
      });
  }

  // function sendMessage() {
  //   watchers.userData.map((user) => {
  //     axios.post('/messages', {user.name, user.email, watchers.title});

  //   })
  // };

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
    console.log('watchers', watchers)
    // if (showPass === true && forSale === true) { sendMessage(); }
  };

  useEffect(() => {
    getAuction();
    getWatchers();
  }, [forSale, watchers]);

  return (
    <Button variant='outline' style={{ paddingBottom: '20px' }}>
      {showPass ? (
        <Eye onClick={clickHandler} />
      ) : (
        <EyeSlashFill onClick={clickHandler} />
      )}
    </Button>
  );
}

export default WatchItem;
