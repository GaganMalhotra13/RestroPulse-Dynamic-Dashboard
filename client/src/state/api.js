import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend Api
export const api = createApi({
  baseQuery: fetchBaseQuery({
     //baseUrl:   "http://localhost:5001",
    baseUrl: "https://restropulse-backend.onrender.com",    //   process.env.REACT_APP_BASE_URL ||
  }), // base url
  reducerPath: "adminApi",
  // tags
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance","Analytics",
    "Dashboard",
  ],
  
  // endpoints
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    // 1. GET ROUTE: Ise batana hai ki ye data "Transactions" tag ka hai
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"], // 👈 YE ZAROORI HAI
    }),

    // 2. POST ROUTE: Ise batana hai ki order punch hone pe purane tags ko "stale" (purana) ghoshit kar de
    addTransaction: build.mutation({
      query: (body) => ({
        url: "client/transactions", // Tera API route
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions", "Dashboard", "Performance"], // 👈 JAISE HI ORDER PUNCH HOGA, YE TEENO PAGE REFRESH HONGE
    }),
    updateTransactionStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `client/transactions/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Transactions"], // Refreshes the grid when status is changed
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    getDailyRevenue: build.query({
      query: () => "analytics/daily-revenue",
      providesTags: ["Analytics"],
    }),
    getPeakHours: build.query({
      query: () => "analytics/peak-hours",
      providesTags: ["Analytics"],
    }),
    addProduct: build.mutation({
      query: (newProductData) => ({
        url: "client/products",
        method: "POST",
        body: newProductData,
      }),
      // Isse add hote hi list apne aap refresh ho jayegi
      invalidatesTags: ["Products"], 
    }),
   
  }),
});

// export api endpoints
export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetDailyRevenueQuery, 
  useAddProductMutation,
  useGetPeakHoursQuery,useAddTransactionMutation, useUpdateTransactionStatusMutation
} = api;
