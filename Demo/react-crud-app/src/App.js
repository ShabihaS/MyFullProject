import './App.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Landing from './pages/landing';
import Actors from './pages/actors';

import EditMovie from './components/edit-movie';
import MovieDetail from './components/movie-details';


import ActorList from "./components/actor-list";
import ActorDetails from "./components/actor-details";
import CreateEditActor from "./components/create-edit-actor";


function App() {
  return (
    <Container>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark" className="mb-3">
          <Navbar.Brand as={Link} to="/">Movie World</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Movies</Nav.Link>
            <Nav.Link as={Link} to="/actors">Actors</Nav.Link>
          </Nav>
        </Navbar>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/details/:movieid" element={<MovieDetail />} />
          <Route path="/edit/:movieid" element={<EditMovie />} />

          <Route path="/actors" element={<Actors />} />
        <Route path="/actors/details/:actorid" element={<ActorDetails />} />
        <Route path="/actors/create-edit" element={<CreateEditActor />} />
       
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
