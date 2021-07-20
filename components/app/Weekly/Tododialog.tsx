import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { ToDo } from "../../../lib/interface";


const FormDialog: React.FunctionComponent<{todo: ToDo, isOpen: any, doClose: any }> = ({
    todo,
    isOpen,
    doClose
  }) => {
    const [open, setOpen] = React.useState(false);
    const [commDlg, setCommDlg] = React.useState(false);
  
    useEffect(() => {
      setOpen(isOpen);
    }, [isOpen]);
  
    const handleDo = () => {
      setCommDlg(true);
    };
  
    const handleCancel = () => {
      setOpen(false);
      doClose();
    };
  
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleCancel}
        //   TransitionComponent={Transition}
          keepMounted
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{todo.name}</DialogTitle>
          <DialogContent>
            <DialogContentText />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              キャンセル
            </Button>
            <Button onClick={handleDo} color="primary">
              登録
            </Button>
          </DialogActions>
        </Dialog>
        {/* <CommonDialog
          msg={"登録しますか？"}
          isOpen={commDlg}
          doYes={execute}
          doNo={() => {
            setCommDlg(false);
          }}
        /> */}
      </div>
    );
  };
  export default FormDialog;