import { Container } from "@mui/material";
import Footer from "../Footer";
import Navbar from "../Navbar";
import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: "20px" }} fixed>
        {children}
      </Container>
      <Footer />
    </>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
};

export default PageLayout;
