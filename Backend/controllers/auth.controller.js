import User from '../models/User.model.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.utils.js';

// Maps DB role ('college_admin') → display string ('College Admin') for frontend
const roleToAccountType = (role) => {
  const map = {
    student: 'Student',
    college_admin: 'College Admin',
    super_admin: 'Super Admin',
  };
  return map[role] || 'Student';
};

export const register = async (req, res) => {
  try {
    const { name, email, password, college, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college,
      role: role || 'student'
    });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    const accountType = roleToAccountType(user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
        accountType
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    const accountType = roleToAccountType(user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
        accountType,
        lastLogin: user.lastLogin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role,
      accountType: roleToAccountType(user.role),
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      user: userData,
      data: { user: userData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};