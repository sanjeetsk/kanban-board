import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addSection, fetchSections } from "../store/kanbanSlice";
import { logoutUser, fetchUserCount, fetchCurrentUser } from "../store/authSlice";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  InputAdornment,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import Section from "./Section";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AppleIcon from '@mui/icons-material/Apple';
import MenuIcon from '@mui/icons-material/Menu';
import AuthForm from "./AuthForm";
import LoadingScreen from "./LoadingScreen";

const Board = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { sections, loading } = useSelector((state) => state.kanban);
  const auth = useSelector((state) => state.auth) || {};
  const user = auth?.user;
  const token = auth?.token;
  const userPhoto = auth?.user?.userPhoto;
  const userCount = useSelector((state) => state.auth.userCount);

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  // Ensure re-render when token changes
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    dispatch(fetchUserCount()); // Fetch user count on mount
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      dispatch(addSection({ name: newSectionTitle }));
      setNewSectionTitle("");
      setIsSectionFormOpen(false);
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleUserMenuClose();
  };

  const renderAuthButton = () => {
    if (!token) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAuthFormOpen(true)}
          size={isMobile ? "small" : "medium"}
        >
          Sign Up / Login
        </Button>
      );
    }

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={handleUserMenuOpen}>
          <Avatar
            src={userPhoto}
            alt={user?.name}
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              cursor: 'pointer'
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem>
            <Typography variant="body2">{user?.name}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <div height="100vh">
      {/* Top Navbar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black", boxShadow: "none", }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* Left: Logo & Title */}
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            )}
            <AppleIcon fontSize={isMobile ? "medium" : "large"} />
            {!isMobile && (
              <Box>
                <Typography variant={isMobile ? "body2" : "body1"}>Kanban Board</Typography>
                <Typography variant="caption" color="textSecondary">
                  {sections.length} boards • {userCount} members
                </Typography>
              </Box>
            )}
          </Box>

          {/* Search Bar & Auth Buttons */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              order: isMobile ? 2 : 0,
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0
            }}
          >
            {!isMobile && (
              <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  width: isTablet ? 150 : 250,
                  bgcolor: "#F4F5F7",
                  borderRadius: 1
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {renderAuthButton()}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Kanban Board</Typography>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary">
            {sections.length} boards • {userCount} members
          </Typography>
        </Box>
      </Drawer>

      {/* Board Content */}
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px - 20px)", // Full height
          overflowX: "auto",
          overflowY: "auto",
          padding: 1,
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#D1D5DB transparent", // Custom color
          "&::-webkit-scrollbar": {
            height: "5px", // Thin scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#D1D5DB", // Grey color
            borderRadius: "10px",
          },
        }}
      >
        {sections.map((section) => (
          <Box key={section._id}
            sx={{
              minWidth: isMobile ? "85vw" : 300,
              maxWidth: isMobile ? "85vw" : 300,
              mr: 2
            }}
          >
            <Section key={`${section._id}-${section.tasks.length}`} section={section} />
          </Box>
        ))}

        {/* Add Section Button (At End, Aligned with Section Title) */}
        <Box sx={{ display: "flex", alignItems: "center", height: "40px", mt: "10px", ml: "10px" }}>
          <Button variant="text" onClick={() => setIsSectionFormOpen(true)} sx={{ height: "40px", width: "200px", color: "#a2a5ab" }}>
            <AddIcon /> Add Section
          </Button>
        </Box>
      </Box>

      {/* Add Section Popup */}
      <Dialog open={isSectionFormOpen} onClose={() => setIsSectionFormOpen(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField label="Section Title" fullWidth value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSectionFormOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddSection}>
            Add Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auth Form Popup */}
      <AuthForm open={isAuthFormOpen} handleClose={() => setIsAuthFormOpen(false)} />
    </div>
  );
}

export default Board;