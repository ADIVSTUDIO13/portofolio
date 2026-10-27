import Swal from "sweetalert2";

// Custom Obsidian Dark Theme for SweetAlert2
export const customSwal = Swal.mixin({
  background: "#0b0f19",
  color: "#f8fafc",
  customClass: {
    popup: "border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl",
    title: "text-white font-extrabold text-xl",
    htmlContainer: "text-slate-300 text-sm font-sans",
    confirmButton: "px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg cursor-pointer mx-1",
    cancelButton: "px-6 py-2.5 rounded-xl font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer mx-1",
  },
  buttonsStyling: false,
});

export const showSuccessAlert = (title: string, text: string) => {
  return customSwal.fire({
    icon: "success",
    title,
    text,
    iconColor: "#34d399",
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return customSwal.fire({
    icon: "error",
    title,
    text,
    iconColor: "#f43f5e",
  });
};

export const showConfirmDialog = async (title: string, text: string, confirmButtonText = "Ya, Lanjutkan") => {
  const result = await customSwal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Batal",
    iconColor: "#fbbf24",
  });
  return result.isConfirmed;
};

export const showToast = (title: string, icon: "success" | "error" | "info" = "success") => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#0f172a",
    color: "#f8fafc",
    customClass: {
      popup: "border border-slate-800 rounded-2xl shadow-xl",
    },
  });

  Toast.fire({
    icon,
    title,
  });
};
