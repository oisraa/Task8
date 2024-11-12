import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { fetchItems, deleteItem } from "../store/itemsSlice";
import { AppDispatch } from "../store";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal"; // Import the modal
import "../styles/ShowAllItems.css";

const ShowAllItems: React.FC = () => {
  const { items, loading, error, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.items
  );
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const confirmDelete = (id: number) => {
    setModalVisible(true);
    setItemToDelete(id);
  };

  const handleDelete = () => {
    if (itemToDelete !== null) {
      dispatch(deleteItem(itemToDelete));

    
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleAddItemClick = () => {
    navigate("/add-item");
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-item/${id}`); // Corrected URL syntax
  };

  const handleViewItem = (id: number) => {
    navigate(`/item/${id}`); // Corrected URL syntax
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (items.length === 0) {
    return <p>No items available.</p>;
  }

  return (
    <div className="container mt-4">
      <button
        type="button"
        className="btn btn-primary btn-lg custom-button"
        onClick={handleAddItemClick}
      >
        Add New Product
      </button>

      <div className="items-grid">
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className="item-card"
            onClick={() => handleViewItem(item.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.image_url || "https://via.placeholder.com/150"}
              alt={item.name}
              title={item.name}
              className="item-image"
            />
            <div className="overlay">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item.id);
                }}
                className="btn-yellow btn-overlay"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(item.id);
                }}
                className="btn-danger btn-overlay"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination />

      {/* Confirmation Modal */}
      <ConfirmModal
        message="Are you sure you want to delete this product?"
        isVisible={isModalVisible}
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ShowAllItems;
