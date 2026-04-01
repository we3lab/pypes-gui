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

const pages = [
  ["1", "Data Ingestion Interface", "/data-ingestor-interface.svg", "/data-ingestion-interface"],
]; // Simplified to only the current page

const settings = ["Profile", "Account", "Dashboard"];
const hrefs = [
  {
    name: "Data Ingestion Interface",
    href: "/data-ingestion-interface",
  },
];

const Navbar: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [activePage, setActivePage] = React.useState<string>("1"); // Default to Data Ingestion Interface

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
    setActivePage(key);
  };

  const handleLogOut = () => {
    handleCloseUserMenu();
    // No signOut since NextAuth is optional in simplified version
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
            {pages.map(([key, page, icon_link, page_url]) => (
              <div
                className={`flex pr-0 pl-0 w-fit ml-0 mr-8 items-center ${
                  key === activePage ? "bg-gradient-to-r from-[#2d477820]" : ""
                }`}
                key={key}
              >
                <Button
                  className="font-light text-flows-navbar-text m-0 p-0 pl-0"
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
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;