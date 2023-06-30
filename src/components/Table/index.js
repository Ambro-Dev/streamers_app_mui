import React from "react";
import { useNavigate } from "react-router-dom";
import { axiosHandler } from "../../api/axios";
import countVotes from "../../hooks/countVotes";
import PropTypes from "prop-types";

//default image
import default_image from "../../assets/default.png";

//Styles
import "./table.css";

//Icons
import arrow_up from "../../assets/icons/arrow-up.svg";
import arrow_down from "../../assets/icons/arrow-down.svg";
import up_vote from "../../assets/icons/up_vote.svg";
import down_vote from "../../assets/icons/down_vote.svg";
import filter from "../../assets/icons/filter.svg";
import checkbox from "../../assets/icons/checkbox.svg";
import empty_checkbox from "../../assets/icons/empty-checkbox.svg";
import close from "../../assets/icons/close.svg";
import { Box, Card } from "@mui/material";

const Table = ({ reload, setReload }) => {
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);

  const [sort, setSort] = React.useState("name_asc");
  const [filteredPlatforms, setFilteredPlatforms] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState(data);
  const [selectedPage, setSelectedPage] = React.useState(1);
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

  const changeFilter = (filter) => {
    setSelectedPage(1);
    if (filter === "name") {
      if (!sort.includes(filter)) {
        const sortedData = filteredData.sort((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        setSort(`${filter}_asc`);
        setFilteredData(sortedData);
      } else if (sort.includes(`${filter}_asc`)) {
        const sortedData = filteredData.sort((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 0;
        });
        setSort(`${filter}_desc`);
        setFilteredData(sortedData);
      } else {
        const sortedData = filteredData.sort((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        setSort(`${filter}_asc`);
        setFilteredData(sortedData);
      }
    } else {
      if (!sort.includes(filter)) {
        const sortedData = filteredData.sort(
          (a, b) =>
            b.votes_up / (b.votes_up + b.votes_down) -
            a.votes_up / (a.votes_up + a.votes_down)
        );
        setSort(`${filter}_asc`);
        setFilteredData(sortedData);
      } else if (sort.includes(`${filter}_asc`)) {
        const sortedData = filteredData.sort(
          (a, b) =>
            a.votes_up / (a.votes_up + a.votes_down) -
            b.votes_up / (b.votes_up + b.votes_down)
        );
        setSort(`${filter}_desc`);
        setFilteredData(sortedData);
      } else {
        const sortedData = filteredData.sort(
          (a, b) =>
            b.votes_up / (b.votes_up + b.votes_down) -
            a.votes_up / (a.votes_up + a.votes_down)
        );
        setSort(`${filter}_asc`);
        setFilteredData(sortedData);
      }
    }
  };

  function setImage(platform) {
    const platformName = platform.toLowerCase();

    const platformImage = platforms.find(
      (platform) => platform.name.toLowerCase() === platformName
    );

    if (!platformImage) {
      return null;
    }

    return `${process.env.REACT_APP_SERVER_URL}/platforms/${platformImage.image}`;
  }

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    const filteredData = data.filter((item) => {
      return item.name.toLowerCase().includes(search);
    });
    setFilteredData(filteredData);
  };

  const renderPagination = () => {
    const pages = Math.ceil(filteredData.length / 10);
    function selectedStyle(number) {
      return {
        backgroundColor: selectedPage === number ? "#0ef6cc" : undefined,
        color: selectedPage === number ? "#000" : undefined,
      };
    }
    if (selectedPage > 3 && pages > 5 && selectedPage < pages - 2) {
      return (
        <>
          <div className="pagination-item" onClick={() => setSelectedPage(1)}>
            1
          </div>
          <div className="pagination-item-dots">...</div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(selectedPage - 1)}
          >
            {selectedPage - 1}
          </div>
          <div className="pagination-item" style={selectedStyle(selectedPage)}>
            {selectedPage}
          </div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(selectedPage + 1)}
          >
            {selectedPage + 1}
          </div>
          <div className="pagination-item-dots">...</div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(pages)}
          >
            {pages}
          </div>
        </>
      );
    } else if (selectedPage > 3 && pages > 5 && selectedPage >= pages - 2) {
      return (
        <>
          <div className="pagination-item" onClick={() => setSelectedPage(1)}>
            1
          </div>
          <div className="pagination-item-dots">...</div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(pages - 3)}
          >
            {pages - 3}
          </div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(pages - 2)}
            style={selectedStyle(pages - 2)}
          >
            {pages - 2}
          </div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(pages - 1)}
            style={selectedStyle(pages - 1)}
          >
            {pages - 1}
          </div>
          <div
            className="pagination-item"
            onClick={() => setSelectedPage(pages)}
            style={selectedStyle(pages)}
          >
            {pages}
          </div>
        </>
      );
    }

    const pagination = [];
    for (let i = 0; i < pages && i < 4; i++) {
      pagination.push(
        <div
          className="pagination-item"
          key={i}
          onClick={() => setSelectedPage(i + 1)}
          style={selectedStyle(i + 1)}
        >
          {i + 1}
        </div>
      );
    }
    if (pages > 5) {
      pagination.push(
        <>
          <div className="pagination-item" key="dots">
            ...
          </div>
          <div
            className="pagination-item"
            key={pages}
            onClick={() => setSelectedPage(pages)}
          >
            {pages}
          </div>
        </>
      );
    }
    return pagination;
  };

  const filterPlatforms = () => {
    const newArray = data.filter((item) => {
      const itemName = item.platform.toLowerCase();
      const platformsFiltered = filteredPlatforms.filter((platform) => {
        const platformName = platform.name.toLowerCase();
        return itemName === platformName;
      });
      return platformsFiltered.length > 0;
    });
    setFilteredData(newArray);
    setShowFilter(false);
  };

  const handleCheckbox = (platform) => {
    const includes = filteredPlatforms.filter(
      (filter) => filter.name === platform.name
    );
    if (includes.length > 0) {
      const newArray = filteredPlatforms.filter(
        (item) => item.name.toLowerCase() !== platform.name.toLowerCase()
      );
      setFilteredPlatforms(newArray);
    } else {
      setFilteredPlatforms([...filteredPlatforms, platform]);
    }
  };

  function checkboxIcon(platform) {
    const find = filteredPlatforms.filter(
      (item) => item.name.toLowerCase() === platform.name.toLowerCase()
    );
    if (find.length > 0) {
      return checkbox;
    } else {
      return empty_checkbox;
    }
  }

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
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e)}
            name="search"
          />
        </div>
        <div className="table">
          <div className="table-header">
            <div
              className="table-header-item"
              onClick={() => changeFilter("name")}
            >
              <span>Name</span>
              {sort.includes("name") && (
                <img
                  className="filter-arrow"
                  height={30}
                  width={30}
                  src={sort === "name_asc" ? arrow_up : arrow_down}
                  alt="filter-arrow"
                />
              )}
            </div>
            <div
              className="table-header-item"
              onClick={() => setShowFilter(true)}
            >
              <span>Platform</span>
              <img
                className="filter-arrow"
                height={30}
                width={30}
                src={filter}
                alt="filter-arrow"
              />
            </div>
            {showFilter && (
              <div className="platform-filter">
                <div className="platform-filter-top">
                  <span>Select:</span>
                  <img
                    src={close}
                    alt="exit"
                    height={20}
                    width={20}
                    onClick={() => setShowFilter(false)}
                  />
                </div>
                {platforms.length > 0 &&
                  platforms.map((platform) => (
                    <div
                      className="platform-filter-item"
                      key={platform.id}
                      onClick={() => handleCheckbox(platform)}
                    >
                      <img
                        src={checkboxIcon(platform)}
                        height={20}
                        width={20}
                        alt={`checked-${platform.name}`}
                      />
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}/platforms/${platform.image}`}
                        height={20}
                        width={20}
                        alt={`platform-${platform.name}`}
                      />
                      <span>{platform.name}</span>
                    </div>
                  ))}
                <button onClick={() => filterPlatforms()}>Apply</button>
              </div>
            )}
            <div
              className="table-header-item"
              onClick={() => changeFilter("votes")}
            >
              <span>Votes</span>
              {sort.includes("votes") && (
                <img
                  className="filter-arrow"
                  height={30}
                  width={30}
                  src={sort === "votes_asc" ? arrow_up : arrow_down}
                  alt="filter-arrow"
                />
              )}
            </div>
          </div>
          <div className="table-body">
            {filteredData.length > 0 &&
              filteredData
                .filter(
                  (item, index) =>
                    index >= (selectedPage - 1) * 10 &&
                    index < selectedPage * 10
                )
                .map((item) => {
                  const votesUp = item.votes_up
                    ? countVotes("up", item.votes_up, item.votes_down)
                    : 0;
                  const votesDown = item.votes_down
                    ? countVotes("down", item.votes_up, item.votes_down)
                    : 0;
                  return (
                    <div className="table-body-row" key={item.id}>
                      <div
                        className="table-body-item"
                        onClick={() => navigate(`/streamer/${item.id}`)}
                      >
                        <div className="img-box">
                          <img
                            className="image"
                            src={
                              item.image
                                ? `${process.env.REACT_APP_SERVER_URL}/streamers/${item.image}`
                                : default_image
                            }
                            height={100}
                            width={100}
                            alt="xqc"
                          />
                          <span>{item.name}</span>
                        </div>
                      </div>
                      <div className="table-body-item">
                        <img
                          src={setImage(item.platform)}
                          alt={`${item.platform}-img`}
                          height={25}
                          width={25}
                        />
                      </div>
                      <div className="table-body-item">
                        <div className="votes-up-box">
                          <img
                            src={up_vote}
                            alt="up-vote"
                            height={30}
                            width={30}
                          />
                          <span>{votesUp}%</span>
                        </div>
                        <div className="votes-down-box">
                          <img
                            src={down_vote}
                            alt="down-vote"
                            height={30}
                            width={30}
                          />
                          <span>{votesDown}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
          {filteredData.length > 10 && (
            <div className="pagination">{renderPagination()}</div>
          )}
        </div>
      </Box>
    </Card>
  );
};

Table.propTypes = {
  reload: PropTypes.bool,
  setReload: PropTypes.func,
};

export default Table;
