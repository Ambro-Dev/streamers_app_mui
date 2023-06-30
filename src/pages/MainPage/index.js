//styles
import "./main-page.css";

//Components
import Table from "../../components/Table";
import TextTyping from "../../components/TextTyping";

import PageLayout from "../../components/PageLayout";
import AddStreamerCard from "../../components/AddStreamerCard";
import React from "react";
import { Box, Grid } from "@mui/material";

function MainPage() {
  const [reload, setReload] = React.useState(false);

  return (
    <PageLayout>
      <Box display="flex" flexDirection="column">
        <Box pb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextTyping
                texts={["Submit new streamer", "Select streamer from the list"]}
                speed={200}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AddStreamerCard reload={reload} setReload={setReload} />
            </Grid>
          </Grid>
        </Box>

        <Table reload={reload} setReload={setReload} />
      </Box>
    </PageLayout>
  );
}

export default MainPage;
