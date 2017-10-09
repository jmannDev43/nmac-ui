import React from 'react';
import Dialog, { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import DetailTable from './DetailTable';

const DetailModal = (props) => {
  if (!props.modalEventData) {
    return null;
  }
  return (
    <div id="detailModalWrapper">
      <Dialog
        open={props.open}
        fullScreen
        onRequestClose={props.handleClose}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DetailTable modalEventData={props.modalEventData}/>
        </DialogContent>
        <DialogActions>
          <Button
            label="Close"
            color="primary"
            onClick={props.handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailModal;
