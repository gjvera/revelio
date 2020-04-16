import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import RedoIcon from '@material-ui/icons/Redo'
import Dialog from '@material-ui/core/Dialog'
import Box from '@material-ui/core/Box'
import ResultExport from './result-export'
import IconButton from '@material-ui/core/IconButton'

export const ExportAction = props => {
  const [open, setOpen] = React.useState(false)
  return (
    <Box
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <ExportModal {...props} closeDialog={() => setOpen(false)} />
      </Dialog>
      <IconButton onClick={() => setOpen(true)} size="small">
        <RedoIcon />
      </IconButton>
    </Box>
  )
}

const ExportModal = props => {
  const { closeDialog } = props
  return (
    <React.Fragment>
      <DialogTitle style={{ textAlign: 'center' }}>Export Results</DialogTitle>
      <DialogContent>
        <ResultExport {...props} handleClose={() => closeDialog()} />
      </DialogContent>
    </React.Fragment>
  )
}
