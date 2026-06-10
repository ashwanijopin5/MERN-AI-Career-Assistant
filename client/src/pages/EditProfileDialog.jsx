import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "@/utils/axios";
import { USER_END_POINT } from "@/utils/constent";

import { setUser } from "@/redux/slices/authSlice";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

function EditProfileDialog({
  open,
  setOpen,
}) {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState(
    user?.name || ""
  );

  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      if (file) {
        formData.append("file", file);
      }

      const res =
        await axiosInstance.put(
          `${USER_END_POINT}/update`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      dispatch(
        setUser({
          ...user,
          ...res.data.userSa,
        })
      );

      toast.success(
        "Profile updated"
      );

      setOpen(false);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

          <Button
            onClick={handleSubmit}
            className="w-full"
          >
            Save Changes
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;