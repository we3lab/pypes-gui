import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import BlueIndicator from "../simulation-results/blue-indicator";
import useMainStore from "@/store/store";

const pages = [
  ["0", "Home", "/home.svg", "/"],
  ["1", "Data Ingestion Interface", "/data-ingestor-interface.svg", "/data-ingestion-interface"],
  ["2", "Data Cleaning Interface", "/data-cleaning-interface.svg", "/data-cleaning-interface"],
  ["3", "Analytics", "/icon-analitycs.svg", "/analytics-portal"],
  ["4", "Simulate Scenario", "/simulate-scenario.svg", "/simulate-scenario"],
  ["5", "Simulation Results", "/simulation-control.svg", "/simulation-results-portal"],
  ["6", "MPC Dashboard", "/icon-analitycs.svg", "/mpc-dashboard"],
];
const settings = ["Profile", "Account", "Dashboard"];
const hrefs = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Data Ingestion Interface",
    href: "/data-ingestion-interface",
  },
  {
    name: "Data Cleaning Interface",
    href: "/data-cleaning-interface",
  },
  {
    name: "Analytics",
    href: "/analytics-portal",
  },
  {
    name: "Simulate Scenario",
    href: "/simulate-scenario",
  },
  {
    name: "Simulation Results",
    href: "/simulation-results-portal",
  },
  {
    name: "MPC Dashboard",
    href: "/mpc-dashboard",
  },
];

  

const Navbar: React.FC = () => {

  const {
    setActivePage,
    activePage,
    setNetworkIdDataIngestionPage,
  } = useMainStore();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const session = useSession();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (page: string, key: string) => {
    const href = hrefs.find((href) => href.name === page)?.href;
    if (href) {
      window.location.href = href;
    }
    setActivePage(key)
  };

  const handleLogOut = () => {
    if (session.status === "authenticated") {
      setNetworkIdDataIngestionPage("") ;
      signOut();
    } else {
      handleCloseUserMenu;
    }
  };

  return (
    <AppBar position="static">
      <Container className="max-w-flows-screen items-center">
        <Toolbar>
          <Image
            className="mr-10 w-36"
            key="main_logo"
            src="/Flows_brandmark-1.svg"
            alt="rock"
            width={100}
            height={100}
          />
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className="h-10"
          >
            {pages.map(
              ([key, page, icon_link, page_url]) =>
                (key == activePage && ( 
                  <div
                    className="flex pr-0 pl-0 w-fit ml-0 mr-8 items-center bg-gradient-to-r from-[#2d477820]"
                    key={key}
                  >
                    <BlueIndicator height="h-10 mr-1" />
                    <Button
                      className="font-light text-flows-navbar-text m-0 p-0 pl-0"
                      key={key}
                      onClick={() => handleNavigation(page, key)}
                      sx={{
                        my: 2,
                        color: "#000000",
                        display: "block",
                        fontWeight: 100,
                        fontFamily: "roboto",
                        fontSize: "1.2vh",
                        textTransform: "none",
                      }}
                    >
                      <div className="flex items-center">
                      <img className="mr-1" src={icon_link} />
                      {page}
                      
                      </div>
                    </Button>
                  </div>
                )) ||
                (key != activePage && (
                  <div
                    className="flex pr-0 pl-0 w-fit ml-0 mr-8 items-center"
                    key={key}
                  >
                    {/* <img className="mr-1" src={icon_link} /> */}
                    <Button
                      className="font-light text-flows-navbar-text m-0 p-0 pl-0"
                      key={key}
                      onClick={() => handleNavigation(page, key)}
                      sx={{
                        my: 2,
                        color: "#000000",
                        display: "block",
                        fontWeight: 100,
                        fontFamily: "roboto",
                        fontSize: "1.2vh",
                        textTransform: "none",
                      }}
                    >
                      <div className="flex items-center">
                      <img className="mr-1" src={icon_link} />
                      {page}
                      </div>
                    </Button>
                  </div>
                ))
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <div>{session.data?.user?.name}</div>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp">
                  <FaUser />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              <MenuItem key={"Logout"} onClick={handleLogOut}>
                <Typography textAlign="center">{"Logout"}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
