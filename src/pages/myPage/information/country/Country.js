import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import countryTrans from "../../../../util/countryTrans";

import { db_userInfo } from "../../../../util/firebase";

const CountryDiv = styled.div`
  display: flex;
`;
const MyCountryDiv = styled.div`
  font-size: 88px;
  display: flex;
  align-items: baseline;
  @media (max-width: 1180px) {
    font-size: 40px;
    line-height: 50px;
  }
`;
const EditIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  display: none;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const EditDiv = styled.div`
  display: none;
  align-items: center;
  height: 138px;
`;
const SearchDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(255, 255, 255, 0.3);
`;
const TextFieldDiv = styled.div`
  margin-left: 20px;
  align-self: center;
`;
const Inputdiv = styled.input`
  width: 240px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: white;
    font-size: 20px;
  }
`;
const Submit = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const Cancel = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;

export default function Country({ country }) {
  const myCountryRef = useRef();
  const editMyCountryIconRef = useRef();
  const editCountryRef = useRef();
  const countryInputRef = useRef();
  const [country2id, setCountry2id] = useState({});
  const myUserId = useSelector((state) => state.myUserId);

  useEffect(() => {
    const country2id = Object.entries(countryTrans).reduce(
      (acc, [key, { name_en }]) => {
        acc[name_en] = key;
        return acc;
      },
      {}
    );
    setCountry2id(country2id);
  }, []);

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }
  function handleSubmitCountry() {
    if (country2id[countryInputRef.current.value]) {
      db_userInfo
        .doc(myUserId)
        .update({
          country: country2id[countryInputRef.current.value],
        })
        .then(() => {
          handleShow(myCountryRef);
          handleDisappear(editCountryRef);
        });
    } else {
      countryInputRef.current.parentNode.parentNode.style.outline =
        "4px #AE0000 solid";
    }
  }

  return (
    <CountryDiv
      onMouseEnter={() => handleShow(editMyCountryIconRef)}
      onMouseLeave={() => handleDisappear(editMyCountryIconRef)}
    >
      <MyCountryDiv ref={myCountryRef}>
        {country ? countryTrans[country].name_en : ""}
        <EditIcon
          ref={editMyCountryIconRef}
          onClick={() => {
            handleShow(editCountryRef);
            handleDisappear(myCountryRef);
          }}
        >
          <i className="fas fa-pencil-alt"></i>
        </EditIcon>
      </MyCountryDiv>
      <EditDiv ref={editCountryRef}>
        <SearchDiv>
          <i className="fas fa-search"></i>
          <TextFieldDiv>
            <Inputdiv
              list="country-choice"
              id="search-country"
              name="search-country"
              placeholder="Choose your country"
              style={{
                border: "none",
                background: "none",
                color: "white",
                fontSize: "20px",
              }}
              ref={countryInputRef}
              onChange={(e) => {
                e.target.parentNode.parentNode.style.outline = "none";
              }}
            />
            <datalist id="country-choice">
              {Object.values(countryTrans)
                .filter((country) => country.country !== "AQ")
                .map((country) => (
                  <option key={country.country} value={country.name_en} />
                ))}
            </datalist>
          </TextFieldDiv>
        </SearchDiv>
        <Submit onClick={handleSubmitCountry}>
          <i className="fas fa-check-circle" />
        </Submit>
        <Cancel
          onClick={() => {
            handleDisappear(editCountryRef);
            handleShow(myCountryRef);
            countryInputRef.current.parentNode.parentNode.style.outline =
              "none";
            countryInputRef.current.value = "";
          }}
        >
          <i className="fas fa-times-circle" />
        </Cancel>
      </EditDiv>
    </CountryDiv>
  );
}
