import { Box, Typography } from "@mui/material";

const MyStoryPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        boxShadow: "inset 0 0 20px 2px rgb(0 0 0)",
      }}
    >
      <Typography textAlign="center" variant="h3">
        I am glad you are here.
        <br />
        Unfortunately, I am still working on this page.
        <br />
        Please come back later.
      </Typography>
    </Box>
  );
};

export default MyStoryPage;
