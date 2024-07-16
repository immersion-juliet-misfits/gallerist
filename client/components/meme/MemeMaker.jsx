import React from 'react';
import axios from 'axios';

function MemeMaker() {
  return (
    <div>
      hello
      <button onClick={() => {
        axios.get('/meme/get')
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      >
        test
      </button>
    </div>
  );
} export default MemeMaker;
