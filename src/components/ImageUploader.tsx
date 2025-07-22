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
import axios from "../api/axiosInstance"; // your axios base config

type UploadedImage = {
  file?: File;
  previewUrl: string;
  imageUrl: string; // From server
  isExisting?: boolean; // Flag to identify pre-existing images
};

type ImageUploaderProps = {
  label?: string;
  maxImages?: number;
  maxFileSizeMB?: number;
  onUploadComplete: (imageUrls: string[]) => void;
  existingImageUrls?: string[]; // For editing existing articles
};

const ImageUploader = ({
  label = "Upload Images",
  maxImages = 2,
  maxFileSizeMB = 3,
  onUploadComplete,
  existingImageUrls = [],
}: ImageUploaderProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with existing images when component mounts or existingImageUrls changes
  useEffect(() => {
    if (existingImageUrls.length > 0) {
      const existingImages: UploadedImage[] = existingImageUrls.map(url => ({
        previewUrl: url,
        imageUrl: url,
        isExisting: true
      }));
      setImages(existingImages);
    } else {
      setImages([]);
    }
  }, [existingImageUrls]);

  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/UploadImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.imageUrl;
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      if (images.length + acceptedFiles.length > maxImages) {
        setError(`You can upload up to ${maxImages} images.`);
        return;
      }

      const newUploaded: UploadedImage[] = [];

      setLoading(true);
      try {
        for (const file of acceptedFiles) {
          if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            continue;
          }
          if (file.size > maxFileSizeMB * 1024 * 1024) {
            setError(`File size must be under ${maxFileSizeMB}MB.`);
            continue;
          }

          const serverUrl = await uploadToServer(file);
          newUploaded.push({
            file,
            previewUrl: URL.createObjectURL(file),
            imageUrl: serverUrl,
            isExisting: false
          });
        }

        const updatedImages = [...images, ...newUploaded];
        setImages(updatedImages);
        onUploadComplete(updatedImages.map((img) => img.imageUrl));
      } catch (err) {
        console.error("Upload error:", err);
        setError("Upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [images, maxImages, maxFileSizeMB, onUploadComplete]
  );

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's a newly uploaded image (has blob URL), revoke it
    if (imageToRemove.file && imageToRemove.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    // Optional: Call API to delete image from server
    // You might want to implement this based on your backend
    try {
      if (!imageToRemove.isExisting && imageToRemove.imageUrl) {
        // Only delete newly uploaded images, not existing ones
        // await axios.delete('/DeleteImage', { data: { imageUrl: imageToRemove.imageUrl } });
      }
    } catch (err) {
      console.warn("Failed to delete image from server:", err);
    }

    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onUploadComplete(updated.map((img) => img.imageUrl));
  };

  const handleRemoveAll = () => {
    // Revoke all blob URLs for newly uploaded images
    images.forEach((img) => {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    setImages([]);
    onUploadComplete([]);
  };

  useEffect(() => {
    // Cleanup blob URLs on unmount
    return () => {
      images.forEach((img) => {
        if (img.file && img.previewUrl.startsWith("blob:")) {
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2">
          {label} ({images.length}/{maxImages})
        </Typography>
        {images.length > 0 && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleRemoveAll}
          >
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
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Uploading..."
              : `Click or drag ${canUploadMore ? `up to ${maxImages - images.length} more ` : ""}image${maxImages > 1 ? "s" : ""} (max ${maxFileSizeMB}MB each)`}
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
          {images.map((img, index) => (
            <Box key={`${img.imageUrl}-${index}`} position="relative">
              <Box
                component="img"
                src={img.previewUrl}
                alt={`Upload ${index + 1}`}
                sx={{
                  height: 120,
                  width: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
              
              {/* Existing image indicator */}
              {img.isExisting && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                    backgroundColor: "info.main",
                    color: "white",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  Existing
                </Box>
              )}

              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "error.main",
                  color: "white",
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor: "error.dark",
                  },
                }}
              >
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