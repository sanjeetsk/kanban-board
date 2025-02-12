import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../store/authSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from "@mui/material";

const AuthForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { token, loading, error, signupSuccess } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", userPhoto: "" });
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", userPhoto: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(signupUser(formData));
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Handle successful signup
  useEffect(() => {
    if (signupSuccess) {
      // After successful signup, switch to login mode with email pre-filled
      setIsLogin(true);
      setFormData(prev => ({
        name: "",
        email: prev.email, // Keep the email
        password: "",
        userPhoto: ""
      }));
    }
  }, [signupSuccess]);

  // Close form when user is authenticated
  useEffect(() => {
    if (token) {
      resetForm();
      handleClose();
    }
  }, [token, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isLogin ? "Login" : "Sign Up"}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {!isLogin && (
            <>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="dense"
                onChange={handleChange}
                value={formData.name}
                required
              />
              <TextField
                label="Photo URL (optional)"
                name="userPhoto"
                fullWidth
                margin="dense"
                onChange={handleChange}
                value={formData.userPhoto}
                placeholder="Enter image URL"
              />
            </>
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={formData.password}
            required
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', p: 2, gap: 1 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <Button
          onClick={handleToggleMode}
          color="primary"
          fullWidth
        >
          {isLogin ? "Create an account" : "Already have an account?"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthForm;
