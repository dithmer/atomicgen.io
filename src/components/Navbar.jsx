import React, { useState } from 'react';
import { ReactComponent as LogoIcon } from '../assets/images/logo.svg';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Link
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { GitHub as GitHubIcon, LightMode as LightModeIcon, DarkModeOutlined as DarkModeOutlinedIcon } from '@mui/icons-material';

function Navbar( { darkMode, setDarkMode } ) {
  // State for handling the menu anchor element (useful links dropdown)
  const [anchorEl, setAnchorEl] = useState(null);


  // List of useful links to display in the dropdown menu
  const usefulLinks = [
    { text: 'Atomic Specs', url: 'https://github.com/redcanaryco/atomic-red-team/wiki/Sample-Spec' },
    { text: 'Contributing Guide', url: 'https://github.com/redcanaryco/atomic-red-team/wiki/Contributing' },
    { text: 'Atomic Red Team', url: 'https://atomicredteam.io' },
    { text: 'Invoke-AtomicRedTeam', url: 'https://www.atomicredteam.io/invoke-atomicredteam' },
    { text: 'Slack Workspace', url: 'https://slack.atomicredteam.io/' },
  ];

  // Function to handle opening the dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to toggle the theme mode
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar position="static">
      {/* Toolbar container for Navbar items */}
      <Toolbar sx={{ display: 'flex', my: "5px" }}>
        {/* Logo and Website Name */}
        <Link underline="none" href='https://atomicgen.io' color='white'>
          <Box
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              paddingTop: "6px",
              paddingBottom: "6px"
            }}
          >
            {/* Logo Icon */}
            <LogoIcon style={{ fill: "#fff", width: '45px', height: '45px', marginRight: "20px" }} />
            <Box>
              {/* Website Title */}
              <Typography className="headerTitle" variant="h5" component="div">
                atomicgen.io
              </Typography>
              {/* Subtitle */}
              <Typography className="headerTitle" variant="subtitle2" component="div">
                atomic test generator
              </Typography>
            </Box>
          </Box>
        </Link>

        {/* Right-hand Section of Navbar */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Useful Links Dropdown Menu */}
          <Button
            color="inherit"
            aria-controls="useful-links-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            style={{ textTransform: 'none' }}
          >
            <Typography fontSize={16} component="div">
              Related Links
            </Typography>
          </Button>
          <Menu
            id="useful-links-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {usefulLinks.map((link, index) => (
              <MenuItem
                key={index}
                component="a"
                href={link.url}
                target="_blank"
                onClick={handleMenuClose}
              >
                {link.text}
                <LaunchIcon fontSize="small" style={{ marginLeft: '5px' }} />
              </MenuItem>
            ))}
          </Menu>

          {/* GitHub Icon Link */}
          <IconButton
            component="a"
            href="https://github.com/krdmnbrk/atomicgen.io"
            target="_blank"
            color="inherit"
          >
            <GitHubIcon fontSize='medium' />
          </IconButton>

          {/* Theme Toggle Button */}
          <IconButton
            onClick={handleThemeToggle}
            color="inherit"
          >
            {darkMode ? <DarkModeOutlinedIcon fontSize="medium" /> : <LightModeIcon fontSize="medium" />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Decorative Bottom Line */}
      <Box
        sx={{
          height: '1px',
          background: '#d32f2f', // Red to blue gradient effect
        }}
      />
    </AppBar>
  );
}

export default Navbar;
