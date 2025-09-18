import React, { useEffect, useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import NoImage from '../no-image.png';
import AsyncSelect from 'react-select/async';
import { useParams, useNavigate } from 'react-router-dom';

const EditMovie = () => {
  const { movieid } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({ actors: [] });
  const [actors, setActors] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (movieid) {
      fetch(process.env.REACT_APP_API_URL + "/movie/" + movieid)
        .then(res => res.json())
        .then(res => {
          if (res.status === true) {
            let movieData = res.data;

            if (movieData.releaseDate) {
              movieData.releaseDate = movieData.releaseDate.split('T')[0];
            }

            setMovie({ ...movieData, actors: movieData.actors || [] });
            setActors(
              (movieData.actors || []).map(x => ({ value: x.id, label: x.name }))
            );
          }
        })
        .catch(() => alert("Error occurred while fetching movie"));
    }
  }, [movieid]);

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const form = new FormData();
    form.append("imageFile", file);

    fetch(process.env.REACT_APP_API_URL + "/Movie/upload-movie-poster", {
      method: "POST",
      body: form
    })
      .then(res => res.json())
      .then(res => {
        setMovie(prev => ({ ...prev, coverImage: res.profileImage }));
      })
      .catch(() => alert("Error in file upload"));
  };

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const method = movie.id ? "PUT" : "POST";
    const url = process.env.REACT_APP_API_URL + "/movie";

    const movieToPost = {
      Id: movie.id,
      Title: movie.title,
      Description: movie.description,
      ReleaseDate: movie.releaseDate,
      Language: movie.language,
      CoverImage: movie.coverImage,
      Actors: actors.map(a => a.value),
    };

    fetch(url, {
      method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieToPost),
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();

        if (data.status === true) {
          alert(method === "PUT" ? "Updated successfully" : "Created successfully");
          navigate("/");
        } else {
          throw new Error(data.message || "Save failed");
        }
      })
      .catch(err => {
        alert("Error in saving data: " + err.message);
      });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setMovie(prev => ({ ...prev, [name]: value }));
  };

  const promiseOptions = (inputValue) => {
    return fetch(process.env.REACT_APP_API_URL + "/Person/Search/" + inputValue)
      .then(res => res.json())
      .then(res => {
        if (res.status === true && res.data.length > 0) {
          return res.data.map(x => ({ value: x.id, label: x.name }));
        }
        return [];
      })
      .catch(() => []);
  };

  const multiSelectChange = (data) => {
    setActors(data);
    const people = data.map(x => ({ id: x.value, name: x.label }));
    setMovie(prev => ({ ...prev, actors: people }));
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSave}>
      <Form.Group className='d-flex justify-content-center'>
        <Image width={200} height={200} src={movie.coverImage || NoImage} />
      </Form.Group>

      <Form.Group className='d-flex justify-content-center'>
        <div>
          <input type='file' onChange={handleFileUpload} />
        </div>
      </Form.Group>

      <Form.Group controlId='formMovieTitle'>
        <Form.Label>Movie Title</Form.Label>
        <Form.Control
          name='title'
          value={movie.title || ''}
          required
          type='text'
          autoComplete='off'
          placeholder="Enter Movie name"
          onChange={handleFieldChange}
        />
        <Form.Control.Feedback type='invalid'>
          Please enter movie name
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='formMovieDescription'>
        <Form.Label>Movie Description</Form.Label>
        <Form.Control
          name='description'
          value={movie.description || ''}
          required
          as="textarea"
          rows={3}
          placeholder="Enter Movie description"
          onChange={handleFieldChange}
        />
      </Form.Group>

      <Form.Group controlId='formMovieReleaseDate'>
        <Form.Label>Release Date</Form.Label>
        <Form.Control
          name='releaseDate'
          value={movie.releaseDate || ''}
          required
          type='date'
          onChange={handleFieldChange}
        />
        <Form.Control.Feedback type='invalid'>
          Please enter release date
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='formMovieActors'>
        <Form.Label>Actors</Form.Label>
        <AsyncSelect
          cacheOptions
          isMulti
          value={actors}
          loadOptions={promiseOptions}
          onChange={multiSelectChange}
        />
      </Form.Group>

      <Form.Group controlId='formMovieLanguage'>
        <Form.Label>Movie Language</Form.Label>
        <Form.Control
          name='language'
          value={movie.language || ''}
          required
          type='text'
          placeholder="Enter Movie language"
          onChange={handleFieldChange}
        />
      </Form.Group>

      <Button type='submit'>
        {movie && movie.id > 0 ? "Update" : "Create"}
      </Button>
    </Form>
  );
};

export default EditMovie;






