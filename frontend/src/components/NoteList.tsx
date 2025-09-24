import React, { useState, useEffect } from 'react';
import {
  IconButton,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import { Note, NoteCreate, NoteUpdate } from '../types';
import { notesAPI } from '../services/api';

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<NoteCreate>({
    title: '',
    content: '',
  });

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesAPI.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      await notesAPI.createNote(formData);
      setOpen(false);
      setFormData({ title: '', content: '' });
      loadNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    
    try {
      const updateData: NoteUpdate = {
        title: formData.title,
        content: formData.content,
      };
      await notesAPI.updateNote(editingNote.id, updateData);
      setOpen(false);
      setEditingNote(null);
      setFormData({ title: '', content: '' });
      loadNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await notesAPI.deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      content: note.content,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
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
          یادداشت‌ها
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
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <NoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  component="h2"
                  style={{ flex: 1 }}
                >
                  {note.title || 'بدون عنوان'}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                color="textSecondary"
                mb={2}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {note.content}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="textSecondary">
                  {formatDate(note.created_at)}
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditNote(note)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add/Edit Note Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNote ? 'ویرایش یادداشت' : 'افزودن یادداشت جدید'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان یادداشت"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="محتوای یادداشت"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>انصراف</Button>
          <Button
            onClick={editingNote ? handleUpdateNote : handleCreateNote}
            variant="contained"
            disabled={!formData.content.trim()}
          >
            {editingNote ? 'ویرایش' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteList;
