import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" py={5} borderTop="1px solid black">
      <Typography textAlign="center">
        Copyright 2023 &copy; Lasindu Nuwanga Weerasinghe
      </Typography>
    </Box>
  );
};

export default Footer;
