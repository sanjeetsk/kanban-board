import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../store/authSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material";

const AuthForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(signupUser(formData));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isLogin ? "Login" : "Sign Up"}</DialogTitle>
      <DialogContent>
        {!isLogin && (
          <TextField label="Name" name="name" fullWidth margin="dense" onChange={handleChange} />
        )}
        <TextField label="Email" name="email" type="email" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="dense" onChange={handleChange} />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </DialogActions>
      <Button onClick={() => setIsLogin(!isLogin)} color="primary">
        {isLogin ? "Create an account" : "Already have an account?"}
      </Button>
    </Dialog>
  );
};

export default AuthForm;
