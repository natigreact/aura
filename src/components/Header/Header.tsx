// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import PeopleIcon from '@mui/icons-material/People'
import './Header.scss'
import { NavLink, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { auth } from '../Firebase/firebase'
import { HeaderOption } from './HeaderOption'
import Stack from '@mui/material/Stack'
import ForumIcon from '@mui/icons-material/Forum'
import { fireBase } from '../Firebase/firebase'
import { Notifications } from '../Notifications/Notifications'
import { LeftMenu } from '../LeftMenu/LeftMenu'
import { Chat } from '../Chat/Chat'
import { makeStyles } from '@mui/styles'
import LogoutIcon from '@mui/icons-material/Logout'
import { useActions } from '../../hooks/useActions'
import { useOutside } from '../../hooks/useOutside'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '15%',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '112px',
    },
  },
}))

export const useStyles = makeStyles((theme: Theme) => ({
  menuPaper: {
    background: '#101010',
    color: '#ff6200',
    border: '1px solid grey',
    right: 'none !important',
    bottom: 'auto !important',
    pointerEvents: 'auto !important',
    width: '200px',
  },
}))

export interface HeaderPropsType {
  messages: any
  user: any
  setIsLoading: (value: boolean) => void
}

export const Header: React.FC<HeaderPropsType> = ({
                                                    messages,
                                                    user,
                                                    setIsLoading = { setIsLoading },
                                                  }) => {
  const dispatch = useDispatch()
  const { logout } = useActions()

  const {
    ref: leftMenuRef,
    isShow: isLeftMenuShow,
    setIsShow: setIsLeftMenuSetShow,
  } = useOutside(false)

  const {
    ref: chatMenuRef,
    isShow: isChatShow,
    setIsShow: setIsChatShow,
  } = useOutside(false)

  const {
    ref: notificationRef,
    isShow: isNotificationsShow,
    setIsShow: setIsNotificationsShow,
  } = useOutside(false)

  const [badgeCountMessages, setBadgeCountMessages] = useState(0)
  const [badgeCountNotifications, setBadgeCountNotifications] = useState(0)

  const classes = useStyles()

  useEffect(() => {
    setBadgeCountNotifications(1)
  }, [])

  /*useEffect(() => {
    setBadgeCountMessages(messages.length)
  }, [messages])*/

  const handleChatOpen = useCallback(() => {
    setIsChatShow(!isChatShow)
    setBadgeCountMessages(0)
  }, [isChatShow, badgeCountMessages])


  const handleNotificationsOpen = useCallback(() => {
    setIsNotificationsShow(!isNotificationsShow)
    setBadgeCountNotifications(0)
  }, [isNotificationsShow])

  const handleLeftMenuOpen = useCallback(() => {
    setIsLeftMenuSetShow(!isLeftMenuShow)
  }, [isLeftMenuShow])

  const logoutOfApp = useCallback(async () => {
    setIsLoading(false)
    await fireBase.firestore()
      .collection('users')
      .doc(fireBase.auth().currentUser.uid)
      .update({
        status: 'Offline',
      })
    dispatch(logout())
    await auth.signOut()
    history.push('/login')
    setIsLoading(true)
  }, [dispatch])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = useCallback((e) => {
    setAnchorEl(e.currentTarget)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }, [handleMobileMenuClose])

  const handleMobileMenuOpen = useCallback((e) => {
    setMobileMoreAnchorEl(e.currentTarget)
  }, [])

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        ml: 2,
        mb: 0.5,
      }}
      classes={{ paper: classes.menuPaper }}

    >
      <MenuItem to={'/homepage'}
                component={NavLink}
                className='menuItem'
                onClick={handleMenuClose}
      >
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      <MenuItem onClick={logoutOfApp}
                to={'/login'}
                component={NavLink}
                className='menuItem'
      >
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <LogoutIcon />
        </IconButton>
        <p>Log Out</p>
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      /*anchorEl={mobileMoreAnchorEl}*/
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      /*keepMounted*/
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      classes={{ paper: classes.menuPaper }}
    >
      <MenuItem to={'/messages'}
                component={NavLink}
                onClick={handleMobileMenuClose}
                className='menuItem'
      >
        <IconButton size='large'
                    aria-label='show 4 new mails'
                    color='inherit'
        >
          <Badge badgeContent={badgeCountMessages} color='error'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem to={'/homepage'}
                component={NavLink}
                onClick={handleMobileMenuClose}
                className='menuItem'
      >
        <IconButton
          size='large'
          aria-label='show 4 new mails'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={logoutOfApp}
                to={'/login'}
                component={NavLink}
                className='menuItem'
      >
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <LogoutIcon />
        </IconButton>
        <p> Log Out</p>
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' className='header_bar'>
        <Toolbar>
          <div ref={leftMenuRef}>
            <IconButton
              onClick={handleLeftMenuOpen}
              size='large'
              edge='start'
              color='inherit'
              aria-label='open drawer'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {isLeftMenuShow &&
            <LeftMenu />
            }
          </div>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ display: { xs: 'none', sm: 'block' } }}
          />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Stack spacing={1} direction='row'>
              <IconButton
                size='large'
                className='item'
                to={'/homepage'}
                component={NavLink}
                color='inherit'
              >
                <HomeIcon />
              </IconButton>

              <IconButton
                size='large'
                className='item'
                to={'/friendspage'}
                component={NavLink}
                color='inherit'
              >
                <PeopleIcon />
              </IconButton>

              <IconButton
                size='large'
                className='item'
                to={'/messages'}
                component={NavLink}
                color='inherit'
              >
                <ForumIcon />
              </IconButton>
            </Stack>

            <div ref={chatMenuRef}>
              <IconButton
                onClick={handleChatOpen}
                size='large'
                aria-label='show 1 new mails'
                color='inherit'
              >
                <Badge badgeContent={badgeCountMessages} color='error'>
                  <MailIcon />
                </Badge>
              </IconButton>
              {isChatShow &&
              <Chat messages={messages}
                    user={user}
              />
              }
            </div>


            <div ref={notificationRef}>
              <IconButton
                onClick={handleNotificationsOpen}
                size='large'
                aria-label='show 1 new notifications'
                color='inherit'
              >
                <Badge badgeContent={badgeCountNotifications} color='error'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {isNotificationsShow &&
              <Notifications />
              }
            </div>

            <HeaderOption avatar={true} onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </HeaderOption>


          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}