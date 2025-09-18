import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import NoImage from "../no-image.png";
import { Link, useParams } from "react-router-dom";

const MovieDetail = () => {
  const { movieid } = useParams(); 
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (movieid) {
      fetch(process.env.REACT_APP_API_URL + "/movie/" + movieid)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === true) {
            setMovie(res.data);
          }
        })
        .catch(() => alert("Error occurred while fetching movie"));
    }
  }, [movieid]);

  return (
    <Row>
      {movie && (
        <>
          <Col xs={12} md={4}>
            <img
              src={movie.coverImage || NoImage}
              alt={movie.title}
              style={{ width: 300, height: 300 }}
            />
          </Col>
          <Col xs={12} md={8}>
            <h3>{movie.title}</h3>
            <p>{movie.description || "N/A"}</p>
            <div>
              <b>Language:</b>
            </div>
            <div>{movie.language}</div>
            <div>
              <b>Release Date</b>
            </div>
            <div>{movie.releaseDate && movie.releaseDate.split("T")[0]}</div>
            <div>
              <b>Cast:</b>
            </div>
            <div>{movie.actors?.map((x) => x.name).join(", ")}</div>
          </Col>
          <Col xs={12}>
            <Link to="/">Go To Home Page</Link>
          </Col>
        </>
      )}
    </Row>
  );
};

export default MovieDetail;

