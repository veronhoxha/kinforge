import { Container, InputAdornment, TextField, IconButton, useMediaQuery, Paper, List, ListItem, ListItemText, Box, Grid} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "../styles/search.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width: 400px)");
  const usersCollectionfamilyTree = collection(db, "family-members-dad-side");
  const usersCollectionfamilyTreeMom = collection(db, "family-members-mom-side");
  const location = useLocation();
  const { currentUser } = getAuth();
  const inputRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightedUser, setHighlightedUser] = useState(null);

  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUsers = () => {
      const unsubscribeDadSide = onSnapshot(usersCollectionfamilyTree, (snapshot) => {
        const usersList = snapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.addedBy === currentUser.uid);
        setUsers(usersList);
      });
  
      const unsubscribeMomSide = onSnapshot(usersCollectionfamilyTreeMom, (snapshot) => {
        const usersList = snapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.addedBy === currentUser.uid);
        setUsers(usersList);
      });
  
      return () => {
        unsubscribeDadSide();
        unsubscribeMomSide();
      };
    };
  
    const unsubscribe = fetchUsers();
  
    return () => {
      unsubscribe();
    };
  }, [location.pathname, currentUser.uid]);

  useEffect(() => {
    if (searchTerm) {
      const results = users.filter((user) =>
        (user.name + " " + user.surname).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  const handleClear = () => {
    setSearchTerm("");
    setMenuOpen(false);
  };

  const handleMenuItemClick = (name, surname) => {
    console.log("handleMenuItemClick");
    setSearchTerm(`${name} ${surname}`);
    setFilteredUsers([]);
    const selectedUser = { name, surname };
    setMenuOpen(false);
    setHighlightedUser(selectedUser);
    console.log(selectedUser);
  };
  
  
  const [anchorEl, setAnchorEl] = useState();
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 20 }}>
        <Box className="search-container">
          <Grid container direction="column" alignItems="center">
          <Grid item>
            <TextField
              ref={inputRef}
              id="search"
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
                      <ClearIcon fontSize="8px" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="14px" sx={{ color: "white"  }} />
                  </InputAdornment>
                ),
              }}
            />
         </Grid>
            <Grid item>
              {menuOpen && filteredUsers.length > 0 && (
                <Paper elevation={3} ref={dropdownRef}>
                  <List>
                    {filteredUsers.map((user, index) => (
                     <ListItem
                        key={`user-${index}`}
                        onClick={() => handleMenuItemClick(user.name, user.surname)}
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
    </>
  );
}