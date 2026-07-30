import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import React from 'react';

function DrawingList({ drawings, currentDrawing, loadDrawing }) {
  return (
    <Row xs={2} sm={4} lg={6} className="g-3 p-2">
      <Col>
        <div
          onClick={() => loadDrawing(null)}
          style={{
            border: !currentDrawing ? '3px solid #0d6efd' : '1px dashed #999',
            borderRadius: '6px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <div className="small text-center">New Drawing</div>
        </div>
      </Col>
      {drawings.map((d) => (
        <Col key={d._id}>
          <div
            onClick={() => loadDrawing(d._id)}
            style={{
              border: currentDrawing?._id === d._id ? '3px solid #0d6efd' : '1px solid #ccc',
              borderRadius: '6px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <Image
              src={d.imageUrl}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="small text-center p-1">{d.title}</div>
        </Col>
      ))}
    </Row>
  );
}

export default DrawingList;
