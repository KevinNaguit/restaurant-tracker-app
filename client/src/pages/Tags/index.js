import React, { useContext, useEffect, useState } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import styled from "styled-components";

// Styled components for the Tags section

const TagsContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 8px;
`;

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

const SectionHeader = styled.h2`
  margin-left: 24px;
  margin-top: 24px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d0d0d;
  text-align: left;
`;

const TagList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  padding: 0;
  margin-top: 12px;
`;

const TagItem = styled.div`
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #fff;
  color: #e74c3c;
  border: none;
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: lighter;

  &:hover {
    background-color: #f9f9f9;
  }
`;

// List of default tags to initialize the app with common restaurant categories
const defaultTags = [
  "Sushi",
  "Italian",
  "Indian",
  "Pizza",
  "Mexican",
  "Vegetarian",
  "Dessert",
  "Fast Food",
  "Brunch",
  "Chinese",
  "Thai",
  "Café",
  "Fine Dining",
  "Healthy",
];

const Tags = () => {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetches tags for the logged-in user or sets default tags if none are found
  useEffect(() => {
    const fetchTags = async () => {
      try {
        if (loggedInUser) {
          const response = await fetch(`/tags/${loggedInUser._id}`);
          const result = await response.json();

          if (result.status === 200 && Array.isArray(result.data)) {
            const initialTags =
              result.data.length > 0
                ? result.data
                : defaultTags.map((name) => ({ _id: name, name }));

            setTags(initialTags);
          } else {
            console.error("Expected an array of tags but got:", result.data);
            setTags(defaultTags.map((name) => ({ _id: name, name })));
          }
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags(defaultTags.map((name) => ({ _id: name, name })));
      }
    };

    fetchTags();
  }, [loggedInUser]);

  // Handles updating the state when the new tag input value changes
  const handleInputChange = (event) => setNewTag(event.target.value);

  // Handles updating the state when the search term input value changes
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Adds a new tag to the user's list
  const handleAddTag = async () => {
    if (loggedInUser && newTag) {
      try {
        const response = await fetch("/tags", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newTag, userId: loggedInUser._id }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 201 && result.data) {
            setTags([...tags, result.data]);
            setNewTag("");
          } else {
            console.error("Expected a tag object but got:", result.data);
          }
        } else {
          console.error("Failed to add tag:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
  };

  // Deletes a tag from the user's list
  const handleDeleteTag = async (tagId) => {
    try {
      const response = await fetch(`/tags/${tagId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTags(tags.filter((tag) => tag._id !== tagId));
      } else {
        console.error("Failed to delete tag:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Filters tags based on the search term entered by the user
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renders the Tags page for adding a new tag, searching existing tags
  // and displaying the filtered list of tags with options to delete them
  return (
    <>
      <TagsContainer>
        <InputField
          type="text"
          value={newTag}
          onChange={handleInputChange}
          placeholder="New Tag"
        />
        <SubmitButton onClick={handleAddTag}>Add Tag</SubmitButton>
      </TagsContainer>
      <TagsContainer>
        <InputField
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Tags"
        />
      </TagsContainer>
      <SectionHeader>Tags:</SectionHeader>
      <TagList>
        {filteredTags.map((tag) => (
          <TagItem key={tag._id}>
            {tag.name}
            <DeleteButton onClick={() => handleDeleteTag(tag._id)}>
              Delete
            </DeleteButton>
          </TagItem>
        ))}
      </TagList>
    </>
  );
};

export default Tags;
