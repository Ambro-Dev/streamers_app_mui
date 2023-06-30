import React from "react";
import PropTypes from "prop-types";
import "./texttyping.css";

const TextTyping = ({ texts, speed }) => {
  const [string, setString] = React.useState("");
  const [index, setIndex] = React.useState(0);

  function typeText(text) {
    const interval = setInterval(() => {
      setString((prevString) => {
        if (prevString.length === text.length) {
          clearInterval(interval);
          if (index === 0) setIndex(1);
          else if (index === 2) setIndex(3);
          return prevString; // Reset the string to the initial value
        }
        return text.slice(0, prevString.length + 1);
      });
    }, speed);

    return () => clearInterval(interval);
  }

  function deleteText() {
    setTimeout(() => {
      const interval = setInterval(() => {
        setString((prevString) => {
          if (prevString.length === 0) {
            clearInterval(interval);
            if (index === 1) setIndex(2);
            else if (index === 3) setIndex(0);
            return ""; // Reset the string to the initial value
          }
          return prevString.slice(0, -1);
        });
      }, speed);

      return () => clearInterval(interval);
    }, 1000);
  }

  React.useEffect(() => {
    switch (index) {
      case 0:
        typeText(texts[0]);
        break;
      case 1:
        deleteText();
        break;
      case 2:
        typeText(texts[1]);
        break;
      case 3:
        deleteText();
        break;
      default:
        break;
    }
  }, [index, texts, speed]);

  return (
    <div className="text-box">
      <div className="welcome">
        <span>Welcome!</span>
      </div>
      <div className="text">
        <span>{string}</span>
        <span className="cursor">|</span>
      </div>
    </div>
  );
};

TextTyping.prototype = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
};

export default TextTyping;
