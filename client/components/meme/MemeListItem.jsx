import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

function MemeListItem({ image, num }) {
  const [numLeft, setNumLeft] = useState(0);

  useEffect(() => {
    if (num === 0) {
      setNumLeft(30);
    } else if (num === 1) {
      setNumLeft(540);
    } else if (num === 2) {
      setNumLeft(1080);
    }
  }, []);
  return (

    <Col key={image.imageId}>
      <div>
        <Image
          style={{
            width: '360px', height: 'auto', position: 'absolute', border: 'solid', left: `${numLeft}px`, top: '280px',
          }}
          src={image.imageUrl}
          alt={image.title}
        />
        <br />
        <div style={{
          position: 'absolute', left: `${numLeft}px`, top: '258px',
        }}
        >
          {' '}
          {image.title}
        </div>
        {image.options.str1 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str1.left + numLeft}px`, top: `${image.options.str1.top + 280}px` }}>{image.options.str1.text}</div>}
        {image.options.str2 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str2.left + numLeft}px`, top: `${image.options.str2.top + 280}px` }}>{image.options.str2.text}</div>}
        {image.options.str3 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str3.left + numLeft}px`, top: `${image.options.str3.top + 280}px` }}>{image.options.str3.text}</div>}
        {image.options.str4 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str4.left + numLeft}px`, top: `${image.options.str4.top + 280}px` }}>{image.options.str4.text}</div>}
        {image.options.str5 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str5.left + numLeft}px`, top: `${image.options.str5.top + 280}px` }}>{image.options.str5.text}</div>}
        {image.options.str6 !== undefined && <div style={{ position: 'absolute', left: `${image.options.str6.left + numLeft}px`, top: `${image.options.str6.top + 280}px` }}>{image.options.str6.text}</div>}

        {/* <div style={{ position: 'absolute', left: '728px', top: '285px' }}> hell </div>
        <div style={{ position: 'absolute', left: '634px', top: '310px' }}> hel </div>
        <div style={{ position: 'absolute', left: '824px', top: '323px' }}> he </div> */}

      </div>
      <br />
    </Col>

  );
}

export default MemeListItem;
