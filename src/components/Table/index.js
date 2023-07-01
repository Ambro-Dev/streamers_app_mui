import React from "react";
import { useNavigate } from "react-router-dom";
import { axiosHandler } from "../../api/axios";
import PropTypes from "prop-types";

//default image
import default_image from "../../assets/default.png";

//Styles
import "./table.css";

import { Box, Card } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

const Table = ({ reload, setReload }) => {
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState(data);
  const [platforms, setPlatforms] = React.useState([]);

  React.useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const fetchData = async () => {
      try {
        const response = await axiosHandler.get(
          "/platforms",
          {
            signal: signal,
          },
          { signal: AbortSignal.timeout(5000) }
        );
        setPlatforms(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        const response = await axiosHandler.get(
          "/streamers",
          {
            signal: signal,
          },
          { signal: AbortSignal.timeout(5000) }
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [reload]);

  const setPlatformImage = (platform) => {
    const selectPaltform = platforms.find((item) => item.name === platform);
    if (!selectPaltform) {
      return null;
    }
    return `${process.env.REACT_APP_SERVER_URL}/platforms/${selectPaltform.image}`;
  };

  const columns = [
    {
      accessorKey: "image",
      header: "",
      enableColumnFilter: false,
      enableColumnActions: false,
      muiTableHeadCellProps: { sx: { color: "green" } },
      Cell: ({ renderedCellValue }) => (
        <img
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
          src={
            renderedCellValue
              ? `${process.env.REACT_APP_SERVER_URL}/streamers/${renderedCellValue}`
              : default_image
          }
          alt="streamer"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      muiTableHeadCellProps: { sx: { color: "green" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "platform",
      header: "Platform",
      muiTableHeadCellProps: { sx: { color: "green" } },
      enableColumnFilter: false,
      enableColumnActions: false,
      filterValue: (row) => row.platform,
      Cell: ({ renderedCellValue }) => {
        const image = setPlatformImage(renderedCellValue);
        return (
          <Box
            alignItems="center"
            justifyContent="center"
            display="inline-flex"
          >
            {image && (
              <img
                width={20}
                src={image}
                alt="pltform"
                style={{ paddingRight: "10px" }}
              />
            )}

            <strong>{renderedCellValue}</strong>
          </Box>
        );
      },
    },
    {
      accessorKey: "votes_up",
      header: "Votes Up",
      enableColumnFilter: false,
      enableColumnActions: false,
      muiTableHeadCellProps: { sx: { color: "green" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "votes_down",
      header: "Votes Down",
      enableColumnFilter: false,
      enableColumnActions: false,
      muiTableHeadCellProps: { sx: { color: "green" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
  ];

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "15px",
        background: "#56009c",
        boxShadow: "10px 10px 20px #4b0088, -10px -10px 20px #6100b0",
      }}
    >
      <Box p={2}>
        <MaterialReactTable
          columns={columns}
          data={filteredData}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              console.log(row);
              navigate(`/streamer/${row.original.id}`);
            },
            sx: {
              cursor: "pointer", //you might want to change the cursor too when adding an onClick
            },
          })}
        />
      </Box>
    </Card>
  );
};

Table.propTypes = {
  reload: PropTypes.bool,
  setReload: PropTypes.func,
};

export default Table;
