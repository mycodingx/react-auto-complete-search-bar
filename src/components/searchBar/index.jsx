import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoSearch, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "../../hooks/debounceHook";
import axios from "axios";

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
  overflow: hidden;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #181238;
  border-radius: 6px;
  font-weight: 400;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  margin-top: 6px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`;

const LineSeparator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const containerVariants = {
  expanded: {
    height: "20em",
  },

  collapsed: {
    height: "3.8em",
  },
};

const containerTransition = { type: "spring", damping: 22, stiffness: 150 };

export function SearchBar(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);

  const changeHandler = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside]);

  const prepareSearchQuery = (query) => {
    const url = `http://api.tvmaze.com/search/shows?q=${query}`;
    return encodeURI(url);
  };

  const searchTvShow = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;
    setLoading(true);
    const URL = prepareSearchQuery(searchQuery);
    const response = await axios.get(URL).catch((err) => {
      console.log("error");
    });

    if (response) {
      console.log("Response: ", response.data);
    }
  };

  useDebounce(searchQuery, 500, searchTvShow);

  return (
    <SearchBarContainer
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={containerTransition}
      ref={parentRef}
    >
      <SearchInputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput
          placeholder="Search for your favorite series.."
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={collapseContainer}
            >
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </SearchInputContainer>
      <LineSeparator />
      <SearchContent>
        {isLoading && (
          <LoadingWrapper>
            <MoonLoader loading color="#000" size={20} />
          </LoadingWrapper>
        )}
      </SearchContent>
    </SearchBarContainer>
  );
}
