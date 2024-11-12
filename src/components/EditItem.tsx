import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/EditItem.css";

interface Item {
  name: string;
  price: number;
  image: File | string; 
}

const EditItem: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>(); // Get itemId from URL params
  const navigate = useNavigate(); // Navigate to redirect after actions

  const [item, setItem] = useState<Item>({
    name: "",
    price: 0,
    image: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (!itemId) {
      setItem({ name: "", price: 0, image: "https://via.placeholder.com/150" });
      return;
    }
    const fetchItem = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`https://test1.focal-x.com/api/items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching item data:", errorText);
          throw new Error(`Failed to fetch item data. Status: ${response.status}`);
        }

        const data = await response.json();
        setItem({
          name: data.name,
          price: data.price,
          image: data.image_url || "https://via.placeholder.com/150",
        });
      } catch (error: any) {
        console.error("Error fetching item:", error);
        setError(error.message || "An error occurred while fetching the item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: name === "price" ? +value : value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setItem((prevItem) => ({
        ...prevItem,
        image: file,
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!item.name || !item.price) {
      alert("Name and price fields are required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("price", item.price.toString());
  
    if (item.image instanceof File) {
      formData.append("image", item.image); 
    }
  
    formData.append("_method", "PUT"); 
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }
  
    try {
      
      const url = itemId
        ? `https://test1.focal-x.com/api/items/${itemId}` 
        : `https://test1.focal-x.com/api/items`; 
  
      const response = await fetch(url, {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating/adding item:", errorData);
        throw new Error(errorData.message || "Failed to update/add item");
      }
  
      const data = await response.json();
  
      alert("Item updated/added successfully!");
  
      navigate(`/item/${itemId || data.id}`); 
    } catch (error: any) {
      console.error("Error during submit:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  
  
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display the error message
  }

  return (
    <div className="add-item-content">
    <h1 className="title">{itemId ? "Edit Item" : "Add New Item"}</h1>
    <form onSubmit={handleSubmit} className="add-item-form">
      <div className="form-row">
        <div className="form-column">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group image-upload">
  {item.image ? (
    <img
      src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image}
      alt="Item Preview"
      className="preview-image"
    />
  ) : (
    <div className="upload-placeholder">Click to upload image</div>
  )}
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'none' }}
  />
  <div
    className="upload-area"
    onClick={() => document.getElementById('file-upload')?.click()}
  >
    {item.image ? null : <span>Upload Image</span>}
  </div>
</div>
      </div>
      <button type="submit" className="save-button">
  {itemId ? "Update Item" : "Add Item"}
</button>
    </form>
  </div>
  

  );
};

export default EditItem;
