import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchSingleItem } from "../store/itemsSlice";
import { useParams, useNavigate } from "react-router-dom";
import leftarrowImage from '../assets/left-arrow.png'; // Import the back arrow image

import "../styles/ShowSingleItem.css"; // Ensure to create and link this stylesheet

const ShowSingleItem: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { singleItem, loading, error } = useSelector(
    (state: RootState) => state.items
  );

  useEffect(() => {
    if (itemId) {
      dispatch(fetchSingleItem(parseInt(itemId))); // Fetch the single item
    }
  }, [dispatch, itemId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!singleItem) {
    return <p>No item found.</p>;
  }

  return (
    <div className="single-item-container">
      {/* Back Button with Image */}
      <button className="back-button-single" onClick={handleBack}>
        <img src={leftarrowImage} alt="Back" className="back-arrow-image" />
      </button>

      <h1 className="item-title">{singleItem.name}</h1>

      <div className="image-container">
        <img
          src={singleItem.image_url || "https://via.placeholder.com/150"}
          alt={singleItem.name}
          className="item-image"
        />
      </div>

      <div className="item-details">
        <p className="item-price">Price: <span>${singleItem.price}</span></p>
        <p className="item-added">Added At: <span>{singleItem.added_at || "N/A"}</span></p>
      </div>

      <p className="item-updated">Updated At: <span>{singleItem.updated_at || "N/A"}</span></p>
    </div>
  );
};

export default ShowSingleItem;
