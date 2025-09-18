import React, { useEffect, useState } from "react";
import { useParams, useNavigate ,Link} from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";

const ActorDetails = () => {
   const { actorid } = useParams(); 
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (actorid) {
      fetch(process.env.REACT_APP_API_URL + "/person/" + actorid)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === true) {
            setActor(res.data);
          }
        })
        .catch(() => alert("Error occurred while fetching movie"));
    }
  }, [actorid]);

  return (
    <Row>
      {actor && (
        <>
          
          <Col xs={12} md={12}>
            <h3>{actor.name}</h3>
           <div>
              <b>Date of Birth:</b>
            </div>
            <div>{actor.dateOfBirth && actor.dateOfBirth.split("T")[0]}</div>
            <div>
              <b>Movies:</b>
            </div>
            <ul>
  {actor.movies?.map((x, i) => (
    <li key={i}>{x}</li>
  ))}
</ul>
          </Col>
          <Col xs={12}>
            <Link to="/actors">Go To Actors Page</Link>
          </Col>
        </>
      )}

       
    </Row>
   
  );
  
  
};

export default ActorDetails;


