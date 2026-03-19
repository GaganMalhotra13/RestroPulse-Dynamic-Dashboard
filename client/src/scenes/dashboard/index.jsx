import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
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
  useTheme,TextField, // 👈 Ye add kiya
  Select,    // 👈 Ye add kiya
  MenuItem,
  useMediaQuery,
  Alert,
  IconButton,Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetDashboardQuery,useAddTransactionMutation, useGetProductsQuery } from "state/api";
import {
  FlexBetween,
  Header,
  BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";

const Dashboard = () => {
  // theme
  const theme = useTheme();
  // is large desktop screen
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  // get data
  const { data, isLoading } = useGetDashboardQuery();
  // banner state
  const [showBanner, setShowBanner] = useState(false);

  // check local storage on mount
  useEffect(() => {
    const bannerDismissed = localStorage.getItem("bannerDismissed");
    if (!bannerDismissed) {
      setShowBanner(true);
    }
  }, []);

  // handle banner close
  const handleBannerClose = () => {
    setShowBanner(false);
    localStorage.setItem("bannerDismissed", "true");
  };
  
const [addTransaction, { isLoading: isPunching }] = useAddTransactionMutation();  const [orderAmount, setOrderAmount] = useState("");
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
        // 🟢 NAYE FIELDS BHEJ RAHE HAIN
        orderType: orderType,
        staffName: staffName,
        staffRole: staffRole,
        cartItems: cart // 👈 Pie chart calculation ke liye poora cart bhej rahe hain
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
  // data columns
  const columns = [
    {
      field: "_id",
      headerName: "ORDER ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 0.5,
    },
    {field: "createdAt",
      headerName: "Time",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      ffield: "products",
      headerName: "Items",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value?.length || 0,    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* Banner Alert */}
      {showBanner && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleBannerClose}
            >
              <Close fontSize="inherit" aria-label="Close Alert" />
            </IconButton>
          }
        >
          Initial load may take 1-2 minutes due to server sleep after
          inactivity.
        </Alert>
      )}

      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box display="flex" gap="1rem">
          {/* 🟢 NAYA BUTTON JO MODAL KHOLEGA */}
          <Button 
            variant="contained" 
            onClick={() => setIsModalOpen(true)}
            sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.background.alt, fontWeight: "bold" }}
          >
            + PLACE NEW ORDER
          </Button>
          
          {/* Tera purana download button */}
          <Button sx={{ backgroundColor: theme.palette.secondary.light, color: theme.palette.background.alt }}>
             Download Reports
          </Button>
        </Box>
      </FlexBetween>
             
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 */}
        {/* Total Diners */}
        <StatBox
          title="Total Diners"
          value={data && data.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Sales Today */}
        <StatBox
          title="Sales Today"
          value={data && data.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
       
        {/* Overview Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>

        {/* Monthly Gross Profit */}
        <StatBox
          title="Monthly Gross Profit"
          value={data?.thisMonthStats?.totalSales || 0}          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Annual Forecast */}
        <StatBox
          title="Annual Forecast"
          value={data && data.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        {/* Transactions */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading}
            getRowId={(row) => row._id}
            rows={data?.transactions || []}
            columns={columns}
          components={{
              NoRowsOverlay: () => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="h5" color={theme.palette.secondary[200]}>
                    No Orders Yet. Please Punch an Order! 🚀
                  </Typography>
                </Box>
              )
            }}
          />
        </Box>

        {/* Sales by Category */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales by Category
          </Typography>

          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{
              color: theme.palette.secondary[200],
            }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales
          </Typography>
        </Box>
      </Box><Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt, color: theme.palette.secondary.main, fontWeight: "bold" }}>
          Terminal POS: New Order
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          
          {/* Menu Items */}
          <Box display="flex" gap="0.5rem" flexWrap="wrap" mt="1rem">
            {isMenuLoading ? <Typography>Loading Menu...</Typography> : (
               menuItems && menuItems.map((item) => (
                <Button key={item._id} variant="outlined" onClick={() => addToCart(item)}
                  sx={{ borderColor: theme.palette.primary.main, color: theme.palette.neutral.main }}>
                  + {item.name} (₹{item.price})
                </Button>
              ))
            )}
          </Box>

          {/* Billing Controls */}
          {/* Billing & Staff Controls */}
          <Box display="flex" flexDirection="column" gap="1.5rem" mt="2rem">
            {/* Row 1: Customer & Order Details */}
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

            {/* Row 2: Staff Details */}
            <Box display="flex" gap="1rem" flexWrap="wrap">
              <TextField label="Staff Name" size="small" value={staffName} onChange={(e) => setStaffName(e.target.value)} sx={{ flex: 1 }} />
              <Select size="small" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} sx={{ flex: 1 }}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff Member">Staff Member</MenuItem>
                <MenuItem value="Serving Staff">Serving Staff</MenuItem>
              </Select>
            </Box>

            {/* Total Display */}
            <Box display="flex" justifyContent="flex-end" mt="1rem">
              <Typography variant="h3" fontWeight="bold" color={theme.palette.primary.main}>
                Total: ₹{totalAmount}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color={theme.palette.neutral[400]} mt="1rem" display="block">
            Cart ({cart.length} items): {cart.length > 0 ? cart.map(i => i.name).join(", ") : "Empty"}
          </Typography>

        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.alt, p: "1.5rem" }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: theme.palette.neutral.main }}>Cancel</Button>
          <Button variant="contained" onClick={handlePunchOrder} disabled={isPunching || cart.length === 0}
            sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.background.alt, fontWeight: "bold" }}>
            {isPunching ? "Processing..." : "GENERATE BILL"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
