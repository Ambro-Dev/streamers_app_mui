import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import PropTypes from "prop-types";

// Icons
import back from "../../assets/icons/back.svg";
import quote from "../../assets/icons/quote.svg";
import add from "../../assets/icons/add.svg";
import remove from "../../assets/icons/remove.svg";
import defaultImage from "../../assets/default.png";

//Styles
import "./streamer-page.css";
import { axiosHandler } from "../../api/axios";
import countVotes from "../../hooks/countVotes";
import { Card } from "@mui/material";

const StreamerPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const streamerId = params.id;
  const [streamer, setStreamer] = React.useState({});
  const [platformImage, setPlatformImage] = React.useState("");
  const [votesUp, setVotesUp] = React.useState(0);
  const [votesUpPercentage, setVotesUpPercentage] = React.useState(0);
  const [votesDownPercentage, setVotesDownPercentage] = React.useState(0);
  const [votesDown, setVotesDown] = React.useState(0);
  const [allVotes, setAllVotes] = React.useState(0);
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const response = await axiosHandler.get(`/streamers/${streamerId}`, {
          signal,
        });
        setVotesUp(response.data.votes_up);
        setVotesDown(response.data.votes_down);
        setAllVotes(response.data.votes_up + response.data.votes_down);
        setStreamer(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [streamerId, reload]);

  React.useEffect(() => {
    const up = countVotes("up", votesUp, votesDown);
    const down = countVotes("down", votesUp, votesDown);
    if (!up && !down) {
      setVotesUpPercentage(50);
      setVotesDownPercentage(50);
      return;
    } else if (up === 0 && down !== 0) {
      setVotesUpPercentage(0);
      setVotesDownPercentage(100);
      return;
    } else if (up !== 0 && down === 0) {
      setVotesUpPercentage(100);
      setVotesDownPercentage(0);
      return;
    } else {
      setVotesUpPercentage(up);
      setVotesDownPercentage(down);
    }
  }, [votesUp, votesDown]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPlatforms = async () => {
      try {
        const response = await axiosHandler.get("/platforms", { signal });
        const platform = response.data.find(
          (platform) => platform.name === streamer.platform
        );
        setPlatformImage(
          `${process.env.REACT_APP_SERVER_URL}/platforms/${platform.image}`
        );
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPlatforms();

    return () => {
      controller.abort();
    };
  }, [streamer.platform]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleVoteUp = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      await axiosHandler.put(
        `/streamers/${streamerId}`,
        {
          votes_up: votesUp + 1,
        },
        { signal }
      );
      setReload(!reload);
    } catch (error) {
      console.log(error.message);
    }

    return () => {
      controller.abort();
    };
  };

  const handleVoteDown = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      await axiosHandler.put(
        `/streamers/${streamerId}`,
        {
          votes_down: votesDown + 1,
        },
        { signal }
      );
      setReload(!reload);
    } catch (error) {
      console.log(error.message);
    }

    return () => {
      controller.abort();
    };
  };

  function renderStyle() {
    switch (streamer.platform) {
      case "Twitch":
        return {
          boxShadow: "0 8px 32px 0 rgba(100, 65, 164, 0.37)",
          border: "2px solid #6441A4",
        };
      case "Youtube":
        return {
          boxShadow: "0 8px 32px 0 rgba(255, 0, 0, 0.37)",
          border: "2px solid #FF0000",
        };
      case "Kick":
        return {
          boxShadow: "0 8px 32px 0 rgba(109, 250, 163, 0.37)",
          border: "2px solid #6DFAA3",
        };
      case "Rumble":
        return {
          boxShadow: "0 8px 32px 0 rgba(24, 173, 19, 0.37)",
          border: "2px solid #2bbe26",
        };
      case "Trovo":
        return {
          boxShadow: "0 8px 32px 0 #0ef6cc",
          border: "2px solid #0ef6cc",
        };
      default:
        return {
          boxShadow: "0 8px 32px 0 #868686",
          border: "2px solid #868686",
        };
    }
  }

  return (
    <div className="streamer-page">
      <PageLayout>
        <Card>
          <div className="streamer-page-top">
            <img
              src={back}
              height={50}
              width={50}
              alt="go back"
              onClick={() => navigate(-1)}
            />
            <h1>{streamer.name}</h1>
          </div>
          <div className="streamer-page-content-top">
            <div className="streamer-page-content">
              <div className="streamer-page-content-left">
                <div className="streamer-page-content-description">
                  <img
                    src={quote}
                    height={20}
                    alt="start"
                    className="quote-start"
                  />
                  <span>{streamer.description}</span>
                  <img
                    src={quote}
                    height={20}
                    alt="end"
                    className="quote-start"
                  />
                </div>
              </div>
              <div className="streamer-page-content-right">
                <img
                  src={
                    streamer.image
                      ? `${process.env.REACT_APP_SERVER_URL}/streamers/${streamer.image}`
                      : defaultImage
                  }
                  style={renderStyle()}
                  alt="streamer-img"
                />
                <div className="platform-image">
                  <img
                    src={platformImage}
                    alt="platform"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="streamer-page-voting">
                  <button
                    className="voting-button-plus"
                    onClick={() => handleVoteUp()}
                  >
                    <img src={add} alt="vote-add" />
                  </button>
                  <button
                    className="voting-button-minus"
                    onClick={() => handleVoteDown()}
                  >
                    <img src={remove} alt="vote-remove" />
                  </button>
                </div>
              </div>
            </div>
            <div className="all-votes-box">
              <span>All votes: {allVotes}</span>
              <div className="all-votes-box-results">
                <div className="all-votes-box-percentage">
                  <div className="all-votes-box-percentage-up">
                    <span>Votes up:</span>
                    <span className="result-up">{votesUpPercentage}%</span>
                  </div>
                  <div className="all-votes-box-percentage-down">
                    <span>Votes down:</span>
                    <span className="result-down">{votesDownPercentage}%</span>
                  </div>
                </div>
                <div className="all-votes-box-bar">
                  <div
                    className="all-votes-box-bar-up"
                    style={{
                      width: `${votesUpPercentage}%`,
                    }}
                  />
                  <div
                    className="all-votes-box-bar-down"
                    style={{
                      width: `${votesDownPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </PageLayout>
    </div>
  );
};

StreamerPage.propTypes = {
  children: PropTypes.node,
};

export default StreamerPage;
