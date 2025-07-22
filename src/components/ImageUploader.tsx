import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type UploadedImage = {
  file: File;
  previewUrl: string;
};

type ImageUploaderProps = {
  label?: string;
  maxImages?: number;
  maxFileSizeMB?: number;
  onUploadComplete: (imageUrls: string[]) => void;
  existingImageUrls?: string[];
};

const ImageUploader = ({
  label = "Upload Images",
  maxImages = 2,
  maxFileSizeMB = 3,
  onUploadComplete,
  existingImageUrls = [],
}: ImageUploaderProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize with existing images
  useEffect(() => {
    const initial = existingImageUrls.map((url) => ({
      file: null as unknown as File,
      previewUrl: url,
    }));
    setImages(initial);
  }, [existingImageUrls]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      if (images.length + acceptedFiles.length > maxImages) {
        setError(`You can upload up to ${maxImages} images.`);
        return;
      }

      const newImages: UploadedImage[] = [];

      setLoading(true);
      try {
        for (const file of acceptedFiles) {
          if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            continue;
          }
          if (file.size > maxFileSizeMB * 1024 * 1024) {
            setError(`Each file must be under ${maxFileSizeMB}MB.`);
            continue;
          }

          const previewUrl = URL.createObjectURL(file);
          newImages.push({ file, previewUrl });
        }

        const combined = [...images, ...newImages];
        setImages(combined);
        onUploadComplete(combined.map((img) => img.previewUrl));
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [images, maxImages, maxFileSizeMB, onUploadComplete]
  );

  const handleRemove = (index: number) => {
    const toRevoke = images[index].previewUrl;
    if (toRevoke.startsWith("blob:")) URL.revokeObjectURL(toRevoke);

    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onUploadComplete(updated.map((img) => img.previewUrl));
  };

  const handleRemoveAll = () => {
    images.forEach((img) => {
      if (img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
    onUploadComplete([]);
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: maxImages > 1,
  });

  const canUploadMore = images.length < maxImages;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle2">
          {label} ({images.length}/{maxImages})
        </Typography>
        {images.length > 0 && (
          <Typography
            variant="caption"
            color="error"
            onClick={handleRemoveAll}
            sx={{ cursor: "pointer", textDecoration: "underline" }}>
            Remove All
          </Typography>
        )}
      </Box>

      {canUploadMore && (
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragActive ? "action.hover" : "background.paper",
            mb: 2,
          }}>
          <input {...getInputProps()} />
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Processing..."
              : `Click or drag ${
                  maxImages > 1 ? "images" : "an image"
                } to upload`}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {!loading && images.length > 0 && (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {images.map((img, i) => (
            <Box key={`${img.previewUrl}-${i}`} position="relative">
              <Box
                component="img"
                src={img.previewUrl}
                alt={`Image ${i + 1}`}
                sx={{
                  height: 120,
                  width: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(i)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "error.main",
                  color: "white",
                  boxShadow: 1,
                }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ImageUploader;
