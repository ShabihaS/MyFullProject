import React,{useState,useEffect} from 'react';
import ReactPaginate from 'react-paginate';

import { Col, Row ,Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const ActorList = () => {
 const [actors, setActors] = useState([]);
  const [actorsCount, setaAtorsCount] = useState(0);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getPerson();
  }, [page]);

  const getPerson = () => {
    fetch(
      process.env.REACT_APP_API_URL +
        "/person?pageSize=" +
        process.env.REACT_APP_PAGING_SIZE +
        "&pageIndex=" +
        page
    )
      .then(res => res.json())
      .then(res => {
        if (res.status === true && res.data.count > 0) {
          setActors(res.data.person);
          setaAtorsCount(
            Math.ceil(res.data.count / process.env.REACT_APP_PAGING_SIZE)
          );
        }

        if (res.data.count === 0) {
          alert("There is no actor data in system");
        }
      })
      .catch(() => alert("Error while fetching data"));
  };

  const handlePageClick = (pageIndex) => {
    setPage(pageIndex.selected);
  };

  const deletePerson = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/person?id=" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === true) {
          alert(res.message);
          getPerson();
        }
      })
      .catch(() => alert("Error deleting person"));
  };

  return (
    <>
      {Array.isArray(actors) &&
      <div>
        {actors.map((m, i) => (
  <Row key={i}>
    <Col>
      <div onClick={() => navigate('/actors/details/' + m.id)}>
        <b><u>{m.name}</u></b>
      </div>
     
      <Button onClick={() => navigate('/actors/create-edit', { state: { data: m } })}>
        Edit
      </Button>{' '}
      <Button variant="danger" onClick={() => deletePerson(m.id)}>
        Delete
      </Button>
      <hr />
    </Col>
  </Row>
))}
          
          </div>
        }

      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"page-link"}
          pageCount={actorsCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-link"}
          nextClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </>
  );
}

export default ActorList;






