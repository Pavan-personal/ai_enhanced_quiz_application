import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

export function SignOutDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
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
          Are you sure you want to sign out?
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: "2rem", color: "#666" }}
        >
          You can always log back in anytime!
        </Typography>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          
          <Button
            onClick={handleSignOut}
            variant="contained"
            style={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Sign Out
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            style={{
              color: "#666",
              borderColor: "#ddd",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                border: "1px solid black",
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
