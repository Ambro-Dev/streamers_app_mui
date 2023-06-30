import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        color={"white"}
        variant="body1"
        fontWeight={600}
        letterSpacing={1}
        sx={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Made with ❤️ by{" "}
        <Link
          href="https://github.com/Ambro-Dev"
          target="_blank"
          sx={{ color: "white", fontWeight: "bold", textDecoration: "none" }}
        >
          Ambro-Dev
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
