import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Checkbox,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { Task, TaskCreate, TaskUpdate } from '../types';
import { tasksAPI } from '../services/api';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: '',
    priority: 'medium',
    completed: false,
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await tasksAPI.createTask(formData);
      setOpen(false);
      setFormData({ title: '', description: '', priority: 'medium', completed: false });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    try {
      const updateData: TaskUpdate = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        completed: formData.completed,
      };
      await tasksAPI.updateTask(editingTask.id, updateData);
      setOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium', completed: false });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await tasksAPI.deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksAPI.updateTask(task.id, { completed: !task.completed });
      loadTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      completed: task.completed,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium', completed: false });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          لیست کارها
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
      >
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                />
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
              
              {task.description && (
                <Typography variant="body2" color="textSecondary" mb={1}>
                  {task.description}
                </Typography>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority) as any}
                  size="small"
                />
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTask(task)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="caption" color="textSecondary">
                {formatDate(task.created_at)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add/Edit Task Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'ویرایش کار' : 'افزودن کار جدید'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان کار"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="توضیحات"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>اولویت</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <MenuItem value="low">کم</MenuItem>
              <MenuItem value="medium">متوسط</MenuItem>
              <MenuItem value="high">زیاد</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>انصراف</Button>
          <Button
            onClick={editingTask ? handleUpdateTask : handleCreateTask}
            variant="contained"
            disabled={!formData.title.trim()}
          >
            {editingTask ? 'ویرایش' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
