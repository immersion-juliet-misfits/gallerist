import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function MemeMaker() {
  const [randomTemplate, setRandomTemplate] = useState({});
  const [memes, setMemes] = useState([]);
  const [memesImg, setMemeImg] = useState('');
  const [memesId, setMemeId] = useState('');
  const [memeName, setMemeName] = useState('');
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('title');
  const [show, setShow] = useState(false);
  const [str1, setStr1] = useState({});
  const [str2, setStr2] = useState({});
  const [str3, setStr3] = useState({});
  const [str4, setStr4] = useState({});
  const [str5, setStr5] = useState({});
  const [str6, setStr6] = useState({});

  const getRandomMeme = () => {
    setStr1({});
    setStr2({});
    setStr3({});
    setStr4({});
    setStr5({});
    setStr6({});
    axios.get('/meme/api')
      .then(({ data }) => {
        const num = Math.floor(Math.random() * 6);
        if (data.memes[num].name === 'Drake Hotline Bling') {
          setStr1({ left: 255, top: 78, text: '' });
          setStr2({ left: 255, top: 250, text: '' });
        } else if (data.memes[num].name === 'Distracted Boyfriend') {
          setStr1({ left: 188, top: 5, text: '' });
          setStr2({ left: 90, top: 30, text: '' });
          setStr3({ left: 284, top: 44, text: '' });
        } else if (data.memes[num].name === 'UNO Draw 25 Cards') {
          setStr1({ left: 80, top: 110, text: '' });
        } else if (data.memes[num].name === 'Two Buttons') {
          setStr1({ left: 80, top: 75, text: '' });
          setStr2({ left: 170, top: 40, text: '' });
        } else if (data.memes[num].name === 'Running Away Balloon') {
          setStr1({ left: 60, top: 49, text: '' });
          setStr2({ left: 260, top: 49, text: '' });
          setStr3({ left: 40, top: 344, text: '' });
        } else if (data.memes[num].name === 'Bernie I Am Once Again Asking For Your Support') {
          setStr1({ left: 165, top: 50, text: '' });
        }
        setRandomTemplate(data.memes[num]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editText = (num, str) => {
    let obj = {};
    switch (num) {
      case '1':
        obj = { left: str1?.left, top: str1?.top, text: str };
        setStr1(obj);
        break;
      case '2':
        obj = { left: str2?.left, top: str2?.top, text: str };
        setStr2(obj);
        break;
      case '3':
        obj = { left: str3?.left, top: str3?.top, text: str };
        setStr1(obj);
        break;
      case '4':
        obj = { left: str4?.left, top: str4?.top, text: str };
        setStr1(obj);
        break;
      case '5':
        obj = { left: str5?.left, top: str5?.top, text: str };
        setStr1(obj);
        break;
      case '6':
        obj = { left: str6?.left, top: str6?.top, text: str };
        setStr1(obj);
        break;
      default:
        console.error(`INPUT ${num} is not being check`);
    }
  };

  const addMeme = () => {
    const obj = {
      title,
      imageUrl: randomTemplate.url,
      options: {
        str1, str2, str3, str4, str5, str6,
      },
      user_id: 0,
      imageId: randomTemplate.name,
    };
    axios.post('/meme/post', obj)
      .then((data) => {
        get();
      })
      .catch((err) => { console.error('ERROR can\'t make meme: ', err); });
  };

  const flip = () => {
    const flip = !show;
    setShow(flip);
    setStr1({});
    setStr2({});
    setStr3({});
    setStr4({});
    setStr5({});
    setStr6({});
  };

  const pick = (name) => {
    for (let i = 0; i < memes.length; i++) {
      if (memes?.[i].title === name) {
        setStr1(memes?.[i].options.str1 ? memes?.[i].options.str1 : {});
        setStr2(memes?.[i].options.str2 ? memes?.[i].options.str2 : {});
        setStr3(memes?.[i].options.str3 ? memes?.[i].options.str3 : {});
        setStr4(memes?.[i].options.str4 ? memes?.[i].options.str4 : {});
        setStr5(memes?.[i].options.str5 ? memes?.[i].options.str5 : {});
        setStr6(memes?.[i].options.str6 ? memes?.[i].options.str6 : {});
        setMemeImg(memes?.[i].imageUrl);
        setMemeId(memes?.[i]._id);
        setMemeName(memes?.[i].imageId);
        setUser(memes?.[i].user_id);
      }
    }
  };

  const get = () => {
    axios.get('/meme/get')
      .then(({ data }) => {
        setMemes(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const giveTitle = (name) => {
    setTitle(name);
  };

  const edit = () => {
    const obj = {
      title,
      imageUrl: memesId,
      options: {
        str1, str2, str3, str4, str5, str6,
      },
      user_id: user,
      imageId: memeName,
    };
    axios.patch(`/meme/update/${memesId}`, obj)
      .then(() => {
        get();
      })
      .catch((err) => { console.error('ERROR  can\'t update meme: ', err); });
  };

  const remove = () => {
    const obj = {
      title,
      imageUrl: memesId,
      options: {
        str1, str2, str3, str4, str5, str6,
      },
      user_id: user,
      imageId: memeName,
    };
    axios.delete(`/meme/delete/${memesId}`, obj)
      .then(() => {
        get();
      })
      .catch((err) => { console.error('ERROR  can\'t update meme: ', err); });
  };

  useEffect(() => {
    get();
    getRandomMeme();
  }, []);

  return (
    <div>
      <Button variant="dark" size="sm" onClick={() => { getRandomMeme(); }} style={{ position: 'absolute', left: '219px', top: '250px' }}>get Random Template</Button>
      <Button variant="dark" size="sm" onClick={() => { addMeme(); }} style={{ position: 'absolute', left: '150px', top: '220px' }}>create Meme ❤️</Button>
      <Button variant="dark" size="sm" onClick={() => { flip(); }} style={{ position: 'absolute', left: '980px', top: '150px' }}>change</Button>
      <input onChange={(e) => { giveTitle(e.target.value); }} value={title} style={{ left: '30px', top: '250px', position: 'absolute' }} />
      {str1?.left !== undefined && <input onChange={(e) => { editText('1', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '280px', position: 'absolute' }} />}
      {str2?.left !== undefined && <input onChange={(e) => { editText('2', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '310px', position: 'absolute' }} />}
      {str3?.left !== undefined && <input onChange={(e) => { editText('3', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '340px', position: 'absolute' }} />}
      {str4?.left !== undefined && <input onChange={(e) => { editText('4', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '370px', position: 'absolute' }} />}
      {str5?.left !== undefined && <input onChange={(e) => { editText('5', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '400px', position: 'absolute' }} />}
      {str6?.left !== undefined && <input onChange={(e) => { editText('6', e.target.value); }} placeholder="fill me in" style={{ left: '380px', top: '430px', position: 'absolute' }} />}

      {show === false && (
        <Image
          style={{
            width: '350px', height: 'auto', left: '30px', top: '280px', position: 'absolute', border: 'solid',
          }}
          src={randomTemplate.url}
        />
      )}
      {show === true && (
        <div>
          <Button
            onClick={() => {
              edit();
              flip();
            }}
            style={{ position: 'absolute', left: '918px', top: '150px' }}
            variant="dark"
            size="sm"
          >
            update
          </Button>
          <Button
            onClick={() => {
              remove();
              flip();
            }}
            style={{ position: 'absolute', left: '1043px', top: '150px' }}
            variant="dark"
            size="sm"
          >
            delete
          </Button>
          <select onChange={(e) => { pick(e.target.value); }} style={{ position: 'absolute', left: '930px', top: '180px' }}>{memes.map((meme, i) => <option key={i}>{meme.title}</option>)}</select>
          <Image
            style={{
              width: '350px', height: 'auto', left: '30px', top: '280px', position: 'absolute', border: 'solid',
            }}
            src={memesImg}
          />
        </div>
      )}
      {str1?.left !== undefined && <div style={{ left: `${str1?.left + 30}px`, top: `${str1?.top + 280}px`, position: 'absolute' }}>{str1?.text}</div>}
      {str2?.left !== undefined && <div style={{ left: `${str2?.left + 30}px`, top: `${str2?.top + 280}px`, position: 'absolute' }}>{str2?.text}</div>}
      {str3?.left !== undefined && <div style={{ left: `${str3?.left + 30}px`, top: `${str3?.top + 280}px`, position: 'absolute' }}>{str3?.text}</div>}
      {str4?.left !== undefined && <div style={{ left: `${str4?.left + 30}px`, top: `${str4?.top + 280}px`, position: 'absolute' }}>{str4?.text}</div>}
      {str5?.left !== undefined && <div style={{ left: `${str5?.left + 30}px`, top: `${str5?.top + 280}px`, position: 'absolute' }}>{str5?.text}</div>}
      {str6?.left !== undefined && <div style={{ left: `${str6?.left + 30}px`, top: `${str6?.top + 280}px`, position: 'absolute' }}>{str6?.text}</div>}

    </div>
  );
} export default MemeMaker;
