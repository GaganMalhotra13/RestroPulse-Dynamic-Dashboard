import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useGetProductsQuery, useAddProductMutation } from "state/api";
import Header from "components/Header";

// Individual Product Card Component
const MenuItems = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ₹{Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2">{description}</Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
      </CardActions>

      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography sx={{ color: theme.palette.secondary[400] }}>
            ID: {_id}
          </Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Units Sold:{" "}
            {stat && stat[0]?.yearlyTotalSoldUnits
              ? stat[0].yearlyTotalSoldUnits
              : "0"}
          </Typography>
          <Typography>
            Yearly Sales Revenue:{" "}
            {stat && stat[0]?.yearlyTotalSoldUnits
              ? `₹${(stat[0].yearlyTotalSoldUnits * price).toLocaleString()}`
              : "₹0"}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

// Main Page Component
const MenuItemss = () => {
  const theme = useTheme(); // Fixed: theme was missing here
  const { data, isLoading } = useGetProductsQuery();
  const [addProduct] = useAddProductMutation(); // 👈 NAYA HOOK ADD KIYA
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    supply: "",
  });

  const handleAddProduct = async () => {
    try {
      // 👈 Raw fetch hata diya! Ab RTK Query sambhalega sab kuch (Local aur Live dono)
      await addProduct(newItem).unwrap(); 
      
      setOpen(false);
      setNewItem({ name: "", price: "", description: "", category: "", supply: "" }); // Form clear karna zaroori hai
      
      // 🚨 window.location.reload(); HATA DIYA! 
      // Kyunki RTK Query 'invalidatesTags' se list automatically refresh kar dega bina page reload kiye!
      
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Check console for details.");
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Menu Items"
        subtitle="Manage your restaurant's food categories and pricing."
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{ mt: "1rem", fontWeight: "bold" }}
      >
        + Add New Item
      </Button>

      {data && !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              name,
              description,
              price,
              rating,
              category,
              supply,
              stat,
            }) => (
              <MenuItems
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                rating={rating}
                category={category}
                supply={supply}
                stat={stat}
              />
            )
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress size={40} color="secondary" />
        </Box>
      )}

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
          }}
        >
          Add New Food Item
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <TextField
            fullWidth
            label="Item Name"
            margin="normal"
            color="secondary"
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Price (₹)"
            margin="normal"
            color="secondary"
            type="number"
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <TextField
            fullWidth
            label="Category"
            margin="normal"
            color="secondary"
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            color="secondary"
            multiline
            rows={3}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: theme.palette.background.alt, p: "1.5rem" }}
        >
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: theme.palette.secondary[100] }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            color="secondary"
            sx={{ fontWeight: "bold" }}
          >
            Add to Menu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuItemss;