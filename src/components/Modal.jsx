import "../styles/modal.css";

/**
 * Componente Modal
 *
 * Ventana modal que muestra contenido sobre un overlay, puede cerrarse al hacer clic fuera.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Estado para mostrar u ocultar el modal
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el modal
 * @param {React.ReactNode} props.children - Contenido que se mostrará dentro del modal
 * @returns {JSX.Element|null} Modal renderizado o null si no está abierto
 *
 * @example
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Contenido del modal</p>
 * </Modal>
 */

export const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
