import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";

// Styled components for the WantToTry page

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const TextareaField = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 50%;
  padding: 12px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-hover-color);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const WantToTryContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const SectionHeader = styled.h2`
  margin-left: 24px;
  margin-top: 24px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d0d0d;
  text-align: left;
`;

const RestaurantList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px auto;
  max-width: 800px;
`;

const RestaurantItem = styled.li`
  background: #fff;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RestaurantDetails = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  font-size: 14px;
  color: #666;
`;

const RestaurantLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Notes = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DeleteButton = styled.button`
  background-color: #fff;
  color: #e74c3c;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: lighter;
  margin-top: 8px;
  max-width: 80px;

  &:hover {
    background-color: #efefef;
  }
`;

const MoveButton = styled.button`
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: lighter;
  margin-top: 8px;
  max-width: 120px;

  &:hover {
    background-color: #efefef;
  }
`;

const NavIcon = styled.img`
  width: 20px;
  height: auto;
`;

// Manages state and user context for the Want to Try section, including handling
// new restaurant entries and fetching existing ones
const WantToTry = () => {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    number: "",
    address: "",
    website: "",
    notes: "",
    tags: [],
    listType: "wantToTry",
  });

  // Fetches and sets the list of wantToTry restaurants for the logged-in user whenever the
  // loggedInUser state changes
  useEffect(() => {
    if (loggedInUser) {
      fetch(`/restaurants/${loggedInUser._id}?listType=wantToTry`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Fetched restaurants:", result);
          const restaurantsData = result.data;

          if (Array.isArray(restaurantsData)) {
            setRestaurants(restaurantsData);
          } else {
            console.error("Expected an array but got:", restaurantsData);
          }
        })
        .catch((error) => console.error("Error fetching restaurants:", error));
    }
  }, [loggedInUser]);

  // Updates the state of newRestaurant with changes from the input fields, using the name and
  // value from the form input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRestaurant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles adding a new restaurant by sending its details to the server, then updates the list of
  // restaurants and resets the form if successful
  const handleAddRestaurant = async () => {
    if (loggedInUser) {
      try {
        const response = await fetch("/restaurants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...newRestaurant, userId: loggedInUser._id }),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Added restaurant:", result);
          const addedRestaurant = result.data;

          if (addedRestaurant) {
            setRestaurants([...restaurants, addedRestaurant]);
            setNewRestaurant({
              name: "",
              number: "",
              address: "",
              website: "",
              notes: "",
              tags: [],
              listType: "wantToTry",
            });
          } else {
            console.error(
              "Expected a restaurant object but got:",
              addedRestaurant
            );
          }
        }
      } catch (error) {
        console.error("Error adding restaurant:", error);
      }
    }
  };

  // Handles deleting a restaurant from the Want to Try list
  const handleDeleteRestaurant = async (_id) => {
    if (loggedInUser) {
      try {
        const response = await fetch("/restaurants", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id,
            listType: "wantToTry",
          }),
        });

        if (response.ok) {
          // If the deletion was successful, update the state
          setRestaurants(
            restaurants.filter((restaurant) => restaurant._id !== _id)
          );
        } else {
          const errorData = await response.json();
          console.error("Failed to delete restaurant:", errorData.message);
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  // Moves a restaurant to the Favourites list
  const handleMoveToFavourites = async (restaurant) => {
    if (loggedInUser) {
      try {
        const response = await fetch("/restaurants/move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: restaurant._id,
            fromList: "wantToTry",
            toList: "favourites",
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Moved restaurant to favourites:", result);
          if (result.status === 200) {
            // Remove restaurant from "Want to Try" list
            setRestaurants(restaurants.filter((r) => r._id !== restaurant._id));
          } else {
            console.error("Failed to move restaurant:", result.message);
          }
        } else {
          console.error("Failed to move restaurant:", await response.json());
        }
      } catch (error) {
        console.error("Error moving restaurant:", error);
      }
    }
  };

  // Renders the Want to Try section with a form to add new restaurants and
  // a list of existing Want to Try restaurants
  return (
    <>
      <WantToTryContainer>
        <InputField
          type="text"
          name="name"
          value={newRestaurant.name}
          onChange={handleInputChange}
          placeholder="Restaurant Name"
        />
        <InputField
          type="text"
          name="number"
          value={newRestaurant.number}
          onChange={handleInputChange}
          placeholder="Phone Number"
        />
        <InputField
          type="text"
          name="address"
          value={newRestaurant.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <InputField
          type="text"
          name="website"
          value={newRestaurant.website}
          onChange={handleInputChange}
          placeholder="Website"
        />
        <TextareaField
          name="notes"
          value={newRestaurant.notes}
          onChange={handleInputChange}
          placeholder="Add notes"
        />
        <SubmitButton onClick={handleAddRestaurant}>
          Add to my list of Want to Try's
        </SubmitButton>
      </WantToTryContainer>
      <SectionHeader>Want to Try:</SectionHeader>
      <RestaurantList>
        {restaurants.map((restaurant) => (
          <RestaurantItem key={restaurant._id}>
            <div>{restaurant.name}</div>
            <RestaurantDetails>
              <div>Phone #: {restaurant.number}</div>
              <div>Address: {restaurant.address}</div>
              <RestaurantLink href={restaurant.website} target="_blank">
                Website
              </RestaurantLink>
            </RestaurantDetails>
            <Notes>Notes: {restaurant.notes}</Notes>
            <ButtonContainer>
              <DeleteButton
                onClick={() => handleDeleteRestaurant(restaurant._id)}
              >
                <NavIcon src="/assets/icons8-trash-48.png" alt="Trash Icon" />
                Delete
              </DeleteButton>
              <MoveButton onClick={() => handleMoveToFavourites(restaurant)}>
                Move to Favourites
              </MoveButton>
            </ButtonContainer>
          </RestaurantItem>
        ))}
      </RestaurantList>
    </>
  );
};

export default WantToTry;
