import React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';

/*
notes
left
0: 30
1: 540
2: 1080

top: 280

Drake Hotline Blinghellohellhelhe
str1: left 230 / top 300  or left 285 / top 358
str2: left 230 / top 465  or left 285 / top 530
*/

function MemeMaker() {
  return (
    <div>
      hello
      <button onClick={() => {
        axios.get('/meme/get')
          .then(({ data }) => {
            console.log(data);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      >
        test
      </button>
      <Image
        className="gallery-image"
        style={{ width: '350px', height: 'auto' }}
        src="https://i.imgflip.com/30b1gx.jpg"
      />
      <div style={{ position: 'absolute', left: '310px', top: '340px' }}> pablo</div>
      <div style={{ position: 'absolute', left: '310px', top: '160px' }}> bob</div>
    </div>
  );
} export default MemeMaker;
