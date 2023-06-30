import { axiosHandler } from "../../api/axios";
import React from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Input,
  TextField,
  Typography,
} from "@mui/material";

const AddStreamerCard = ({ reload, setReload }) => {
  const [options, setOptions] = React.useState([]);
  const [name, setName] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (name && platform && description) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, platform, description]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const response = await axiosHandler.get("/platforms", { signal });
        setOptions(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleSubmit = async () => {
    const data = {
      name,
      platform,
      description,
    };
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      await axiosHandler
        .post("/streamers/add", data, { signal })
        .then((res) => {
          console.log(res.data);
        });
    } catch (error) {
      console.log(error.message);
    }
    setReload(!reload);
    setName("");
    setPlatform("");
    setDescription("");

    return () => {
      controller.abort();
    };
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "15px",
        background: "#56009c",
        boxShadow: "10px 10px 20px #4b0088, -10px -10px 20px #6100b0",
      }}
    >
      <Box p={2} color={"white"}>
        <Typography letterSpacing={2} variant="h5" fontWeight="600" p={2}>
          Submit streamer
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Typography px={2} pt={2} pb={1} textTransform="uppercase">
            Name
          </Typography>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              margin: "0 10px",
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "5px 10px",
              width: "calc(100% - 20px)",
            }}
          />
          <Typography px={2} pt={2} pb={1} textTransform="uppercase">
            Platform
          </Typography>
          <Autocomplete
            id="country-select-demo"
            sx={{
              width: "calc(100% - 20px)",
              margin: "0 10px",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
            options={options}
            autoHighlight
            clearOnEscape
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              if (!value) {
                setPlatform("");
                return;
              }
              setPlatform(value.name);
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  loading="lazy"
                  width="20"
                  src={`${process.env.PUBLIC_URL}/platforms/${option.image}`}
                  srcSet={`${process.env.PUBLIC_URL}/platforms/${option.image} 2x`}
                  alt=""
                />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
          <Typography textTransform="uppercase" px={2} pt={2} pb={1}>
            Description
          </Typography>
          <Input
            sx={{
              margin: "0 10px",
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "5px 10px",
              width: "calc(100% - 20px)",
            }}
            multiline
            rows={3}
            name="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              width: "calc(100% - 20px)",
              padding: "10px 0",
              margin: "20px 0px 10px 10px",
              backgroundColor: "#09ff00",
              color: "black",
              fontWeight: "bold",
              "&.Mui-disabled": {
                background: "#2d5f2b",
                color: "white",
              },
            }}
            disabled={disabled}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

AddStreamerCard.propTypes = {
  reload: PropTypes.bool,
  setReload: PropTypes.func,
};

export default AddStreamerCard;
