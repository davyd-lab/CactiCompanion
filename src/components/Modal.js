import styles from '../styles/Modal.module.css';
import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, closeModal, children, cactusName }) => {
  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (!modalRef.current.contains(event.target)) {
      closeModal();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // cleanup function
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isOpen]); // the effect depends on the isOpen prop

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg p-8 relative ${styles.modalParent}`} ref={modalRef}>
        <button className="absolute top-4 right-4" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1>Images for {cactusName}</h1>
        <div className={`${styles.imgsParent}`}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === 'img') {
            return React.cloneElement(child, {
              className: styles.imgStyle
            });
          }
          return child;
        })}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;