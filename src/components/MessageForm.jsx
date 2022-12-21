import React from "react";
import Attachment from "./svg/Attachment";
import picture from "../img/image.png"

const MessageForm = ({ handleSubmit, text, setText, setImg, img }) => {


  return (
    <form className="message_form" onSubmit={handleSubmit}>
      {img ? <img src={picture} alt="img" style={{
        height: "35px",
        width: "35px",
        objectFit: "contain",
        marginRight: "10px",
        border: "2px solid gray",
        borderRadius:"10px"
      }}
      /> : null}
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn msgbtn" disabled={img || text ? false : true}><i className="fas fa-paper-plane"></i></button>
      </div>
    </form>
  );
};

export default MessageForm;
