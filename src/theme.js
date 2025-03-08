import { createTheme } from '@mui/material'

const getTheme = (mode) => {
    // Define colors for both modes
    const colors = {
        dark: {
            background: '#121212',
            paper: '#1e1e1e',
            text: '#ffffff',
            textSecondary: 'rgba(255,255,255,0.7)'
        },
        light: {
            background: '#f5f7fb',
            paper: '#ffffff',
            text: '#2d3748',
            textSecondary: '#718096'
        }
    }

    return createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'dark' ? '#7986cb' : '#3f51b5',
                light: mode === 'dark' ? '#9fa8da' : '#757de8',
                dark: mode === 'dark' ? '#5c6bc0' : '#002984',
                contrastText: '#ffffff'
            },
            secondary: {
                main: '#f50057',
                light: '#ff4081',
                dark: '#c51162',
                contrastText: '#ffffff'
            },
            background: {
                default: colors[mode].background,
                paper: colors[mode].paper
            },
            text: {
                primary: colors[mode].text,
                secondary: colors[mode].textSecondary
            }
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 600,
                letterSpacing: '-0.02em'
            },
            button: {
                textTransform: 'none',
                fontWeight: 500
            }
        },
        shape: {
            borderRadius: 12
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        ...(mode === 'dark' && {
                            backgroundColor: colors.dark.paper,
                            '& *': { color: colors.dark.text }
                        })
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 16px',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none'
                        }
                    },
                    contained: {
                        '&:hover': {
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    },
                    outlined: {
                        ...(mode === 'dark' && {
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: colors.dark.text,
                            '&:hover': {
                                borderColor: 'rgba(255,255,255,0.5)'
                            }
                        })
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f1f5f9'
                            },
                            '&.Mui-focused': {
                                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#ffffff'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: mode === 'dark' ? colors.dark.textSecondary : 'inherit'
                        },
                        '& .MuiOutlinedInput-input': {
                            color: mode === 'dark' ? colors.dark.text : 'inherit'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)'
                        }
                    }
                }
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        ...(mode === 'dark' && {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: colors.dark.text,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255,255,255,0.2)'
                            }
                        })
                    }
                }
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        color: mode === 'dark' ? colors.light.text : colors.dark.text,
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'
                        },
                        '&.Mui-selected': {
                            backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.08)',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.12)'
                            }
                        }
                    }
                }
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: {
                        color: 'inherit'
                    },
                    secondary: {
                        color: mode === 'dark' ? colors.dark.textSecondary : colors.light.textSecondary
                    }
                }
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: mode === 'dark' ? colors.dark.textSecondary : colors.light.textSecondary
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        ...(mode === 'dark' && {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            color: colors.dark.text
                        })
                    }
                }
            }
        }
    })
}

export default getTheme 