import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box height="100vh" display="flow-root">
      <Typography variant="h3" fontWeight={900} ml="10vw" mt="30vh">
        Lasindu Nuwanga Weerasinghe
      </Typography>
      <Typography variant="h4" ml="10vw" mt="5vh">
        Senior Software Engineer
      </Typography>
      <Typography variant="h5" ml="10vw" mt="5vh">
        Mobile Apps Developer
      </Typography>
    </Box>
  );
}
