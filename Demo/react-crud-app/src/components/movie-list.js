import React, { useEffect, useState } from 'react';
import MovieItem from './movie_item';
import ReactPaginate from 'react-paginate';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [moviesCount, setMoviesCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getMovies();
  }, [page]);

  const getMovies = () => {
    fetch(
      process.env.REACT_APP_API_URL +
        "/movie?pageSize=" +
        process.env.REACT_APP_PAGING_SIZE +
        "&pageIndex=" +
        page
    )
      .then(res => res.json())
      .then(res => {
        if (res.status === true && res.data.count > 0) {
          setMovies(res.data.movies);
          setMoviesCount(
            Math.ceil(res.data.count / process.env.REACT_APP_PAGING_SIZE)
          );
        }

        if (res.data.count === 0) {
          alert("There is no movie data in system");
        }
      })
      .catch(() => alert("Error while fetching movies"));
  };

  const handlePageClick = (pageIndex) => {
    setPage(pageIndex.selected);
  };

  const deleteMovie = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/movie?id=" + id, {
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
          getMovies();
        }
      })
      .catch(() => alert("Error deleting movie"));
  };

  return (
    <>
      {Array.isArray(movies) &&
        movies.map((m, i) => (
          <MovieItem key={i} data={m} deleteMovie={deleteMovie} />
        ))}

      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"page-link"}
          pageCount={moviesCount}
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
};

export default MovieList;

