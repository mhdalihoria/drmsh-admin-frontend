import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  TextField,
  useTheme,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CategoriesForm = () => {
  const theme = useTheme();
  const [data, setData] = useState({});
  const [categoryInput, setCategoryInput] = useState("");
  const [subInputs, setSubInputs] = useState({});
  const [childInputs, setChildInputs] = useState({});
  const [categoryImages, setCategoryImages] = useState({});
  const [subImages, setSubImages] = useState({});
  const [childImages, setChildImages] = useState({});
  const [uploading, setUploading] = useState({});

  const uploadImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    return new Promise((resolve) => {
      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return resolve(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            }/image/upload`,
            formData
          );
          resolve(res.data.secure_url);
        } catch (err) {
          console.error("Upload error:", err);
          resolve(null);
        }
      };
      fileInput.click();
    });
  };

  const handleUploadFor = async (key, setter) => {
    setUploading((prev) => ({ ...prev, [key]: true }));
    const url = await uploadImage();
    if (url) setter((prev) => ({ ...prev, [key]: url }));
    setUploading((prev) => ({ ...prev, [key]: false }));
  };

  const addCategory = () => {
    if (!categoryInput || !categoryImages[categoryInput] || data[categoryInput])
      return;
    const imgUrl = categoryImages[categoryInput];

    const newCategory = {
      categoryName: categoryInput,
      img: imgUrl,
      items: [],
    };

    setData((prev) => ({ ...prev, [categoryInput]: newCategory }));
    setCategoryInput("");
    setCategoryImages((prev) => ({ ...prev, [categoryInput]: "" }));
  };

  const addSubCategory = (category) => {
    const name = subInputs[category];
    if (!name || !subImages[`${category}-${name}`]) return;
    const imgUrl = subImages[`${category}-${name}`];

    const newSub = {
      categoryName: name,
      img: imgUrl,
      items: [],
    };

    setData((prev) => {
      const updated = [...prev[category].items, newSub];
      return {
        ...prev,
        [category]: {
          ...prev[category],
          items: updated,
        },
      };
    });

    setSubInputs((prev) => ({ ...prev, [category]: "" }));
    setSubImages((prev) => ({ ...prev, [`${category}-${name}`]: "" }));
  };

  const addSubChild = (category, index) => {
    const inputKey = `${category}-${index}`;
    const name = childInputs[inputKey];
    if (!name || !childImages[inputKey]) return;
    const imgUrl = childImages[inputKey];

    const newChild = {
      categoryName: name,
      img: imgUrl,
      items: [],
    };

    setData((prev) => {
      const items = [...prev[category].items];
      const current = { ...items[index] };
      current.items = current.items || [];
      current.items.push(newChild);
      items[index] = current;

      return {
        ...prev,
        [category]: {
          ...prev[category],
          items,
        },
      };
    });

    setChildInputs((prev) => ({ ...prev, [inputKey]: "" }));
    setChildImages((prev) => ({ ...prev, [inputKey]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/categories/add", {
        data: Object.values(data),
      });
      alert("Submitted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Form with Images
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="New Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <Button
          onClick={() => handleUploadFor(categoryInput, setCategoryImages)}
          variant="contained"
          sx={{ background: (theme) => theme.palette.text.secondary }}
        >
          {uploading[categoryInput] ? (
            <span>Loading...</span>
          ) : (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CloudUploadIcon /> Upload Image
            </span>
          )}
        </Button>
        <Button
          variant="contained"
          onClick={addCategory}
          disabled={
            uploading[categoryInput] ||
            !categoryInput ||
            !categoryImages[categoryInput]
          }
          sx={{ background: (theme) => theme.palette.primary.light }}
        >
          Add Category
        </Button>
      </Stack>
      <Stack spacing={2} mt={3}>
        {Object.entries(data).map(([catKey, catValue], catIdx) => (
          <Paper key={catIdx} sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={catValue.img} alt={catValue.categoryName} />
                <Typography variant="h6">{catValue.categoryName}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="New Sub-category"
                  value={subInputs[catKey] || ""}
                  onChange={(e) =>
                    setSubInputs((prev) => ({
                      ...prev,
                      [catKey]: e.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() =>
                    handleUploadFor(
                      `${catKey}-${subInputs[catKey]}`,
                      setSubImages
                    )
                  }
                  variant="contained"
                >
                  {uploading[`${catKey}-${subInputs[catKey]}`] ? (
                    "Loading..."
                  ) : (
                    <span>
                      <CloudUploadIcon /> Upload Image
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => addSubCategory(catKey)}
                  variant="contained"
                  size="small"
                  disabled={
                    uploading[`${catKey}-${subInputs[catKey]}`] ||
                    !subInputs[catKey] ||
                    !subImages[`${catKey}-${subInputs[catKey]}`]
                  }
                >
                  Add Sub
                </Button>
              </Stack>
            </Stack>
            <Box mt={2} pl={3}>
              {catValue.items.map((sub, idx) => (
                <Paper
                  key={idx}
                  sx={{ p: 2, mb: 2, backgroundColor: "background.paper" }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={sub.img} alt={sub.categoryName} />
                      <Typography variant="subtitle1">
                        {sub.categoryName}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        label="New Sub-child"
                        value={childInputs[`${catKey}-${idx}`] || ""}
                        onChange={(e) =>
                          setChildInputs((prev) => ({
                            ...prev,
                            [`${catKey}-${idx}`]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        onClick={() =>
                          handleUploadFor(`${catKey}-${idx}`, setChildImages)
                        }
                        variant="outlined"
                      >
                        {uploading[`${catKey}-${idx}`]
                          ? "Loading..."
                          : "Upload Picture"}
                      </Button>
                      <Button
                        onClick={() => addSubChild(catKey, idx)}
                        size="small"
                        disabled={
                          uploading[`${catKey}-${idx}`] ||
                          !childInputs[`${catKey}-${idx}`] ||
                          !childImages[`${catKey}-${idx}`]
                        }
                      >
                        Add Child
                      </Button>
                    </Stack>
                  </Stack>
                  {sub.items && sub.items.length > 0 && (
                    <Box mt={2} pl={4}>
                      {sub.items.map((child, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <Avatar
                            src={child.img}
                            alt={child.categoryName}
                            sx={{ width: 36, height: 36 }}
                          />
                          <Typography>{child.categoryName}</Typography>
                        </Stack>
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </Paper>
        ))}
      </Stack>

      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 4 }}>
        Submit
      </Button>
    </Box>
  );
};

export default CategoriesForm;
