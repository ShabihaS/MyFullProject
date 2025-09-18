import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NoImage from '../no-image.png';

const MovieItem = ({ data, deleteMovie }) => {
  const navigate = useNavigate();

  return (
    <Row>
      <Col xs={12} md={2}>
        <img
          src={data.coverImage || NoImage}
          style={{ width: 150, height: 150 }}
          alt={data.title}
        />
      </Col>

      <Col xs={12} md={10}>
        <div><b>{data.title}</b></div>
        <div>Actors: {data.actors?.map(x => x.name).join(", ")}</div>

        <Button onClick={() => navigate('/details/' + data.id)}>See Details</Button>{' '}
        <Button onClick={() => navigate('/edit/' + data.id)}>Edit</Button>{' '}
        <Button variant="danger" onClick={() => deleteMovie(data.id)}>Delete</Button>
      </Col>

      <Col>
        <hr />
      </Col>
    </Row>
  );
};

export default MovieItem;

