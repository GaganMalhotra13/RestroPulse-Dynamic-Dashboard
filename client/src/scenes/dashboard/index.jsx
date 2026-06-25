import React, { useState, useEffect } from "react";
import {
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  TextField,
  Select,
  MenuItem,
  useMediaQuery,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetDashboardQuery, useAddTransactionMutation, useGetProductsQuery } from "state/api";
import {
  FlexBetween,
  Header,
  BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery();
  
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem("bannerDismissed");
    if (!bannerDismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleBannerClose = () => {
    setShowBanner(false);
    localStorage.setItem("bannerDismissed", "true");
  };
  
  const [addTransaction, { isLoading: isPunching }] = useAddTransactionMutation(); 
  const [paymentType, setPaymentType] = useState("cash");
  const { data: menuItems, isLoading: isMenuLoading } = useGetProductsQuery();
  
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("Dine-In"); 
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("Serving Staff");
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const addToCart = (item) => setCart([...cart, item]);
  const clearCart = () => setCart([]);

  const handlePunchOrder = async () => {
    if (cart.length === 0) return alert("Please select items!");
    if (!customerName || !staffName) return alert("Please Enter Customer & Staff Name!");
    
    try {
      await addTransaction({
        products: cart.map(item => item._id), 
        cost: Number(totalAmount),
        paymentType: paymentType,
        customerName: customerName,
        orderType: orderType,
        staffName: staffName,
        staffRole: staffRole,
        cartItems: cart 
      }).unwrap();
      
      clearCart(); 
      setCustomerName("");
      setStaffName("");
      setIsModalOpen(false); 
      alert("✅ Order Placed Successfully!");
    } catch (error) {
      console.error("Failed to add order", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ORDER ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 0.5 },
    { field: "createdAt", headerName: "Time", flex: 1, renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: "products", headerName: "Items", flex: 0.5, sortable: false, renderCell: (params) => params.value?.length || 0 },
    { field: "cost", headerName: "Cost", flex: 1, renderCell: (params) => `$${Number(params.value).toFixed(2)}` },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* Banner Alert */}
      {showBanner && (
        <Alert severity="info" sx={{ mb: 2 }} action={
            <IconButton color="inherit" size="small" onClick={handleBannerClose}>
              <Close fontSize="inherit" />
            </IconButton>
          }>
          Initial load may take 1-2 minutes due to server sleep after inactivity.
        </Alert>
      )}

      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box display="flex" gap="1rem">
          <Button 
            variant="contained" 
            onClick={() => setIsModalOpen(true)}
            sx={{ 
              backgroundColor: theme.palette.primary.main, 
              color: "#FFF", 
              fontWeight: "bold",
              boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)", // Premium glow
              borderRadius: "8px",
              padding: "8px 20px"
            }}
          >
            + PLACE NEW ORDER
          </Button>
          <Button sx={{ backgroundColor: theme.palette.background.alt, color: theme.palette.text.primary, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "8px" }}>
             Download Reports
          </Button>
        </Box>
      </FlexBetween>
             
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(160px, auto)"
        gap="24px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 - STAT CARDS (Now taking exactly 1/4th of the screen each) */}
        <Box gridColumn="span 3">
          <StatBox
            title="Total Diners"
            value={data && data.totalCustomers}
            increase="+18%"
            description="last month"
            variant="orange"
            icon={<Email sx={{ color: "#FFF", fontSize: "22px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
            title="Sales Today"
            value={`$${data ? data.todayStats.totalSales : "0"}`}
            increase="+25%"
            description="last month"
            variant="teal"
            icon={<PointOfSale sx={{ color: "#FFF", fontSize: "22px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
            title="Monthly Gross Profit"
            value={`$${data?.thisMonthStats?.totalSales || 0}`}          
            increase="+10%"
            description="last month"
            variant="red"
            icon={<PersonAdd sx={{ color: "#FFF", fontSize: "22px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatBox
            title="Annual Forecast"
            value={`$${data ? data.yearlySalesTotal : "0"}`}
            increase="+30%"
            description="last month"
            variant="yellow"
            icon={<Traffic sx={{ color: "#FFF", fontSize: "22px" }} />}
          />
        </Box>

        {/* ROW 2 - OVERVIEW CHART (Now spanning full width like Image 2) */}
        <Box
          gridColumn="span 12"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="16px"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.04)"
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary, mb: "1rem" }}>
            Revenue Trend
          </Typography>
          <Box height="300px">
            <OverviewChart view="sales" isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 */}
        {/* Transactions (Span 8) */}
        <Box
          gridColumn="span 8"
          backgroundColor={theme.palette.background.alt}
          borderRadius="16px"
          p="1.5rem"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.04)"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: `1px solid ${theme.palette.divider}` },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.background.alt, color: theme.palette.text.primary, borderBottom: "none", borderRadius: "8px" },
            "& .MuiDataGrid-footerContainer": { borderTop: "none" },
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary, mb: "1rem", textTransform: "uppercase" }}>
            Recent Transactions
          </Typography>
          <DataGrid
            loading={isLoading}
            getRowId={(row) => row._id}
            rows={data?.transactions || []}
            columns={columns}
            autoHeight
            components={{
              NoRowsOverlay: () => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="h6" color={theme.palette.text.secondary}>No Orders Yet.</Typography>
                </Box>
              )
            }}
          />
        </Box>

        {/* Sales by Category (Span 4) */}
        <Box
          gridColumn="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="16px"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.04)"
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary, mb: "1rem", textTransform: "uppercase" }}>
            Sales by Category
          </Typography>
          <Box height="250px" display="flex" justifyContent="center">
            <BreakdownChart isDashboard={true} />
          </Box>
        </Box>
      </Box>

      {/* MODAL - UNTOUCHED */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt, color: theme.palette.text.primary, fontWeight: "bold" }}>
          Terminal POS: New Order
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <Box display="flex" gap="0.5rem" flexWrap="wrap" mt="1rem">
            {isMenuLoading ? <Typography>Loading Menu...</Typography> : (
               menuItems && menuItems.map((item) => (
                <Button key={item._id} variant="outlined" onClick={() => addToCart(item)}
                  sx={{ borderColor: theme.palette.primary.main, color: theme.palette.text.primary }}>
                  + {item.name} (₹{item.price})
                </Button>
              ))
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap="1.5rem" mt="2rem">
            <Box display="flex" gap="1rem" flexWrap="wrap">
              <TextField label="Customer Name" size="small" value={customerName} onChange={(e) => setCustomerName(e.target.value)} sx={{ flex: 1 }} />
              <Select size="small" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <MenuItem value="Dine-In">Dine-In</MenuItem>
                <MenuItem value="Takeaway">Takeaway</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </Select>
              <Select size="small" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </Select>
            </Box>
            <Box display="flex" gap="1rem" flexWrap="wrap">
              <TextField label="Staff Name" size="small" value={staffName} onChange={(e) => setStaffName(e.target.value)} sx={{ flex: 1 }} />
              <Select size="small" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} sx={{ flex: 1 }}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff Member">Staff Member</MenuItem>
                <MenuItem value="Serving Staff">Serving Staff</MenuItem>
              </Select>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="1rem">
              <Typography variant="h3" fontWeight="bold" color={theme.palette.primary.main}>
                Total: ₹{totalAmount}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color={theme.palette.text.secondary} mt="1rem" display="block">
            Cart ({cart.length} items): {cart.length > 0 ? cart.map(i => i.name).join(", ") : "Empty"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.alt, p: "1.5rem" }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: theme.palette.text.primary }}>Cancel</Button>
          <Button variant="contained" onClick={handlePunchOrder} disabled={isPunching || cart.length === 0}
            sx={{ backgroundColor: theme.palette.primary.main, color: "#FFF", fontWeight: "bold" }}>
            {isPunching ? "Processing..." : "GENERATE BILL"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;