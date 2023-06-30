import {
  AppBar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "#56009c" }} position="static">
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight="bold"
            letterSpacing={2}
            sx={{ flexGrow: 1 }}
          >
            Streamer Spotlight
          </Typography>

          <Link
            href="https://github.com/Ambro-Dev/streamers_app"
            target="_blank"
          >
            <IconButton>
              <GitHubIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
