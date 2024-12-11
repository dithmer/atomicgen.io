import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import transformInputArguments from './transformInputArguments';


export default function UploadedAtomicSelection({ base, atomicNames, techniqueId, techniqueName, open, setOpen, fileContent, setInputs }) {

  const handleListItemClick = (test_number) => {
    setInputs({ ...base, ...transformInputArguments(fileContent.atomic_tests[test_number]) })
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{ `${techniqueId} - ${techniqueName}` }</DialogTitle>
      <List sx={{ pt: 0 }}>
        {atomicNames.map((i, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton onClick={() => handleListItemClick(index)}>
              
              <ListItemText primary={`${index + 1}. ${i}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
