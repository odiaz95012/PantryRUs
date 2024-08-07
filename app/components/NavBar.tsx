import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import "@/app/styles.css";
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type Props = {
    theme: string;
    handleThemeChange: () => void;
}

export default function ButtonAppBar(props: Props) {
    const router = useRouter();

    const navigateHero = () => {
        router.push('/');
    }
    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{bgcolor: (theme) => (props.theme === "light" ? "#DEE4E7" : "#222222"), }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={navigateHero}
                    >
                        <img src="/logo-color.png" alt="mui logo" style={{ height: '50px', width: '50px', borderRadius: 15 }} />

                    </IconButton>
                    <Typography variant="subtitle2" style={{ flexGrow: 1, fontSize: '1.55rem' }} className={props.theme === "light" ? "theme-light" : "theme-dark"}>
                        Pantry "R" Us
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="mode"
                        sx={{ mr: 2 }}
                        onClick={props.handleThemeChange}
                    >
                        {
                            props.theme === 'light' ? <ModeNightIcon color="primary"/> : <Brightness5Icon color="warning"/>
                        }
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        </>
    );
}