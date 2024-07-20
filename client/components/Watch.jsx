import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlashFill } from 'react-bootstrap-icons';

function WatchItem() {
  // eye state
  const [showPass, setShowPass] = useState(false);
  const clickHandler = () => {
    setShowPass((prev) => !prev);
    // if (showPass === true && Art.isForSale === true) { sendMessage() }
  };

  return (
    <Button variant="outline" style={{ paddingBottom: '20px' }}>
      {showPass ? (
        <Eye onClick={clickHandler} />
      ) : (
        <EyeSlashFill onClick={clickHandler} />
      )}
    </Button>
  );
}

export default WatchItem;
