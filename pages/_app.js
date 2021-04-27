import '../styles/globals.css'
import React from 'react'
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link'

const theme = createMuiTheme({
	palette: {
		primary: {
			main: deepPurple[100],
		},
		secondary: {
			main: indigo[400],
	  	},
	},
	typography: {
		fontFamily: [
			'Roboto',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		h1: {
			fontFamily: "Lato, sans-serif",
			fontWeight: "300",
			fontSize: "5rem"
		},
		h4: {
			fontFamily: "Lato, sans-serif",
			fontWeight: "600",
			fontSize: "1.2rem",
			marginTop: "2rem"
		}
	},
	spacing: 8,
});

function PloraApp({ Component, pageProps }) {
	
	return (
		<React.Fragment>
			<Head>
				<link rel="preconnect" href="https://fonts.gstatic.com"/>
				<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"/>
				<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
			</Head>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<div className={"root"}>
					<AppBar position="static" color="transparent" elevation={0}>
						<Toolbar>
							<Typography variant="h6" className={"appbar-title"}>
								<Link href={"/"}>
									plora.
								</Link>
							</Typography>
						</Toolbar>
					</AppBar>
				</div>
				<Component {...pageProps} />
			</ThemeProvider>
		</React.Fragment>
	)
}

export default PloraApp