import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/itemsSlice';
import '../styles/AddItem.css';
import cloudIcon from '../assets/cloudicon.png';
import { useNavigate } from "react-router-dom"; 

const AddItem: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.auth.token);

  console.log('Token in Redux:', token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !image) {
      alert('Please fill in all fields and upload an image!');
      return;
    }

    if (!token) {
      alert('You need to be logged in to add an item');
      return;
    }

    try {
      const parsedPrice = parseFloat(price); 

      if (isNaN(parsedPrice)) {
        alert('Please enter a valid price.');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', parsedPrice.toString()); 
      formData.append('image', image); 

      const response = await fetch("https://test1.focal-x.com/api/items", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Include token in the Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        alert(`Error: ${errorData.message || 'Unknown error'}`);
        return; // End the function if the request fails
      }

      const responseData = await response.json();
      console.log("Raw response data:", responseData);

      console.log('Item added with the following data:');
      console.log('Name:', name);
      console.log('Price:', parsedPrice); 
      console.log('Image:', image.name); 

      dispatch(addItem({
        id: responseData.id || 'N/A', 
        name,
        price: parsedPrice,  
        image_url: image.name, 
      }));

      setName('');
      setPrice('');
      setImage(null);
      alert('Item added successfully!');
      navigate("/items"); // Navigate to the Show All Items page
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding item:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.error('Unknown error:', error);
        alert('An unknown error occurred.');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  return (
    <div className="add-item-content">
      <h1 className="title">ADD NEW ITEM</h1>
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter the product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                placeholder="Enter the product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group image-upload">
            <label htmlFor="file-upload">
              <img src={cloudIcon} alt="Upload" className="cloud-icon" />
            </label>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              required
            />

            {/* Optional: Preview image */}
            {image && (
              <div className="image-preview">
                <p>Selected Image:</p>
                <img
                  src={URL.createObjectURL(image)} // Preview the selected image
                  alt="Selected"
                  className="preview-image"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
};

export default AddItem;
