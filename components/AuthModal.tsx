import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
// import GoogleIcon from "@mui/icons-material/Google";
import GoogleIcon from '../app/images/search.png'
import Image from "next/image";

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Dialog maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogContent
        style={{
          padding: "2rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          style={{ fontWeight: 700, marginBottom: "1rem", color: "#333" }}
        >
          Welcome to MindMesh AI
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: "2rem", color: "#666" }}
        >
          Unlock unlimited AI-powered quizzes and create tailored, customized quiz
          experiences in seconds. Continue to get started!
        </Typography>
        <Button
          onClick={handleGoogleSignIn}
          variant="contained"
          // startIcon={<GoogleIcon />}
          startIcon= {
            <Image 
            src={GoogleIcon}
            alt="Google Icon"
            width={24}
            height={24}
            />
          }
          style={{
            width: "100%",
            backgroundColor: "black",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(66, 133, 244, 0.3)",
          }}
        >
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
