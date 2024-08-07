"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Card from "../components/Card";
import { Inventory } from "../types";
import { db } from "../../firebase";
import { getDocs, collection, query, onSnapshot } from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddItemModal from '../components/AddItemModal';
import { useSpring, animated } from "@react-spring/web";
import "../styles.css";
import Search from "../components/Search";


export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [filteredItems, setFilteredItems] = useState<Inventory[]>([]);

    const handleSearchChange = (items: Inventory[]) => {
        setFilteredItems(items); // Update the state with filtered items
    };
    const [light, setLight] = useState(false);

    const themeLight = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: "#FFFFFF",
                paper: "#f0f7f0"
            },
            text: {
                primary: "#000000"
            },
            
        }
    });

    const themeDark = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: "#222222",
                paper: "#333333"
            },
            text: {
                primary: "#ffffff"
            }
        }
    });
    const updateInventory = async () => {
        setIsLoading(true); // Set loading state to true before fetching data
        const inventoryRef = query(collection(db, 'inventory'));
        const doc = await getDocs(inventoryRef);
        const inventoryData: Inventory[] = [];
        doc.forEach((doc) => {
            inventoryData.push(
                {
                    name: doc.id,
                    quantity: doc.data().quantity,
                    image: doc.data().image
                }
            );

        });
        setInventory(inventoryData);
        setFilteredItems(inventoryData);
        setIsLoading(false); // Set loading state to false after data is fetched
    };

    useEffect(() => {
        updateInventory();
        const unsubscribe = onSnapshot(collection(db, 'inventory'), () => {
            updateInventory();
        });
        return unsubscribe;
    }, []);


    const handleThemeChange = () => {
        setLight(!light);
    }

    const springs = useSpring({
        from: { y: -100 },
        to: { y: 0 },
    });
    return (
        <ThemeProvider theme={light ? themeLight : themeDark}>
            <NavBar theme={light ? "light" : "dark"} handleThemeChange={handleThemeChange} />
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    padding: '20px',
                    color: 'text.primary',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '15%',
                    
                }}
                id="inventory"
            >
                <Typography variant="h1" className={light ? "theme-light " : "theme-dark"} align='center'>
                    Welcome to Pantry "R" Us
                </Typography>
                <Typography variant="subtitle2" sx={{ fontSize: '1.25rem' }} className={light ? "theme-light " : "theme-dark"} align='center' padding={3}>
                    Managing your inventory has never been easier.
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontSize: '1rem',
                        display: 'flex',  // Use flexbox to align items within Typography
                        justifyContent: 'center',  // Center horizontally
                        alignItems: 'center',  // Center vertically
                    }}
                    className={light ? "theme-light" : "theme-dark"}
                    padding={3}
                >
                    Click the
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1, mr: 1 }}>
                        <AddCircleIcon sx={{ fontSize: 35 }} />
                    </Box>
                    button below to add a new item to your inventory.
                </Typography>
                <Box
                    width="95%"
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Aligns content to the end    
                        position: 'relative',
                        alignItems: 'center',
                    }}
                >
                    <AddItemModal />
                </Box>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: '100%', margin: '0 auto' }}
                >
                    <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }}>
                        <Box
                            border={3}
                            borderColor="text.primary"
                            padding={2}
                            textAlign="center"
                            borderRadius={5}
                            sx={{
                                width: '100%',

                            }}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Box justifyContent={'center'}
                                alignItems={'center'}
                                textAlign="center"
                                display={"flex"}
                                flexDirection={"column"}
                            >
                                <h4 className={light ? "theme-light" : "theme-dark"} style={{ textAlign: 'center', fontSize: '3.0rem', padding: 2 }}>
                                    Pantry Stock
                                </h4>
                                <Search inventory={inventory} onSearchChange={handleSearchChange}/>
                            </Box>

                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <Grid container spacing={1}>
                                    {filteredItems.map((item: Inventory, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                            <Box sx={{ padding: 5 }}>
                                                <animated.div style={{ ...springs }}>
                                                    <Card inventory={item} />
                                                </animated.div>
                                            </Box>

                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Grid>


                </Grid>
            </Box>
        </ThemeProvider>
    );
}