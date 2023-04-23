import { Container, InputAdornment, TextField, IconButton, useMediaQuery } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "../../styles/search.css"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery('(max-width: 400px)');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 20 }}>
      <TextField
        id="search"
        type="search"
        label="Search"
        value={searchTerm}
        onChange={handleChange}
        className={isSmallScreen ? "smaller-search" : ""}
        sx={{
          width: 190,
          height: 210,
          '& label': { color: 'white' },
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
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "white" }} />
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}
