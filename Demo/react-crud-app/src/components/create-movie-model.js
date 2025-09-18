import React from 'react'
import { Modal, ModalHeader } from 'react-bootstrap';

import EditMovie from './edit-movie';

const CreateMovieModel = (props) => {
  return (
   <>

   <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={false} centered>

    <Modal.Header closeButton>
      <Modal.Title>Add New movie</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <EditMovie/></Modal.Body>
   </Modal>
   </>
  )
}

export default CreateMovieModel;
