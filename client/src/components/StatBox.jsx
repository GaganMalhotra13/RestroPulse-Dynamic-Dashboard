import React from "react";
import { Box, Typography } from "@mui/material";
import { FlexBetween } from ".";

const StatBox = ({ title, value, increase, icon, description, variant }) => {
  // Define premium gradients based on the variant prop
  const getGradient = (type) => {
    switch (type) {
      case "orange": return "linear-gradient(135deg, #F97316 0%, #FB923C 100%)";
      case "teal": return "linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)";
      case "red": return "linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)";
      case "yellow": return "linear-gradient(135deg, #FBBF24 0%, #FCD34D 100%)";
      default: return "linear-gradient(135deg, #F97316 0%, #FB923C 100%)";
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.5rem"
      flex="1 1 100%"
      sx={{
        background: getGradient(variant),
        borderRadius: "16px",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)", // Soft floating shadow
        color: "#FFFFFF", // All text inside is pure white
      }}
    >
      <FlexBetween alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap="0.5rem">
          {/* Icon & Title Row */}
          <Box display="flex" alignItems="center" gap="0.5rem">
            {icon}
            <Typography variant="h6" fontWeight="500" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {title}
            </Typography>
          </Box>

          {/* Main Value */}
          <Typography variant="h3" fontWeight="700" sx={{ color: "#FFFFFF", mt: "0.25rem" }}>
            {value}
          </Typography>
        </Box>

        {/* Top Right Percentage Badge (Pill shape) */}
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "4px 10px",
            borderRadius: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <Typography variant="body2" fontWeight="600" color="#FFFFFF">
            {increase}
          </Typography>
        </Box>
      </FlexBetween>

      {/* Description at the bottom */}
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: "1rem" }}>
        Since {increase} {description}
      </Typography>
    </Box>
  );
};

export default StatBox;