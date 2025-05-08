import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, onHide, onConfirm, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message || "Bạn có chắc chắn?"}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="danger" onClick={onConfirm}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
