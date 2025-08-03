import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

const CategoryNode = ({ node, onDelete }) => {
  return (
    <Paper sx={{ p: 2, mb: 1 }} elevation={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          {node.img && (
            <img src={node.img} alt={node.categoryName} width="50px" height={"50px"} style={{borderRadius: "100%"}}/>
          )}

          <Typography variant="subtitle1">{node.categoryName}</Typography>
        </Stack>
        <Button
          color="error"
          size="small"
          variant="contained"
          onClick={() => onDelete(node._id)}
        >
          Delete
        </Button>
      </Stack>
      <Box pl={2} mt={1}>
        {node.items &&
          node.items.map((child) => (
            <CategoryNode key={child._id} node={child} onDelete={onDelete} />
          ))}
      </Box>
    </Paper>
  );
};

const CategoryTree = () => {
  const [tree, setTree] = useState([]);

  console.log(tree);

  const fetchTree = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories/tree`);
      setTree(res.data);
    } catch (err) {
      console.error("Failed to load tree:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`);
      fetchTree();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Tree View
      </Typography>
      <Box>
        {tree.map((root) => (
          <CategoryNode key={root._id} node={root} onDelete={handleDelete} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryTree;
