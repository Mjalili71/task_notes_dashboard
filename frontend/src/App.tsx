import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import TaskList from './components/TaskList';
import NoteList from './components/NoteList';
import AuthWrapper from './components/AuthWrapper';
import { AuthProvider } from './contexts/AuthContext';

// Create theme with RTL support
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Vazir',
      'Tahoma',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('dashboard');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (page: 'login' | 'register' | 'dashboard') => {
    setCurrentPage(page);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthWrapper currentPage={currentPage} onPageChange={handlePageChange}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  داشبورد کارها و یادداشت‌ها
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              <Paper elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                    centered
                  >
                    <Tab
                      icon={<TaskIcon />}
                      label="کارها"
                      id="tab-0"
                      aria-controls="tabpanel-0"
                    />
                    <Tab
                      icon={<NoteIcon />}
                      label="یادداشت‌ها"
                      id="tab-1"
                      aria-controls="tabpanel-1"
                    />
                  </Tabs>
                </Box>
                
                <TabPanel value={tabValue} index={0}>
                  <TaskList />
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  <NoteList />
                </TabPanel>
              </Paper>
            </Container>
          </Box>
        </AuthWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;