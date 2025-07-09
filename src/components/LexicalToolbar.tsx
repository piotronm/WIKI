import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { $createHeadingNode } from "@lexical/rich-text";
import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Toolbar state logic (optional)
        }
      });
    });
  }, [editor]);

  const insertHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode("h2");
        heading.append(...selection.getNodes());
        selection.insertNodes([heading]);
      }
    });
  };

  const insertLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Heading (H2)">
          <IconButton size="small" onClick={insertHeading}>
            <TitleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={() =>
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            }
          >
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={() =>
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
          >
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Link">
          <IconButton size="small" onClick={() => setShowLinkDialog(true)}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Tooltip title="Undo">
          <IconButton
            size="small"
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          >
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton
            size="small"
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          >
            <RedoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
          <Button onClick={insertLink} disabled={!linkUrl.trim()}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
