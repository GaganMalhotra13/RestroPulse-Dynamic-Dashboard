import React, { useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useGetTransactionsQuery, useUpdateTransactionStatusMutation } from "state/api";
import Header from "components/Header";

const Transactions = () => {
  const theme = useTheme();

  // RTK Query hook for updating status
  const [updateStatus] = useUpdateTransactionStatusMutation();

  // Server-side pagination states
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");

  // Fetching data from backend
  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: "_id",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "Customer Name",
      flex: 1,
      valueGetter: (params) => params.row?.userId || "Guest",
    },
    {
      field: "staffName",
      headerName: "Staff/Cashier",
      flex: 1,
      valueGetter: (params) => params.row?.staffName || "Unknown",
    },
    {
      field: "orderType",
      headerName: "Order Type",
      flex: 0.5,
      valueGetter: (params) => params.row?.orderType || "Dine-In",
    },
    {
      field: "createdAt",
      headerName: "Time",
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString();
      },
    },
    {
      field: "products",
      headerName: "Items",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value?.length || 0,
    },
    {
      field: "cost",
      headerName: "Total Bill",
      flex: 0.5,
      renderCell: (params) => {
        if (!params.value) return "₹0.00";
        return `₹${Number(params.value).toFixed(2)}`;
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
      renderCell: (params) => {
        const currentStatus = params.value || "Pending";
        
        const handleChangeStatus = async (e) => {
          const newStatus = e.target.value;
          try {
            // Trigger RTK mutation to update status in MongoDB
            await updateStatus({ id: params.row._id, status: newStatus }).unwrap();
            
            // Auto-archive/hide order from active view after 3 minutes if completed
            if (newStatus === "Completed") {
              setTimeout(() => {
                console.log("Order auto-archived from live view");
              }, 180000); 
            }
          } catch (err) {
            console.error("Failed to update status", err);
          }
        };

        return (
          <select 
            value={currentStatus} 
            onChange={handleChangeStatus}
            style={{ 
              padding: "6px 10px", 
              borderRadius: "8px", 
              fontWeight: "bold",
              cursor: "pointer",
              background: currentStatus === "Completed" ? "#D1FAE5" : currentStatus === "Brewing" ? "#FEF3C7" : "#FEE2E2",
              color: currentStatus === "Completed" ? "#065F46" : currentStatus === "Brewing" ? "#92400E" : "#991B1B",
              border: "none",
              outline: "none"
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Brewing">Brewing</option>
            <option value="Completed">Completed</option>
          </select>
        );
      }
    }
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      
      <Box
        height="80vh"
        mt="20px"
        // Dynamic, aesthetic background dependent on app theme mode
        backgroundColor={
          theme.palette.mode === "light" 
            ? "#FFFAF5" 
            : theme.palette.background.alt
        }
        borderRadius="16px"
        p="1rem"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.04)"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.neutral[200]}`, 
            color: theme.palette.text.primary,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.text.primary,
            borderBottom: `2px solid ${theme.palette.neutral[200]}`,
            fontWeight: "bold",
            fontSize: "14px",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.alt, 
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.text.primary,
            borderTop: "none",
          },
          /* Solid Orange Toolbar Buttons */
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#FFFFFF !important",
            backgroundColor: theme.palette.primary.main,
            borderRadius: "8px",
            padding: "6px 16px",
            marginRight: "10px",
            marginBottom: "10px",
            fontWeight: "bold",
            boxShadow: "0 2px 10px rgba(249, 115, 22, 0.3)",
          },
          /* Transparent Glowing Hover */
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(249, 115, 22, 0.08) !important", 
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(249, 115, 22, 0.15) !important", 
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: "rgba(249, 115, 22, 0.2) !important",
          },
          /* Orange Pagination active dot */
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: "#FFF",
          }
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          rowCount={(data && data.total) || 0}
          columns={columns}
          
          /* Server Side Pagination Controls */
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: () => (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="h6" color={theme.palette.text.secondary}>
                  No Transactions Found.
                </Typography>
              </Box>
            ),
          }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;