import React from "react";
import { Box, Typography, Button, useTheme, Container, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    { icon: <QueryStatsIcon sx={{ fontSize: 40 }}/>, title: "Real-Time Analytics", desc: "Track sales, customers, and performance with dynamic Nivo charts." },
    { icon: <SecurityIcon sx={{ fontSize: 40 }}/>, title: "Role-Based Access", desc: "Secure JWT authentication with Admin, Manager, and User tiers." },
    { icon: <PublicIcon sx={{ fontSize: 40 }}/>, title: "Geography Mapping", desc: "Visualize your customer base globally with interactive maps." }
  ];

  return (
    <Box width="100%" minHeight="100vh" backgroundColor={theme.palette.background.default} color={theme.palette.neutral.main}>
      {/* HERO SECTION */}
      <Container maxWidth="md" sx={{ pt: 15, pb: 8, textAlign: "center" }}>
        <Typography variant="h1" fontWeight="bold" color={theme.palette.primary.main} sx={{ fontSize: { xs: "3rem", md: "5rem" }, mb: 2 }}>
          RestroPulse
        </Typography>
        <Typography variant="h4" sx={{ mb: 4, color: theme.palette.secondary.main }}>
          The Ultimate Restaurant Analytics Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, fontSize: "1.2rem" }}>
          Turn your restaurant data into actionable insights. Monitor daily transactions, track global sales, and manage your team from one unified, secure platform.
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.alt,
            fontSize: "1.2rem",
            padding: "12px 32px",
            borderRadius: "50px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: theme.palette.secondary.main }
          }}
        >
          Get Started Now
        </Button>
      </Container>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ 
                height: "100%", 
                backgroundColor: theme.palette.background.alt, 
                textAlign: "center", 
                p: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "translateY(-10px)" }
              }}>
                <CardContent>
                  <Box color={theme.palette.primary.main} mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" mb={1} color={theme.palette.neutral.light}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.neutral.main}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;