import { Box, Typography } from "@mui/material";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" py={5} borderTop="1px solid black">
      <Typography textAlign="center">
        Copyright {year} &copy; Lasindu Nuwanga Weerasinghe
      </Typography>
    </Box>
  );
};

export default Footer;
