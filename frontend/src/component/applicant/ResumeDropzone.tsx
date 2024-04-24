import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Divider, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Check } from "@mui/icons-material";

// Define the props type
interface ResumeDropzoneProps {
  onDropAccepted: (acceptedFiles: File[]) => void;
  selectedFile: File | null;
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({
  onDropAccepted,
  selectedFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Handle the files
      onDropAccepted(acceptedFiles);
    },
    [onDropAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] }, // Adjust accepted file types as needed
    maxFiles: 1, // Adjust based on your need
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          borderColor: isDragActive ? "primary.main" : "",
          borderStyle: "dashed",
          backgroundColor: isDragActive ? "action.hover" : "",
          cursor: "pointer",
        }}
      >
        {selectedFile ? (
          <Check
            sx={{
              fontSize: 50,
              color: "green",
            }}
          />
        ) : (
          <CloudUploadIcon
            sx={{
              fontSize: 50,
              color: isDragActive ? "primary.main" : "action.active",
            }}
          />
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          {isDragActive
            ? "Drop the files here ..."
            : selectedFile
            ? "Click to change selected file"
            : "Drag & drop a resume here, or click to select one"}
        </Typography>
        {selectedFile && (
          <Typography>Selected File: {selectedFile?.name}</Typography>
        )}
      </Paper>
    </div>
  );
};

export default ResumeDropzone;
