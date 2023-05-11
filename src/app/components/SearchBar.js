import React from 'react';
import { Container, InputAdornment, TextField, IconButton, useMediaQuery, Paper, List, ListItem, ListItemText, Box, Grid} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "../styles/search.css";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import MemberDataDialog from "./MemberDataDialog";
/* eslint-disable */

function SearchBar({onUserSelect}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width: 400px)");
  const location = useLocation();
  const { currentUser } = getAuth();
  const inputRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const usersCollectionfamilyTree = collection(db, "family-members-dad-side");
    const usersCollectionfamilyTreeMom = collection(db, "family-members-mom-side");
    const fetchUsers = async () => {
      const unsubscribeDadSide = onSnapshot(usersCollectionfamilyTree, (snapshot) => {
        const usersListDadSide = snapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.addedBy === currentUser.uid);
  
        const unsubscribeMomSide = onSnapshot(usersCollectionfamilyTreeMom, (snapshot) => {
          const usersListMomSide = snapshot.docs
            .map((doc) => doc.data())
            .filter((user) => user.addedBy === currentUser.uid);
  
          const usersToFilter =
            location.pathname === "/familyTreeMom" ? usersListMomSide : usersListDadSide;
          setUsers(usersToFilter);
  
          if (searchTerm) {
            const results = usersToFilter.filter((user) =>
              (user.name + " " + user.surname).toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(results);
          }
        });
  
        return () => {
          unsubscribeMomSide();
        };
      });
  
      return () => {
        unsubscribeDadSide();
      };
    };
  
    const unsubscribe = fetchUsers();
  
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [location.pathname, currentUser?.uid, searchTerm]);  
  

  const handleClear = () => {
    setSearchTerm("");
    setMenuOpen(false);
  };

  const handleMenuItemClick = (user) => {
    setSearchTerm(`${user.name} ${user.surname}`);
    setFilteredUsers([]);
    setMenuOpen(false);
    setHighlightedUser(user);
    setOpenDialog(true);
    if (typeof onUserSelect === 'function') {
      onUserSelect(user);
    }
  };  
  
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 20 }}>
        <Box className="search-container">
          <Grid container direction="column" alignItems="center">
          <Grid item>
            <TextField
              ref={inputRef}
              data-testid="search-bar"
              id="search"
              htmlFor="searchInput"
              type="search"
              label="Search"
              autoComplete="off"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                if (event.target.value) {
                  setMenuOpen(true);
                } else {
                  setMenuOpen(false);
                }
              }}
              onBlur={() => []}
              onFocus={() => {
                if (searchTerm) {
                  setMenuOpen(true);
                }
              }}
              className={`search-field ${isSmallScreen ? "smaller-search" : ""}`}
              sx={{
                width: 190,
                '& label': { color: 'white  ' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiInputBase-input': { color: 'white', '::-webkit-search-cancel-button': { display: 'none' } },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
              InputProps={{
                startAdornment: searchTerm ? (
                  <InputAdornment position="start">
                    <IconButton
                      edge="end"
                      color="inherit"
                      size="small"
                      onClick={handleClear}
                      sx={{ color: "white" }}
                    >
                      <ClearIcon fontSize="8px" data-testid="clear-icon"/>
                    </IconButton>
                  </InputAdornment>
                ) : null,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="14px" sx={{ color: "white"  }}  data-testid="search-icon"/>
                  </InputAdornment>
                ),
              }}
            />
         </Grid>
            <Grid item>
              {menuOpen && filteredUsers.length > 0 && (
                <Paper elevation={3} ref={dropdownRef} className="search-results-panel" data-testid="search-results-panel">
                  <List>
                    {filteredUsers.map((user, index) => (
                     <ListItem
                        key={`user-${index}`}
                        onClick={() => handleMenuItemClick(user)}
                      >
                   
                        <ListItemText primary={`${user.name} ${user.surname}`} />
                    </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
      <MemberDataDialog open={openDialog} onClose={() => setOpenDialog(false)} user={highlightedUser} />
    </>
  );
}

export default SearchBar;