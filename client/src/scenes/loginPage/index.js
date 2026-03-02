import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 👈 Dispatch error fixed!
  
  // Toggle between Login and Signup
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  
  // Form State (Schema se match karne ke liye role ab 'diner' hai)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "diner" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5001/auth/login" : "http://localhost:5001/auth/register";
    
    try {
      // API Call
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include" // 🚨 SUPER IMPORTANT FOR COOKIES!
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          dispatch(setLogin({ user: data.user }));
          navigate("/dashboard"); // Login ke baad direct dashboard
        } else {
          setPageType("login"); // Signup ke baad wapas login screen dikhao
          setFormData({ name: "", email: "", password: "", role: "diner" }); // Form reset
          alert("Signup successful! Please login to continue."); 
        }
      } else {
        alert(data.msg || data.error || "Kuch gadbad hai!");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Network error. Backend check karo!");
    }
  };

  return (
    <Box width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center" backgroundColor={theme.palette.background.default}>
      <Box width="400px" p="2rem" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt} boxShadow={3}>
        <Typography fontWeight="bold" fontSize="32px" color={theme.palette.primary.main} textAlign="center" mb="1.5rem">
          RestroPulse
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} value={formData.name} required />
          )}
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} value={formData.email} required />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} value={formData.password} required />
          
          <Button fullWidth type="submit" sx={{ m: "2rem 0", p: "1rem", backgroundColor: theme.palette.primary.main, color: theme.palette.background.alt, "&:hover": { color: theme.palette.primary.main } }}>
            {isLogin ? "LOGIN" : "SIGN UP"}
          </Button>

          <Typography onClick={() => setPageType(isLogin ? "register" : "login")} sx={{ textDecoration: "underline", color: theme.palette.primary.main, cursor: "pointer", textAlign: "center" }}>
            {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;