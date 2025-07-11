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
import { useEffect, useState, useRef } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [headingTag, setHeadingTag] = useState<"h1" | "h2" | "h3">("h2");
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showLinkDialog && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkDialog]);

  const insertHeading = (tag: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(tag);
        heading.append(...selection.getNodes());
        selection.insertNodes([heading]);
      }
    });
  };

  const insertLink = () => {
    const trimmed = linkUrl.trim();
    if (trimmed) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, trimmed);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null); // remove link
    }
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
          flexWrap: "wrap",
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
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Heading">
          <Select
            value={headingTag}
            onChange={(e) => {
              const tag = e.target.value as "h1" | "h2" | "h3";
              setHeadingTag(tag);
              insertHeading(tag);
            }}
            size="small"
            sx={{ minWidth: 80 }}
          >
            <MenuItem value="h1">H1</MenuItem>
            <MenuItem value="h2">H2</MenuItem>
            <MenuItem value="h3">H3</MenuItem>
          </Select>
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

        <Tooltip title="Remove Link">
          <IconButton
            size="small"
            onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
          >
            <LinkOffIcon fontSize="small" />
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
            inputRef={linkInputRef}
            margin="dense"
            label="URL"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && linkUrl.trim()) {
                insertLink();
              }
            }}
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
